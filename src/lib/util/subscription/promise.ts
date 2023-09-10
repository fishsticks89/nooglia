export function promise<T>(): [Promise<T> & {isResolved: boolean, isRejected: boolean}, (value: T) => void, (reason?: any) => void] {
    let resolve: (value: T) => void;
    let reject: (reason?: any) => void;
    const p = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    p.then(() => { });
    const bp = {
        ...p,
        then: p.then.bind(p),
        catch: p.catch.bind(p),
        isResolved: false,
        isRejected: false,
    }
    console.log(bp, p);
    p.then(() => { bp.isResolved = true; });
    p.catch(() => { bp.isRejected = true; });
    return [bp, resolve!, reject!];
}