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
    let groupURL = "https://www.facebook.com/groups/" + groupID + "/people/members/";
    return groupURL;
}

function getUserIdFromURL(profileURL) {
    let userID = profileURL.split("/user/")[1];
    userID = userID.split("/")[0];
    return userID
}

function getUserProfileURL(userID) {
    let userProfileURL = "https://www.facebook.com/profile.php?id=" + userID + "&sk=about_contact_and_basic_info";
    return userProfileURL;
}

async function scrollOnElement(page, selector) {
    await page.$eval(selector, (element) => {
        element.scrollIntoView();
    });
}

async function loginToAccount(loginPage) {
    const config = ini.parse(fs.readFileSync('config/credentials.ini', 'utf-8'));
    let username = config["Credentials"]["username"];
    let password = config["Credentials"]["password"];
    await loginPage.goto('https://www.facebook.com/groups/discover/');
    await loginPage.fill('input[name=email]', username);
    await loginPage.fill('input[name=pass]', password);
    await loginPage.press('input[name=pass]', 'Enter')
    await loginPage.waitForNavigation();
    await loginPage.waitForResponse(response => {
        return response.request().resourceType() === "xhr"
    })
}

async function getGenderOfUser(context, userProfileURL) {
    profilePage = await context.newPage();
    await profilePage.goto(userProfileURL, { waitUntil: 'networkidle' });
    await profilePage.waitForResponse(response => {
        return response.request().resourceType() === "xhr"
    })
    await sleep(4000);
    gender = await profilePage.textContent(maleFilteingXPATHs.genderEl);
    profilePage.close();
    return gender
}

async function removeMemberFromGroup(context, userProfileImageURL) {
    memberURL = 'https://www.facebook.com' + userProfileImageURL;
    memberPage = await context.newPage();
    await memberPage.goto(memberURL, { waitUntil: 'networkidle' });
    await memberPage.waitForResponse(response => {
        return response.request().resourceType() === "xhr"
    });
    await sleep(2000);
    await memberPage.click(maleFilteingXPATHs.moreOptions);
    await sleep(2000);
    try {
        await memberPage.click(maleFilteingXPATHs.removeMember);
        await sleep(1000);
        await memberPage.click(maleFilteingXPATHs.deleteRecentActivity);
        await sleep(1000);
        await memberPage.click(maleFilteingXPATHs.blockUser);
        await sleep(1000);
        await memberPage.click(maleFilteingXPATHs.blockFutureProfiles);
        await sleep(1000);
        await memberPage.click('text="Confirm"');

    } catch (error) {
        //pass
    }
    memberPage.close();
}

async function checkAndRemoveMembersIfMale(context, groupPage) {

}

async function remindInvitees(groupPage) {
    console.log("Reminding");
    await groupPage.click(remindInvitessXPATHs.filterOption, { waitUntil: 'networkidle' });
    await groupPage.keyboard.down('ArrowDown');
    await groupPage.keyboard.down('ArrowDown');
    await groupPage.keyboard.down('Enter');
    let pos = 1
    while (pos) {
        let userOptions = remindInvitessXPATHs.moreUserOption(pos);
        await sleep(2000);
        scrollOnElement(groupPage, userOptions);
        await groupPage.click(userOptions, { waitUntil: 'load' });
        await sleep(3000);
        value = await groupPage.textContent(remindInvitessXPATHs.sendReminderOption);
        if (value == "Send reminder") {
            await groupPage.click(remindInvitessXPATHs.sendReminderOption);
            await sleep(1000);
            await groupPage.click(remindInvitessXPATHs.confirmButton);
        }
        pos++;
        await sleep(2000);
    }
}

(async() => {

    let browserType = "chromium";
    const browser = await playwright[browserType].launch({
        headless: false
    });
    const context = await browser.newContext();

    try {
        const loginPage = await context.newPage();
        await loginToAccount(loginPage);

        const groupPage = await context.newPage();
        await loginPage.close()

        json_file = "./actions_and_groups.json";
        const actionsAndGroups = require(json_file);
        for (const key in actionsAndGroups) {
            console.log(`${key} :`)
            for (let groupID of actionsAndGroups[key]) {
                console.log(groupID);
                groupURL = getGroupURL(groupID);
                await groupPage.goto(groupURL, { waitUntil: 'networkidle' });
                await groupPage.waitForResponse(response => {
                    return response.request().resourceType() === "xhr"
                })
                if (key == "Male Filtering") {
                    console.log("Removing Male Persons...");
                    let pos = 1;
                    while (pos) {
                        try {
                            await sleep(2000);
                            let userProfileImage = maleFilteingXPATHs.getUserProfile(pos);
                            scrollOnElement(groupPage, userProfileImage);
                            let userProfileImageURL = await groupPage.getAttribute(userProfileImage, 'href');
                            await sleep(2000);
                            userID = await getUserIdFromURL(userProfileImageURL);
                            let userProfileURL = await getUserProfileURL(userID);
                            let gender = rec_gender = undefined;
                            try {
                                gender = await getGenderOfUser(context, userProfileURL)
                            } catch (error) {
                                //aws reckognition
                                rec_gender = false
                            }
                            await profilePage.close();
                            if (gender == "Male" || rec_gender == true) {
                                await removeMemberFromGroup(context, userProfileImageURL)
                            }
                            await sleep(4000);

                        } catch (error) {
                            console.log(error);
                            break;
                        }
                        pos++;
                    }
                } else if (key == "Reminder Invitees") {
                    await remindInvitees(groupPage)
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