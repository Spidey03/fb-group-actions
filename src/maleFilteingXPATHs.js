function getUserProfile(pos) {
    let userProfileXPATH = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[4]/div/div/div[1]/div/div[' + pos + ']/div/div/div[1]/div/a';
    return userProfileXPATH;
}

let moreOptions = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[1]/div[2]/div/div/div[2]/div/div/div/div[3]/div/div/div[2]'
let genderEl = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div/div/div/div[1]/div/div/div/div/div[2]/div/div/div/div[3]/div[2]/div/div/div[2]/div/div/div/div/div[1]/span';
let removeMember = 'xpath=//div/div[1]/div/div[3]/div/div/div[2]/div/div/div[1]/div[1]/div/div/div[1]/div/div[1]/div/div[1]/div/div[7]/div[2]/div/div/span'

let deleteRecentActivity = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div[2]/div/div[4]/div/div/div/div[2]/div/div/div[2]/div[2]/div/div/div'
let blockUser = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div[2]/div/div[4]/div/div/div/div[3]/div/div/div[2]/div[2]/div/div/div'
let blockFutureProfiles = 'xpath=//div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div[2]/div/div[4]/div/div/div/div[4]/div/div/div[2]/div[2]/div/div/div';
let applyChanges = '//div/div[1]/div/div[4]/div/div/div[2]/div/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[3]/div/div[4]/div/div/div/div[2]/div/div/div/div[2]/div/div/div/input';

module.exports = {
    getUserProfile,
    moreOptions,
    genderEl,
    removeMember,
    deleteRecentActivity,
    blockUser,
    blockFutureProfiles,
    applyChanges
}