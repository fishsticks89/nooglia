import { browser } from "$app/environment";
import getJson from "$lib/util/operations/getJson";
import { writable, type Writable } from "svelte/store";
export type valtype = "term" | "definition" | "both";
export interface settings {
    answerWith: valtype;
    showFlashcards: boolean,
    showMultiChoice: boolean,
    showWrite: boolean,
    grindset: boolean, // whether terms will be shown three times no-matter what - otherwise if you get it right on your first try, you are done
    retrieve: boolean;
}
const settingsState: Writable<settings> = writable({
    answerWith: "definition",
    showFlashcards: false,
    showMultiChoice: true,
    showWrite: true,
    grindset: false,
    retrieve: true // occasionally retrieve older terms
})

const getSettings = (obj: settings | null): settings | null => {
    if (obj === null) return null;
    if (typeof obj.answerWith == "string"
        && typeof obj.showFlashcards == "boolean"
        && typeof obj.showMultiChoice == "boolean"
        && typeof obj.showWrite == "boolean"
        && typeof obj.grindset == "boolean"
        && typeof obj.retrieve == "boolean")
        return obj;
    return null;
}

if (browser) {
    const storedSet = getSettings(getJson(localStorage.getItem("localSet")));
    if (storedSet != null)
        settingsState.set(storedSet)

    settingsState.subscribe((unset) => {
        localStorage.setItem("localSet", JSON.stringify(unset))
    });
}

export default settingsState