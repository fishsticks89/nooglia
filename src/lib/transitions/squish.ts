import { cubicIn } from "svelte/easing";

export function squish(
    node: any,
    opts: { isin?: boolean, initialheight: string, }
) {
    const {isin = false, initialheight = "100%"} = opts;
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