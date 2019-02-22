const chai = require('chai');
let page;

sleep = (timeout = 10000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`sleep ${timeout} ms`);
            resolve();
        }, timeout);
    })
};

wait = async (callback,timeout = 10000) => {
    const start = Date.now();
    async function waitCallback() {
        const state = await callback();
        const delta = Date.now() - start;
        if (state) {
            return;
        } else if (delta > timeout){
            throw new Error(`Wait fails because of timeout = ${timeout}`);
        } else {
            await sleep(200);
            await waitCallback();
        }
    }
    await waitCallback();
};

describe('example spec', function() {

    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        // browser = await puppeteer.launch({headless: false});
    });

    // afterAll(async () => {
    //     await browser.close();
    // });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto('https://github.com/');
    });

    afterEach(() => page.close());

    it('start test',async function() {
        // // this.timeout('10sec');
        const title = await page.title();
        chai.expect(title).to.equal('The world’s leading software development platform · GitHub');
    });

    it('second test',async function() {
        // // this.timeout('10sec');
        // await sleep(5000);
        const welcomeTitle = await page.$('.h000-mktg');
        // const json = await welcomeTitle.toString();
        const text = await page.evaluate(element => element.textContent, welcomeTitle);
        chai.expect(text).to.equal('Built for developers2');
    });

    it('third test',async function() {
        // // this.timeout('10sec');
        const email = await page.$('[id*="login"]');
        await email.type('qwerty');
        await page.waitForSelector('.error', {visible:true, timeout:5000});
        const errorMessage = await page.$('.error');
        // const json = await welcomeTitle.toString();
        const errText = await page.evaluate(element => element.textContent, errorMessage);
        chai.expect(errText).to.equal('Username is already taken');
    });

    it('fourth test',async function() {
        await page.setRequestInterception(true);
        function headers(req){
            const headers = req.headers();
            console.log(headers);
            // console.log(req);
            console.log('\n============================\n');
            req.continue();
        }
        page.on('request', headers);
        await page.goto('https://github.com/');
        page.removeListener('request', headers);
        await page.setRequestInterception(false);
        const submitBtn = await page.$('[type="submit"]');
        await submitBtn.click();
        await wait(async() => {
            try{
                const title = await page.title();
                console.log(title);
                return title !== 'The world’s leading software development platform · GitHub'
            } catch (err){
                console.log('error occurs');
                return false;
            }
        });
        const title = await page.title();
        chai.expect(title).to.equal('Join GitHub · GitHub');
    });
});