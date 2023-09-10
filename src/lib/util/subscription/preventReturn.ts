import { createDebounce } from "../time/debounce";

export function preventReturn<T>(isDifferent: (ours: T, newVal: T) => boolean, duration: number = 20): [(sendVal: T) => void, (newVal: T) => boolean] {
    let sentVals: {
        val: T,
        time: number
    }[] = [];
    const deboReset = createDebounce(2, 4);
    return [
        (newVal: T) => {
            sentVals.push({
                val: newVal,
                time: Date.now()
            });
            deboReset(() => {
                setTimeout(() => {
                    sentVals = sentVals.filter((e) => e.time + duration > Date.now());
                }, duration);
            });
        },
        (newVal: T) => {
            for (const sentVal of sentVals) {
                if (!isDifferent(sentVal.val, newVal)) {
                    return true;
                }
            }
            return false;
        },
    ];
}