export function hash(contents: string) {
    var hash = 0,
        i, chr;
    if (contents.length === 0) return hash;
    for (i = 0; i < contents.length; i++) {
        chr = contents.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}