import { browser } from "$app/env";
import { newset, type set } from "./db";

export const storeLocalSet = (set: set) => {
    localStorage.setItem("localset", JSON.stringify(set))
}
export const getLocalSet = (): set => {
    const localset = (browser) ? localStorage.getItem("localset") : null;
    console.log(localset ? JSON.parse(localset) : null)
    return localset ? JSON.parse(localset) : newset();
}