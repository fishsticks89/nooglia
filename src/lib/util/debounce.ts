export function createDebounce(time: number, maxTime: number = 10_000) { 
	let timer: NodeJS.Timeout;
	let starttime = Date.now();

	const debounce = (fn: () => void) => {
		clearTimeout(timer);
		const dbfn = () => {
			fn();
			starttime = Date.now();
		};
		if (Date.now() - starttime < maxTime)
			setTimeout(dbfn, time);
		else
			dbfn
	}
    return debounce;
}