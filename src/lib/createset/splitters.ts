export const items = [
    { value: /\t */, label: "Tab" },
    { value: /, */, label: "Comma" },
    { value: /- */, label: "Dash" },
    { value: /; */, label: "SemiColon" },
    { value: /: */, label: "Colon" },
].map((e, i) => {
    return { id: i, ...e };
});