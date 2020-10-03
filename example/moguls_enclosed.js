import { Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { line } from '../lib/geoHelpers';

export const orientation = Orientation.PORTRAIT;
export const dimensions = [30, 30];  // Almost a foot, in cm.

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;

  const lines = [];
  const L = width;
  const R = L / 2;
  const INNER_R = R - 0.635;  // 1/4 inch.
  const X_0 = width / 2;
  const Y_0 = height / 2;
  const O = [X_0, Y_0];
  const DENSITY = 69;
  const DETAIL = 100;

  // Derived.
  const c = L / 2;
  const max = c * DENSITY * 1.5;
  const dθ = 1 / DETAIL;
  const sizeX = c / 4.9;
  const sizeY = sizeX * 3 / 4;

  const {cos, sin, PI} = Math;

  let points = [], prevPoint = [X_0, Y_0];
  for (let θ = 0; θ < max; θ += dθ) {
    const xSpiral = cos(θ) * θ / DENSITY;
    const ySpiral = sin(θ) * θ / DENSITY;
    const xx = xSpiral / sizeX;
    const xy = xSpiral / sizeY;
    const yx = ySpiral / sizeX;
    const yy = ySpiral / sizeY;
    const x = X_0 + xSpiral + cos(xx) * cos(yx) * sin(yx) * (sizeX + sizeY) / 2;
    const y = Y_0 + ySpiral + sin(xy) * cos(xy) * sin(yy - PI / 2 + cos(θ)) * cos(yx) * sizeY;
    const nextPoint = [x, y];

    const intersection = line(prevPoint, nextPoint).intersects.circle(O, INNER_R);
    switch (intersection.type) {
      case 'inside':
        points.push(nextPoint);
        break;
      case 'outside':
        if (points.length) {
          lines.push(points);
          points = [];
        }
        break;
      case 'exiting':
        points.push(intersection.points[0]);
        lines.push(points);
        points = [];
        break;
      case 'entering':
        if (points.length) lines.push(points);
        points = [intersection.points[0], nextPoint];
        break;
      case 'through':
        if (points.length) lines.push(points);
        lines.push(intersection.points);
        points = [];
        break;
    }

    if (points.length > 1000) {
      lines.push(points);
      points = points.slice(-1);  // Start the line at the previous point to avoid gaps.
    }

    prevPoint = nextPoint;
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
    let groupTwo = polylinesToSVG(lines.slice(lines.length / 2), {dimensions});
    groupTwo = groupTwo.slice(groupTwo.indexOf('<g>'), groupTwo.indexOf('</g>') + 4);
    return polylinesToSVG(lines.slice(0, lines.length / 2), {dimensions})
      .replace('</svg>', groupTwo + '</svg>')
      .replace('</svg>', `${circleHack(X_0, Y_0, R)}${circleHack(X_0, Y_0, INNER_R)}</svg>`);  // :)
  }
}

const px = cm => (35.43307 * cm).toFixed(5);
function circleHack (x, y, r) {
  return `<circle cx="${px(x)}" cy="${px(y)}" r="${px(r)}" fill="none" stroke="black" stroke-width="0.03cm" />`;
}
