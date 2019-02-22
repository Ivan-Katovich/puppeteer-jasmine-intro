const puppeteer = require('puppeteer');

sleep = (timeout = 10000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`sleep ${timeout} ms`);
            resolve();
        }, timeout);
    })
};

(async () => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    console.log('1111111111');
    await page.goto('https://github.com/');
    await sleep(5000);
    await page.setRequestInterception(true);
    console.log('22222222222222');
    page.on('request', req => {
        const headers = req.headers();
        console.log(headers);
        req.continue();
    });
    await page.goto('https://github.com/');
    page.removeListener('request', () => {});
    await page.setRequestInterception(false);
    await browser.close();
})();