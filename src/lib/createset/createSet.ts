import { createCloudSet, newset } from "$lib/data/db";

export const createSet = (uid: string, callback: (url: string) => void) => {
    const set = {
        user: uid,
        name: '',
        contents: newset().contents
    };
    createCloudSet(set).then((setref) => {
        callback('/set/' + setref.id);
    });
}