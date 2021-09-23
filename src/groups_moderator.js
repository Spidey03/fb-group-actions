const { spawn } = require('child_process');
const fs = require('fs');
const ini = require('ini');
const playwright = require("playwright");
const { config } = require('process');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async() => {

    let browserType = "chromium";
    const browser = await playwright[browserType].launch({
        headless: false
    });
    const context = await browser.newContext();

    try {

        const config = ini.parse(fs.readFileSync('config/credentials.ini', 'utf-8'));
        let username = config["Credentials"]["username"]
        let password = config["Credentials"]["password"]
        let bot_id = config['Bot']['id'];

        json_file = "./actions_and_groups.json";
        const actionsAndGroups = require(json_file);

        const page = await context.newPage();
        await page.goto('https://www.facebook.com/groups/discover/');
        await page.fill('input[name=email]', username);
        await page.fill('input[name=pass]', password);
        await page.press('input[name=pass]', 'Enter')
        await page.waitForNavigation();
        await page.waitForResponse(response => {
            return response.request().resourceType() === "xhr"
        })

        for (const key in actionsAndGroups) {
            console.log(`${key} :`)
            for (let group_id of actionsAndGroups[key]) {
                console.log(group_id);
                group_url = "https://www.facebook.com/groups/" + group_id + "/people"
                await page.goto(group_url, { waitUntil: 'networkidle' });
                await page.waitForResponse(response => {
                    return response.request().resourceType() === "xhr"
                })
                if (key == "Male Filtering") {
                    console.log("Removing Male Persons");
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
                            if (gender == "Male" || rec_gender == true) {
                                moreOptionsXPATH = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[3]/div/div[1]/div[2]/div/div/div[2]/div/div/div/div[3]/div';
                                removeMemberXPATH = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[4]/div/div/div[1]/div[1]/div/div/div[1]/div/div[1]/div/div[1]/div/div[7]'

                                await page.waitForSelector(moreOptionsXPATH);
                                await page.click(moreOptionsXPATH);
                                await page.waitForSelector(removeMemberXPATH);
                                await page.click(removeMemberXPATH);

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
                                //pass
                            }
                            await newPage.close();
                            await page.goto(group_url);

                        } catch (error) {
                            console.log(error);
                            break;
                        }
                        i++;
                    }
                } else if (key == "Reminder Invitees") {
                    console.log("Reminding");
                    filterXPATH = 'xpath=/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[2]/div/div/div[1]/div/div/div/div/div/div/span';
                    await page.click(filterXPATH, { waitUntil: 'networkidle' });
                    await page.keyboard.down('ArrowDown');
                    await page.keyboard.down('ArrowDown');
                    await page.keyboard.down('Enter');
                    let i = 1
                    while (i) {
                        moreUserOptionXPATH = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[3]/div/div/div[2]/div[1]/div/div[2]/div/div[' + i + ']/div/div/div[2]/div/div/div/div[1]/span/div/div[2]/div/div[2]/div/div/div';
                        await page.click(moreUserOptionXPATH, { waitUntil: 'networkidle' });
                        await sleep(1000);
                        sendReminderOptionXPATH = 'xpath=//div/div[1]/div/div[3]/div/div/div[2]/div/div/div[1]/div[1]/div/div/div[1]/div/div/div/div[1]/div/div[2]/div[1]/div/div/span';
                        value = await page.textContent(sendReminderOptionXPATH);
                        if (value == "Send reminder") {
                            await page.click(sendReminderOptionXPATH);
                            await page.click('xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div');
                        }
                        i++;
                        await sleep(2000);
                    }
                }
            }
        }
        console.log("Done");
    } catch (error) {
        console.error(`Trying to run test on ${browserType}: ${error}`);
    } finally {
        await browser.close();
    }

})();