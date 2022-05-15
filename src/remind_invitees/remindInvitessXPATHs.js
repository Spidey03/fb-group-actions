function moreUserOption(pos) {
    let moreUserOptionXPATH = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[4]/div/div/div[1]/div/div[' + pos + ']/div/div/div[2]/div/div/div/div[1]/span/div/div[2]/div/div[2]/div/div/div'
    return moreUserOptionXPATH;
}

let filterOption = "xpath=//span[normalize-space()='All statuses']"
let sendReminderOption = "xpath=//span[normalize-space()='Send reminder']"
let confirmButton = "xpath=//span[contains(text(),'Confirm')]";

module.exports = {
    moreUserOption,
    filterOption,
    sendReminderOption,
    confirmButton
}