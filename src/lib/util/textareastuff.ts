export function resizeinit(text: HTMLTextAreaElement, also: () => void) {
    function resize() {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight + 1 + 'px';
        also();
    }
    /* 0-timeout to get the already changed text */
    function delayedResize() {
        window.setTimeout(resize, 0);
    }
    text.addEventListener('change', resize);
    text.addEventListener('cut', delayedResize);
    text.addEventListener('paste', delayedResize);
    text.addEventListener('drop', delayedResize);
    text.addEventListener('keydown', delayedResize);
    
    window.addEventListener('resize', delayedResize);

    function removeNewLines() {
        text.value = text.value.split('\n').join('');
    }

    text.addEventListener('change', removeNewLines);
    text.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') e.preventDefault();
    });

    resize();
    setTimeout(also, 100)
}