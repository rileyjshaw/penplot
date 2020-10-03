// Helpers:
const flexy = f => (...args) => args.reduce(f);  // Wraps a function to accept any number of arguments.
const zipWith = (f, ...args) => args[0].map((x, i) => f(x, ...args.slice(1).map(y => y[i])));
const add = flexy((a, b) => a + b);
const sub = flexy((a, b) => a - b);
const mul = flexy((a, b) => a * b);
const dot = (...vectors) => add(...zipWith(mul, ...vectors));

export const point = ([pX, pY]) => ({
	within: {
		circle: ([cX, cY], r, rr = Math.pow(r, 2)) => Math.pow(pX - cX, 2) + Math.pow(pY - cY, 2) <= rr,
	},
});

export const line = (p0, p1) => {
	return {
		intersects: {
			// line: (p2, p3) => {
			// 	var det, gamma, lambda;
			// 	(p1[0] - p0[0]) * (p2[0] - p3[0]) -
			// 	det = (c - a) * (s - q) - (r - p) * (d - b);
			// 	if (det === 0) {
			// 		return false;
			// 	} else {
			// 		lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
			// 		gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
			// 		return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
			// 	}
			// },

			// MathJS solution:
			// function _intersect2d(o1, e1, o2, e2) {  // Origin, endpoint
			// 	var d1 = subtract(o1, e1);
			// 	var d2 = subtract(o2, e2);
			// 	var det = subtract(multiplyScalar(d1[0], d2[1]), multiplyScalar(d2[0], d1[1]));

			// 	if (smaller(abs(det), config.epsilon)) {
			// 	  return null;
			// 	}

			// 	var d20o11 = multiplyScalar(d2[0], o1[1]);
			// 	var d21o10 = multiplyScalar(d2[1], o1[0]);
			// 	var d20o21 = multiplyScalar(d2[0], o2[1]);
			// 	var d21o20 = multiplyScalar(d2[1], o2[0]);
			// 	var t = divideScalar(addScalar(subtract(subtract(d20o11, d21o10), d20o21), d21o20), det);
			// 	return add(multiply(d1, t), o1);
			//   }
			circle: (o, r) => {
				// Return object.
				const intersection = {
					points: [],
					type: 'outside',
				};

				const d = zipWith(sub, p1, p0);  // Direction vector of ray, from start to end.
				const f = zipWith(sub, p0, o);  // Vector from center sphere to ray start.
				const a = dot(d, d);
				const b = 2 * dot(f, d) ;
				const c = dot(f, f) - Math.pow(r, 2);
				let discriminant = Math.pow(b, 2) - 4 * a * c;
				if (discriminant < 0) return intersection;
				discriminant = Math.sqrt(discriminant);

				// t1 is always the smaller value, because both discriminant and
				// a are nonnegative.
				const t1 = (-b - discriminant) / (2 * a);
				const t2 = (-b + discriminant) / (2 * a);
				if (Math.sign(t1) !== Math.sign(t2)) intersection.type = 'inside';

				// Check if there is an intersection "entering" the circle.
				if (t1 >= 0 && t1 <= 1) {
					intersection.type = 'entering';
					intersection.points.push([p0[0] + d[0] * t1, p0[1] + d[1] * t1]);
				}

				// Check if there is an intersection "exiting" the circle.
				if (t2 >= 0 && t2 <= 1) {
					intersection.type = intersection.points.length ? 'through' : 'exiting';
					intersection.points.push([p0[0] + d[0] * t2, p0[1] + d[1] * t2]);
				}

				return intersection;
			},
		},
	};
};
