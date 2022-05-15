function getUserProfile(pos) {
    let userProfileXPATH = 'xpath=//div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div[4]/div/div/div/div/div/div/div/div/div/div/div[4]/div/div/div[1]/div/div[' + pos + ']/div/div/div[1]/div/a';;
    return userProfileXPATH;
}
let genderEl = "xpath=//span[normalize-space()='Male']";

let moreOptions = "xpath=//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 hv4rvrfc dati1w0a tdjehn4e tv7at329']//div[@class='bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4']"
let removeMember = "xpath=//span[normalize-space()='Remove member']"
let deleteRecentActivity = "xpath=/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[4]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]"
let blockUser = "xpath=/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/div[4]/div[1]/div[1]/div[1]/div[3]/div[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]";
let blockFutureProfiles = "xpath=//div[@aria-checked='false']"

module.exports = {
    getUserProfile,
    moreOptions,
    genderEl,
    removeMember,
    deleteRecentActivity,
    blockUser,
    blockFutureProfiles
}