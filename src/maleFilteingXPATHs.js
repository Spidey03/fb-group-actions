function getUserProfile(pos) {
    let userProfileXPATH = "xpath=//body/div/div/div/div[@class='rq0escxv l9j0dhe7 du4w35lb']/div[@class='rq0escxv l9j0dhe7 du4w35lb']/div[@class='du4w35lb l9j0dhe7 cbu4d94t j83agx80']/div[@class='j83agx80 cbu4d94t l9j0dhe7 jgljxmt5 be9z9djy']/div[@class='j83agx80 cbu4d94t d6urw2fd dp1hu0rb l9j0dhe7 du4w35lb']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw jifvfom9 gs1a9yip owycx6da btwxx1t3 buofh1pr dp1hu0rb ka73uehy']/div[contains(@aria-label,'Group admin information for selected tool')]/div[@class='j83agx80 cbu4d94t buofh1pr dp1hu0rb hpfvmrgz l9j0dhe7 du4w35lb']/div[@role='main']/div[@class='j83agx80 cbu4d94t buofh1pr']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aodizinl ofv0k9yr']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aodizinl ofv0k9yr']/div[@class='rq0escxv d2edcug0 k4urcfbm']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t gs1a9yip lhclo0ds btwxx1t3 sv5sfqaa o22cckgh obtkqiv7 fop5sh7t']/div[@class='rq0escxv l9j0dhe7 du4w35lb qmfd67dx hpfvmrgz gile2uim buofh1pr g5gj957u aov4n071 oi9244e8 bi6gxh9e h676nmdw aghb5jc5']/div[@class='j83agx80 l9j0dhe7 k4urcfbm']/div[@class='rq0escxv l9j0dhe7 du4w35lb hybvsw6c io0zqebd m5lcvass fbipl8qg nwvqtn77 k4urcfbm ni8dbmo4 stjgntxs sbcfpzgs']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 discj3wi ihqw7lf3']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo sv5sfqaa obtkqiv7']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0 aov4n071 bi6gxh9e hv4rvrfc dati1w0a']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t pfnyh3mw d2edcug0']/div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 cbu4d94t buofh1pr tgvbjcpo sv5sfqaa obtkqiv7']/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/a[1]"
    return userProfileXPATH;
}
let genderEl = "xpath=//span[normalize-space()='Male']";
let moreOptions = "xpath=//div[@class='rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 kt9q3ron ak7q8e6j isp2s0ed ri5dt5u2 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 hv4rvrfc dati1w0a tdjehn4e tv7at329']//div[@class='bp9cbjyn j83agx80 taijpn5t c4xchbtz by2jbhx6 a0jftqn4']"
let removeMember = "xpath=//body//div//div[@class='rq0escxv l9j0dhe7 du4w35lb']//div[@class='rq0escxv l9j0dhe7 du4w35lb']//div[@class='__fb-dark-mode']//div[7]"
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