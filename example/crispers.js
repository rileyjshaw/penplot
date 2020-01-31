import { Orientation } from 'penplot';
import { setSeed } from 'penplot/util/random';
import { polylinesToSVG } from 'penplot/util/svg';

setSeed(2);

export const orientation = Orientation.PORTRAIT;
export const dimensions = [15.4, 15.4];
export const outputImageHeight = 800;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const lines = [];
  const L = width;
  const X_0 = width / 2;
  const Y_0 = height / 2;
  const DENSITY = 70;
  const DETAIL = 500;

  // Derived.
  const c = L / 2;
  const dθ = 1 / DETAIL;
  const sizeX = c / 17.3;
  const sizeY = sizeX;

  const {cos, sin, pow, PI} = Math;

  let x, y;
  let points = [];
  for (let θ = 0, i = 0; θ < 800; θ += dθ) {
    // Illustrator dislikes long lines.
    if (++i === 1000) {
      lines.push(points);
      points = [points[points.length - 1]];
      i = 0;
    }
    const xSpiral = cos(θ) * θ / DENSITY + X_0;
    const ySpiral = sin(θ) * θ / DENSITY + Y_0;
    x = xSpiral + pow(cos(xSpiral / sizeX), 2) * (cos(ySpiral / sizeY)) * (sin(ySpiral / sizeX)) * sizeX;
    y = ySpiral + (sin(xSpiral / sizeY)) * (sin(ySpiral / sizeY)) * (cos(ySpiral / sizeX - 0.1) * 1.1) * sizeX;
    points.push([x, y]);
  }
  lines.push(points);

  return {
    draw,
    print,
    clear: true,
    background: 'white'
  };

  function draw () {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.stroke();
    });
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
