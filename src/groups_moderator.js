const playwright = require("playwright");

const account = require("./account");
const genderFilter = require("./gender_filtering/index");
const remindInvitees = require("./remind_invitees/index");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getGroupsAndActions() {
    json_file = "./groupsAndActions.json";
    const actionsAndGroups = require(json_file);
    return actionsAndGroups
}

function getGroupURL(groupID) {
    let groupURL = "https://www.facebook.com/groups/" + groupID + "/people/members/";
    return groupURL;
}

async function navigateToGroup(groupID, groupPage) {
    console.log(groupID);
    groupURL = getGroupURL(groupID);
    await groupPage.goto(groupURL, { waitUntil: 'networkidle' });
    await groupPage.waitForResponse(response => {
        return response.request().resourceType() === "xhr"
    });
}

(async() => {

    let browserType = "chromium";
    const browser = await playwright[browserType].launch({
        headless: false
    });
    const context = await browser.newContext();

    try {
        const loginPage = await context.newPage();
        await account.loginToAccount(loginPage);
        const groupPage = await context.newPage();
        await loginPage.close()

        actionsAndGroups = getGroupsAndActions();
        for (let group of actionsAndGroups["groups"]) {
            groupID = group.groupID;
            await navigateToGroup(groupID, groupPage);
            if (group.isGenderFilter) {
                console.log("Gender Filter");
                memberPage = await context.newPage();
                profilePage = await context.newPage();
                await genderFilter.main(groupPage, memberPage, profilePage);
                await memberPage.close();
                await profilePage.close();
            }
            if (group.isReminderInvitees) {
                await remindInvitees.main(groupPage)
            }
        }
    } catch (error) {
        console.error(`Trying to run test on ${browserType}: ${error}`);
    } finally {
        await browser.close();
    }
})();