import { browser } from "$app/environment";
import mixpanel from "mixpanel-browser";

let readyToMix = false;

try {
    mixpanel.init('7309a913f64760d4b084f0a0922b3d75', {
        debug: !browser,
        loaded: () => {
            readyToMix = true;
        }
    });
} catch (error) {
    console.error(error);
}

export const event = (ev: string) => {
    if (readyToMix)
        mixpanel.track(ev)
    else
        console.error("No mixing? lmao")
}

export const mix = (f: () => void) => {
    if (readyToMix)
        try {
            f()
        } catch (error) {
            console.error(error)
        }
    else
        console.error("No mixing? lmao")
}