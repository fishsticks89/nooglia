export default function elasticOut(t: number, magnitude: number) {
	return (
		Math.sin((-13.0 * (t + 1.0) * Math.PI) / 2) * Math.pow(2.0, -10.0 * magnitude) + 1.0
	);
}