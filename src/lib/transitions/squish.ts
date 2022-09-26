import { cubicIn, cubicOut } from "svelte/easing";

export function squish(
    node: any,
    { isin = true, initialheight = "100%" }: { isin: boolean, initialheight: string }
) {
    return {
        duration: 350,
        css: (t: number) => {
            const asdf = cubicIn(t);
            const eased = isin ? 1 - asdf : asdf;
            return `
                height: calc(${eased} * ${initialheight});
                margin: 0px;
                padding: 0px;
            `;
        },
    };
}