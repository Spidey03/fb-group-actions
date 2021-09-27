const remindInvitessXPATHs = require("./remindInvitessXPATHs")
const scrollOnElement = require("./scrollOnElement")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(groupPage) {
    console.log("Reminding");
    await groupPage.click(remindInvitessXPATHs.filterOption, { waitUntil: 'networkidle' });
    await groupPage.keyboard.down('ArrowDown');
    await groupPage.keyboard.down('ArrowDown');
    await groupPage.keyboard.down('Enter');
    let pos = 1
    while (pos) {
        try {
            let userOptions = remindInvitessXPATHs.moreUserOption(pos);
            await sleep(2000);
            scrollOnElement.scrollOnElement(groupPage, userOptions);
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
        } catch (error) {
            return
        }
    }
}

module.exports = {
    main
}