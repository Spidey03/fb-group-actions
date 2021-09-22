const { spawn } = require('child_process');
const fs = require('fs');
const ini = require('ini');
const playwright = require("playwright");
const { config } = require('process');


(async() => {

    let group_urls = [];
    let browserType = "chromium";
    const browser = await playwright[browserType].launch({
        headless: false
    });


    try {
        const config = ini.parse(fs.readFileSync('config/credentials.ini', 'utf-8'));
        let username = config["Credentials"]["username"]
        let password = config["Credentials"]["password"]
        let bot_id = config['Bot']['id'];

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

        for (let url of urls) {
            if ((url.includes("feed") === false) && (url.includes("discover") === false) && (url.includes("notifications") === false) && (url.includes("groups") === true)) {
                group_urls.push(url);
            }
        }

        for (group_url of group_urls) {
            page.goto(group_url.concat("people"));
            await page.waitForNavigation();
            await page.waitForResponse(response => {
                return response.request().resourceType() === "xhr"
            })

            let i = 1;
            while (i > 0) {
                try {
                    let xpath = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[3]/div/div/div[2]/div[1]/div/div[2]/div/div[' + i + ']/div/div/div[1]/div/a';
                    await page.click(xpath, { waitUntil: 'networkidle' });

                    await page.waitForResponse(response => {
                        return response.request().resourceType() === "xhr"
                    });
                    let user_profile_url = await page.url();
                    let user_id = await user_profile_url.split("/user/")[1];
                    user_id = await user_id.replace(new RegExp("/", "g"), "");
                    if (user_id == bot_id) {
                        await page.goBack();
                        i++;
                        continue;
                    }

                    // validate isUser male with new page?
                    newPage = await context.newPage();
                    let user_info_url = "https://www.facebook.com/profile.php?id=" + user_id + "&sk=about_contact_and_basic_info";
                    await newPage.goto(user_info_url, { waitUntil: 'networkidle' });
                    await newPage.waitForResponse(response => {
                        return response.request().resourceType() === "xhr"
                    })

                    let gender = undefined;
                    let rec_gender = undefined;
                    try {
                        gender = await page.textContent('xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div/div/div/div[1]/div/div/div/div/div[2]/div/div/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[1]/span');
                    } catch (error) {
                        //aws reckognition
                        rec_gender = false
                    }

                    // remove member from group if Male
                    if (gender == "Male" || rec_gender == true) {
                        more_options_xpath = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[3]/div/div[1]/div[2]/div/div/div[2]/div/div/div/div[3]/div';
                        remove_member_xpath = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[4]/div/div/div[1]/div[1]/div/div/div[1]/div/div[1]/div/div[1]/div/div[7]'

                        await page.waitForSelector(more_options_xpath);
                        await page.click(more_options_xpath);
                        await page.waitForSelector(remove_member_xpath);
                        await page.click(remove_member_xpath);

                        //removing options
                        deleteRecentActivityXPATH = 'xpath=//div/div[1]/div/div[4]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div[2]/div/div[4]/div/div/div/div[2]/div/div/div[2]/div[2]/div/div/div';
                        blockUserXPATH = 'xpath=//div/div[1]/div/div[4]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div[2]/div/div[4]/div/div/div/div[3]/div/div/div[2]/div[2]/div/div/div';
                        blockFutureProfilesXPATH = 'xpath=//div/div[1]/div/div[4]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div[2]/div/div[4]/div/div/div/div[4]/div/div/div[2]/div[2]/div/div/div';
                        applyChangesXPATH = '//div/div[1]/div/div[4]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[3]/div/div[4]/div/div/div/div[2]/div/div/div/div[2]/div/div/div/input';

                        await page.click(deleteRecentActivityXPATH);
                        await page.click(blockUserXPATH);
                        await page.click(blockFutureProfilesXPATH);
                        await page.click('text="Confirm"');
                        i--;
                    } else {
                        console.log(user_id + " Not male");
                    }
                    await newPage.close();
                    await page.goto(group_url.concat("people"));

                } catch (error) {
                    console.log(error);
                    break;
                }
                i++;
            }
        }


        console.log("Done");


    } catch (error) {
        console.error(`Trying to run test on ${browserType}: ${error}`);
    } finally {
        await browser.close();
    }

})();