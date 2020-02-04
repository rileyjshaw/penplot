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
