import { createCloudSet, newset } from "$lib/data/db";

export const createSet = async (uid: string) => {
    const set = {
        user: uid,
        name: '',
        contents: newset().contents
    };
    return await createCloudSet(set);
}