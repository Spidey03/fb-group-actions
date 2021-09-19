const fs = require('fs');
const ini = require('ini');
const playwright = require("playwright");


(async() => {

    //open browser
    let browserType = "chromium"
    const browser = await playwright[browserType].launch({
        headless: false
    });

    try {
        const credentials = ini.parse(fs.readFileSync('config/credentials.ini', 'utf-8'))["Credentials"];
        let username = credentials["username"]
        let password = credentials["password"]

        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://www.facebook.com/groups/discover/');
        await page.fill('input[name=email]', username);
        await page.fill('input[name=pass]', password);
        await page.press('input[name=pass]', 'Enter')
        await page.waitForNavigation();

    } catch (error) {
        console.error(`Trying to run test on ${browserType}: ${error}`);
    } finally {
        // await browser.close();
    }


    //close
})();