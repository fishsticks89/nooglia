import { cubicIn, cubicOut, quadIn, quadOut } from "svelte/easing";

export function flyin(
    node: any,
    { isin = true, additionalTransforms = "", duration }: { isin: boolean, additionalTransforms: string, duration?: number }
) {
    return {
        duration: duration ? duration : 200,
        css: (t: number) => {
            const asdf = cubicOut(t);
            const eased = isin ? asdf : 1 - asdf;
            return `
            opacity: ${t * 100}%;
            transform: translateY(${
                (isin ? 1 - eased : -eased) * 100
            }px) ${additionalTransforms};
            `;
        },
    };
}

export function flyin2(
    node: any,
    { isin = true, additionalTransforms = "", duration = undefined }: { isin: boolean, additionalTransforms: string, duration: undefined | number }
) {
    return {
        duration: duration ? duration : 200,
        css: (t: number) => {
            const asdf = cubicOut(t);
            const eased = isin ? asdf : 1 - asdf;
            return `
            opacity: ${t * 100}%;
            transform: translateY(${
                (isin ? 1 - eased : -eased) * 100
            }px) ${additionalTransforms};
            `;
        },
    };
}