import * as use from "@tensorflow-models/universal-sentence-encoder"

let mModel: use.UniversalSentenceEncoder | null | Promise<use.UniversalSentenceEncoder> = null;
export async function embed(items: string[]): Promise<Array<number>[]> {
    if (mModel == null) {
        mModel = use.load();
        mModel = await mModel;
    }
    const model: use.UniversalSentenceEncoder = await mModel;

    return await (await model.embed(items)).array();
}

export async function ensureModelInit() {
    if (mModel == null) {
        mModel = use.load();
        mModel = await mModel;
    }
    return await mModel;
}