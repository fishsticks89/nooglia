import { cubicIn, cubicOut } from "svelte/easing";

export function squish(
    node: any,
    opts: { isin?: boolean, initialheight?: string, usetransform?: boolean }
) {
    const {isin = false, initialheight = "100%", usetransform = true} = opts;
    return {
        duration: 350,
        css: (t: number) => {
            const asdf = cubicIn(t);
            const eased = isin ? 1 - asdf : asdf;
            return (!usetransform) ? `
                height: calc(${eased} * ${initialheight});
                margin: 0px;
                padding: 0px;
            ` : `
                transform: scaleY(${eased * 100  + ((isin) ? -100 : 0)}%);
            `;
        },
    };
}