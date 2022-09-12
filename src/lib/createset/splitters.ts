export const items = [
    { value: /\t */, label: "Tab", char: "\t" },
    { value: /, */, label: "Comma", char: ", " },
    { value: / *- */, label: "Dash", char: " - "},
    { value: /; */, label: "SemiColon", char: "; "},
    { value: /: */, label: "Colon", char: ": "},
].map((e, i) => {
    return { id: i, ...e };
});