const Jasmine = require('jasmine');
const jasmine = new Jasmine();
const puppeteer = require('puppeteer');

const executeJasmine = () => {
    return new Promise((resolve, reject) => {
        jasmine.loadConfig({
            spec_dir: 'test',
            spec_files: [
                'example.js'
            ],
            stopSpecOnExpectationFailure: true,
            random: false,
            // defaultTimeoutInterval: 100000

        });
        jasmine.execute();

        jasmine.onComplete(function(passed) {
            resolve(passed);
        });
    })
};

// executeJasmine()
//     .then(() => {
//         console.log('FINISH !!!');
//     });

(async () => {
    global.browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
        ignoreHTTPSErrors: true,
        args: [
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--enable-features=NetworkService'
        ]
    });
    await executeJasmine();
    console.log('FINISHING +++ !!!');
    await browser.close();
})();
