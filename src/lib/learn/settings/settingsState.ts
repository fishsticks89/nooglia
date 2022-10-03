import { browser } from "$app/environment";
import getJson from "$lib/util/getJson";
import { get, writable, type Writable } from "svelte/store";
export type valtype = "term" | "definition" | "both";
export interface settings {
    answerWith: valtype;
    showFlashcards: boolean,
    showMultiChoice: boolean,
    showWrite: boolean,
    grindset: boolean, // whether terms will be shown three times no-matter what - otherwise if you get it right on your first try, you are done
}
const settingsState: Writable<settings> = writable({
    answerWith: "definition",
    showFlashcards: false,
    showMultiChoice: true,
    showWrite: true,
    grindset: false
})

const getSettings = (obj: any): settings | null => {
    if (obj === null) return null;
    if (typeof obj.answerWith == "string"
        && typeof obj.showFlashcards == "boolean"
        && typeof obj.showMultiChoice == "boolean"
        && obj.showWrite == "boolean"
        && obj.grindset == "boolean")
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

    console.log(get(settingsState))
}

export default settingsState