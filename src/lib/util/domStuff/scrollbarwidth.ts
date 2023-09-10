import { browser } from "$app/environment";
import { readable } from "svelte/store";

export const scrollBarWidth = readable(17, (set) => {
    if (!browser) return () => { };

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) { set(0); return () => { }; }

    const compute = () =>
        set(window.innerWidth - document.documentElement.clientWidth);

    window.addEventListener("resize", compute);

    const observer = new MutationObserver(() => {
        compute();
        setTimeout(() => {
            compute();
        });
    });

    observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
    });

    compute();
    setTimeout(() => {
        compute();
    });

    return () => {
        observer.disconnect();
        window.removeEventListener("resize", compute);
        document.body.removeEventListener("scroll", compute);
    };
});