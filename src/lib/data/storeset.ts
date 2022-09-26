import { browser } from "$app/environment";
import { newset, type set } from "./db";

export const storeLocalSet = (set: set) => {
    localStorage.setItem("localset", JSON.stringify(set))
}
export const getLocalSet = (): { set: set, isNew: boolean } => {
    const localset = (browser) ? localStorage.getItem("localset") : null;
    return localset ? { set: JSON.parse(localset), isNew: false } : { set: newset(), isNew: true };
}