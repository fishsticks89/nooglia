export function createDebounce(time: number) { 
	let timer: NodeJS.Timeout;

	const debounce = (fn: () => void) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn();
		}, time);
	}
    return debounce;
}