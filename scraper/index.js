import * as puppeteer from 'puppeteer';
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
const chromeopts = {
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    slowMo: 10,
    defaultViewport: null
};
(async () => {
    const browser = await puppeteer.launch(chromeopts);
    const page = await browser.newPage();
    await page.goto('https://quizlet.com/112057156', {
        waitUntil: 'networkidle2',
    });
    const f = await await (await page.$$(".SetPageTerm-content"));
    for (var i = 0; i < f.length; i++) {
        let e = f[i];
        const a = {
            word: await (await e.$(".SetPageTerm-wordText")).evaluate(e => e.innerHTML),
            answer: await (await e.$(".SetPageTerm-definitionText")).evaluate(e => e.innerHTML),
        };
        console.log(a);
    }
    await page.close();
    await browser.close();
})();
//# sourceMappingURL=index.js.map