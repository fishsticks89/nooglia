import { browser } from "$app/environment";

export const event = (ev: string) => {
    if (browser)
        if ((window as any).mixEvent)
            (window as any).mixEvent(ev)
        else
            console.error("No mixing? lmao")
}

export const mix = (f: (mixpanel: any) => void) => {
    if (browser)
        if ((window as any).mix)
            (window as any).mix(f)
        else
            console.error("No mixing? lmao")
}