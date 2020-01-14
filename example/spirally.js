/*
  This is a basic example of a plot that could be sent
  to AxiDraw V3 and similar pen plotters.
*/

import newArray from 'new-array';

import { PaperSize, Orientation } from 'penplot';
import { randomFloat, setSeed } from 'penplot/util/random';
import { polylinesToSVG } from 'penplot/util/svg';

setSeed(2);

export const orientation = Orientation.PORTRAIT;
export const dimensions = PaperSize.SQUARE_POSTER;
export const outputImageHeight = 800;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  // const lines = newArray(lineCount).map((_, j) => {
  //   const angleOffset = randomFloat(-Math.PI * 2, Math.PI * 2);
  //   const angleScale = randomFloat(0.001, 1);

  //   return newArray(segments).map((_, i) => {
  //     const t = i / (segments - 1);
  //     const angle = (Math.PI * 2 * t + angleOffset) * angleScale;
  //     const x = Math.cos(angle);
  //     const y = Math.sin(angle);
  //     const offset = j * 0.2;
  //     const r = radius + offset;
  //     return [ x * r + width / 2, y * r + height / 2 ];
  //   });
  // });

  const lines = [];
	const L = width;
	const X_0 = width / 2;
	const Y_0 = height / 2;
	const DENSITY = 60;
	const DETAIL = 60;
	const ON = 12;
	const OFF = 14;
	const START = 400;

	// Derived.
	const c = L / 2;
	const max = c * DENSITY * 100;
	const dθ = 1 / DETAIL;
	const size = c / 10;
	const TOT = ON + OFF;

	const {cos, sin} = Math;

	let θ = 0, x, y;
	for (let i = START; i < max; i += TOT) {
		const points = [];
		for (let j = 0, θ = dθ * i; j < ON; ++j, θ += dθ) {
			const xSpiral = cos(θ) * θ / DENSITY + X_0;
			const ySpiral = sin(θ) * θ / DENSITY + Y_0;
			x = xSpiral + sin(xSpiral / size) * sin(ySpiral / size) * size;
			y = ySpiral + sin(xSpiral / size) * sin(ySpiral / size) * size;
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
