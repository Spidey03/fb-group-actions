const fs = require('fs');
const ini = require('ini');
const playwright = require("playwright");


(async() => {

    let group_urls = [];
    let browserType = "chromium";
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

        // urls = await page.$$eval('div[data-visualcompletion=ignore-dynamic]>a', (elements) =>
        //     elements.map((el) => el.href)
        // )

        // for (let url of urls) {
        //     if ((url.includes("feed") === false) && (url.includes("discover") === false) && (url.includes("notifications") === false) && (url.includes("groups") === true)) {
        //         group_urls.push(url);
        //     }
        // }
        // console.log(group_urls);
        // group_url = group_urls[0];
        group_url = "https://www.facebook.com/groups/928052944589381/"
        page.goto(group_url.concat("people"));
        await page.waitForNavigation();
        await page.waitForResponse(response => {
            return response.request().resourceType() === "xhr"
        })

        let i = 1;
        while (i > 0) {
            try {
                let xpath = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[3]/div/div/div[2]/div[1]/div/div[2]/div/div[' + i + ']/div/div/div[1]/div/a';
                await page.click(xpath);
                user_profile_url = page.url();
                user_id = user_profile_url.split("/user/")[1];
                console.log(user_id);
                // validate isUser male with new page?
                newPage = await context.newPage();
                let main_profile_url = "https://www.facebook.com/profile.php?id=";
                await newPage.goto(main_profile_url.concat(user_id));
                await newPage.close();
                await page.goBack();

            } catch (error) {
                console.log(error);
                break;
            }
            i++;
        }

        console.log("Done");


    } catch (error) {
        console.error(`Trying to run test on ${browserType}: ${error}`);
    } finally {
        await browser.close();
    }

})();