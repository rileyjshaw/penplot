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
  const DENSITY = 60;
  const DETAIL = 60;
  const ON = 60;
  const OFF = 37;
  const START = 900;

  // Derived.
  const c = L / 2;
  const max = c * DENSITY * 100;
  const dθ = 1 / DETAIL;
  const sizeX = c / 10;
  const sizeY = sizeX / 2;
  const TOT = ON + OFF;

  const {cos, sin, pow} = Math;

  let θ = 0, x, y;
  for (let i = START; i < max; i += TOT) {
    const points = [];
    for (let j = 0, θ = dθ * i; j < ON; ++j, θ += dθ) {
      const xSpiral = cos(θ) * θ / DENSITY + X_0;
      const ySpiral = sin(θ) * θ / DENSITY + Y_0;
      x = xSpiral + pow(cos(xSpiral / sizeX), 2) * cos(ySpiral / sizeX) * sin(ySpiral / sizeX) * sizeX;
      y = ySpiral + sin(xSpiral / sizeY) * cos(xSpiral / sizeY) * sin(ySpiral / sizeY) * cos(ySpiral / sizeX) * sizeY;
      console.log(x, y);
      points.push([x, y]);
    }

    lines.push(points);
  }

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
