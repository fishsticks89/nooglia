import { browser, dev } from "$app/environment";

let readyToMix = false;

export const event = (ev: string) => {
    if (browser)
        if ((window as any).mixEvent)
            (window as any).mixEvent(ev)
        else
            console.error("No mixing? lmao")
}

export const mix = (f: () => void) => {
    if (browser)
        if ((window as any).mix)
            (window as any).mix(f)
        else
            console.error("No mixing? lmao")
}