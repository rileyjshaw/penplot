import { Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';

export const orientation = Orientation.PORTRAIT;
export const dimensions = [30.48, 30.48];  // In cm.

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const lines = [];
  const L = width;
  const R = L / 2;
  const INNER_R = R - 0.5;
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

  const {cos, sin, hypot, PI} = Math;

  let x, y, points = [], outOfBounds = false;
  for (let θ = 0, lineLimiter = 0; θ < max; θ += dθ) {
    const xSpiral = cos(θ) * θ / DENSITY;
    const ySpiral = sin(θ) * θ / DENSITY;
    const xx = xSpiral / sizeX;
    const xy = xSpiral / sizeY;
    const yx = ySpiral / sizeX;
    const yy = ySpiral / sizeY;
    x = xSpiral + cos(xx) * cos(yx) * sin(yx) * (sizeX + sizeY) / 2;
	y = ySpiral + sin(xy) * cos(xy) * sin(yy - PI / 2 + cos(θ)) * cos(yx) * sizeY;
	if (hypot(x, y) < INNER_R) {
		if (outOfBounds || ++lineLimiter > 1000) {
			outOfBounds = false;
			lineLimiter = 0;
			lines.push(points);
			points = [];
		}
		points.push([x + X_0, y + Y_0]);
	} else {
		outOfBounds = true;
	}
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

	context.beginPath();
	context.arc(X_0, Y_0, R, 0, PI * 2);
	context.stroke();

	context.beginPath();
	context.arc(X_0, Y_0, INNER_R, 0, PI * 2);
	context.stroke();
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
