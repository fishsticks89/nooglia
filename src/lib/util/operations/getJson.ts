export default function getJson(str: string | null): any | null {
    if (str != null)
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
    return null;
}