export function createDebounce(time: number, maxTime: number = 10_000) {
	let timer: NodeJS.Timeout | undefined;
	let starttime = Date.now();

	const debounce = (fn: () => void) => {
		clearTimeout(timer);
		const dbfn = () => {
			fn();
			starttime = Date.now();
		};
		if (Date.now() - starttime < maxTime) {
			timer = setTimeout(dbfn, time);
		} else {
			dbfn();
			timer = undefined;
		}
	}
	return debounce;
}