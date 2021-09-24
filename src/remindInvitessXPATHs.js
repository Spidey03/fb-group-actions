function moreUserOption(pos) {
    let moreUserOptionXPATH = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[4]/div/div/div[1]/div/div[' + pos + ']/div/div/div[2]/div/div/div/div[1]/span/div/div[2]/div/div[2]/div/div/div'
    return moreUserOptionXPATH;
}

let filterOption = 'xpath=/html/body/div[1]/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[2]/div/div/div[1]/div/div/div/div/div/div/span';
let sendReminderOption = 'xpath=//div/div[1]/div/div[3]/div/div/div[2]/div/div/div[1]/div[1]/div/div/div[1]/div/div/div/div[1]/div/div[2]/div[1]/div/div/span';
let confirmButton = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div[3]/div[2]/div[2]/div/div';

module.exports = {
    moreUserOption,
    filterOption,
    sendReminderOption,
    confirmButton
}