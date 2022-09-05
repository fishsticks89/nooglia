import { cubicIn, cubicOut, quadIn, quadOut } from "svelte/easing";

export function flyin(
    node: any,
    { isin = true, additionalTransforms = "" }: { isin: boolean, additionalTransforms: string }
) {
    return {
        duration: 200,
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