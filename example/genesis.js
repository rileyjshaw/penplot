/*
  This is a basic example of a plot that could be sent
  to AxiDraw V3 and similar pen plotters.
*/

import newArray from 'new-array';

import { PaperSize, Orientation } from 'penplot';
import { setSeed } from 'penplot/util/random';
import { polylinesToSVG } from 'penplot/util/svg';

setSeed(2);

export const orientation = Orientation.PORTRAIT;
export const dimensions = PaperSize.SQUARE_POSTER;
export const outputImageHeight = 800;

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
  const max = c * DENSITY * 2;
  const dθ = 1 / DETAIL;
  const sizeX = c / 1.88;
  const sizeY = sizeX / 1.33333;

  const {cos, sin, pow, PI} = Math;

  let x, y;
  const points = [];
  for (let θ = 0; θ < max; θ += dθ) {
    const xSpiral = cos(θ) * θ / DENSITY;
    const ySpiral = sin(θ) * θ / DENSITY;
    x = xSpiral + pow(cos(xSpiral / sizeX), 2) * (cos(ySpiral / sizeY + 10)) * (sin(xSpiral / sizeX/1.05)) * sizeX;
    y = ySpiral + (cos(ySpiral / sizeY + PI / 2)) * (sin(ySpiral / sizeY)) * (cos(xSpiral / sizeY)) * sizeY;
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
