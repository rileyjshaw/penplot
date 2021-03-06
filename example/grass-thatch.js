import { PaperSize, Orientation } from 'penplot';
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
  const DENSITY = 53;
  const DETAIL = 500;

  // Derived.
  const c = L / 2;
  const max = c * DENSITY * 100;
  const dθ = 1 / DETAIL;
  const sizeX = c / 17.3;
  const sizeY = sizeX;

  const {cos, sin, pow, PI} = Math;

  let x, y;
  const points = [];
  for (let θ = 0; θ < 2000; θ += dθ) {
    const xSpiral = cos(θ) * θ / DENSITY + X_0;
    const ySpiral = sin(θ) * θ / DENSITY + Y_0;
    x = xSpiral + pow(cos(xSpiral / sizeX), 2) * (cos(ySpiral / sizeX)) * (sin(ySpiral / sizeX)) * sizeX;
    y = ySpiral + pow(sin(xSpiral / sizeY), 2)* sizeY;
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
