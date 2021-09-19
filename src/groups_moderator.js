const fs = require('fs');
const ini = require('ini');
const playwright = require("playwright");


(async() => {

    let group_urls = []
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
        await page.waitForResponse(response => {
            return response.request().resourceType() === "xhr"
        })

        urls = await page.$$eval('div[data-visualcompletion=ignore-dynamic]>a', (elements) =>
            elements.map((el) => el.href)
        )
        const hasGroupinURL = (str, groups) => {
            str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).exclude(word);

        }


        for (let url of urls) {
            if ((url.includes("feed") === false) && (url.includes("discover") === false) && (url.includes("notifications") === false) && (url.includes("groups") === true)) {
                group_urls.push(url);
            }
        }
        console.log(group_urls);

    } catch (error) {
        console.error(`Trying to run test on ${browserType}: ${error}`);
    } finally {
        await browser.close();
    }

})();