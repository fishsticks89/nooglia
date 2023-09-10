export function deSpam (duration: number) {
    let last = 0;
    return function () {
        const now = Date.now();
        return (now - last > duration) 
    }
}