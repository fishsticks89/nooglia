import { log } from "@tensorflow/tfjs-core/dist/log";

export function dot(a: number[], b: number[]) {
    var sum = 0;
    if (a.length != b.length)
        throw "lengths must match"

    for (let key = 0; key < a.length; key++) {
        sum += a[key] * b[key];
    }
    return sum;
}

export function similarity(a: number[], b: number[]) {
    var magnitudeA = Math.sqrt(dot(a, a));
    var magnitudeB = Math.sqrt(dot(b, b));
    if (magnitudeA && magnitudeB)
        return dot(a, b) / (magnitudeA * magnitudeB);
    else return false;
}