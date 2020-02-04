import { Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';

export const orientation = Orientation.PORTRAIT;
export const dimensions = [46, 46];  // In cm.

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const lines = [];
  const L = width;
  const X_0 = width / 2;
  const Y_0 = height / 2;
  const DENSITY = 40;
  const DETAIL = 800;

  // Derived.
  const c = L / 2;
  const max = c * DENSITY * 1.5;
  const dθ = 1 / DETAIL;
  const sizeX = c / 4.9;
  const sizeY = sizeX * 3 / 4;

  const {cos, sin, PI} = Math;

  let x, y;
  const points = [];
  for (let θ = 0; θ < max; θ += dθ) {
    const xSpiral = cos(θ) * θ / DENSITY;
    const ySpiral = sin(θ) * θ / DENSITY;
    const xx = xSpiral / sizeX;
    const xy = xSpiral / sizeY;
    const yx = ySpiral / sizeX;
    const yy = ySpiral / sizeY;
    x = xSpiral + cos(xx) * cos(yx) * sin(yx) * (sizeX + sizeY) / 2;
    y = ySpiral + sin(xy) * cos(xy) * sin(yy - PI / 2 + cos(θ)) * cos(yx) * sizeY;
    points.push([x + X_0, y + Y_0]);
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
