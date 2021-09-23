const { spawn } = require('child_process');
const fs = require('fs');
const ini = require('ini');
const playwright = require("playwright");
const { config } = require('process');
const maleFilteingXPATHs = require("./maleFilteingXPATHs")
const remindInvitessXPATHs = require("./remindInvitessXPATHs")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getGroupURL(groupID) {
    let groupURL = "https://www.facebook.com/groups/" + groupID + "/people";
    return groupURL;
}

function getUserIdFromURL(profileURL) {
    let userID = profileURL.split("/user/")[1];
    userID = userID.replace(new RegExp("/", "g"), "");
    return userID
}

function getUserProfileURL(userID) {
    let userProfileURL = "https://www.facebook.com/profile.php?id=" + userID + "&sk=about_contact_and_basic_info";
    return userProfileURL;
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
        let botID = config['Bot']['id'];
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
            for (let groupID of actionsAndGroups[key]) {
                console.log(groupID);
                groupURL = getGroupURL(groupID);
                await page.goto(groupURL, { waitUntil: 'networkidle' });
                await page.waitForResponse(response => {
                    return response.request().resourceType() === "xhr"
                })
                if (key == "Male Filtering") {
                    console.log("Removing Male Persons");
                    let pos = 1;
                    while (pos > 0) {
                        try {
                            let userProfileImage = maleFilteingXPATHs.getUserProfile(pos)
                            await sleep(3000);

                            await page.click(userProfileImage, { waitUntil: 'networkidle' });
                            await page.waitForResponse(response => {
                                return response.request().resourceType() === "xhr"
                            });
                            let profileURL = await page.url();
                            await sleep(2000);
                            userID = await getUserIdFromURL(profileURL);
                            if (userID == botID) {
                                await page.goBack();
                                pos++;
                                continue;
                            }

                            newPage = await context.newPage();
                            let userProfileURL = await getUserProfileURL(userID);
                            await newPage.goto(userProfileURL, { waitUntil: 'networkidle' });
                            await newPage.waitForResponse(response => {
                                return response.request().resourceType() === "xhr"
                            })
                            await sleep(3000);

                            let gender = rec_gender = undefined;
                            gender = await newPage.textContent(maleFilteingXPATHs.genderEl);
                            if (gender == undefined) {
                                //aws reckognition
                                rec_gender = false
                            }
                            console.log(userID + " " + gender);
                            if (gender == "Male" || rec_gender == true) {
                                await page.waitForSelector(maleFilteingXPATHs.moreOptions);
                                await page.click(maleFilteingXPATHs.moreOptions);
                                await sleep(2000);
                                if ("Remove member" == await page.textContent(maleFilteingXPATHs.removeMember)) {
                                    await page.click(maleFilteingXPATHs.removeMember);
                                    await page.click(maleFilteingXPATHs.deleteRecentActivity);
                                    await page.click(maleFilteingXPATHs.blockUser);
                                    await page.click(maleFilteingXPATHs.blockFutureProfiles);
                                    await page.click('text="Confirm"');
                                    pos--;
                                }
                            }
                            await newPage.close();
                            await sleep(4000);
                            await page.goto(groupURL);

                        } catch (error) {
                            console.log(error);
                            break;
                        }
                        pos++;
                    }
                } else if (key == "Reminder Invitees") {
                    console.log("Reminding");
                    await page.click(remindInvitessXPATHs.filterOption, { waitUntil: 'networkidle' });
                    await page.keyboard.down('ArrowDown');
                    await page.keyboard.down('ArrowDown');
                    await page.keyboard.down('Enter');
                    let pos = 1
                    while (pos) {
                        await page.click(remindInvitessXPATHs.moreUserOption(pos), { waitUntil: 'load' });
                        await sleep(3000);
                        value = await page.textContent(remindInvitessXPATHs.sendReminderOption);
                        await console.log(value)
                        if (value == "Send reminder") {
                            await page.click(remindInvitessXPATHs.sendReminderOption);
                            await page.click(remindInvitessXPATHs.confirmButton);
                        }
                        pos++;
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