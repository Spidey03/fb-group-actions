const rekognition = require("./rekognition");
const scrollOnElement = require("./scrollOnElement");
const maleFilteingXPATHs = require("./maleFilteingXPATHs");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

async function getGenderOfUser(profilePage, userProfileURL) {
    await sleep(2000);
    await profilePage.goto(userProfileURL, { waitUntil: 'networkidle' });
    await profilePage.waitForResponse(response => {
        return response.request().resourceType() === "xhr"
    })
    await sleep(4000);
    let gender = undefined;
    try {
        gender = await profilePage.textContent(maleFilteingXPATHs.genderEl);
    } catch (error) {
        //pass
    }
    if (gender != "Male" && gender != "Female") {
        imageXPATH = '(//*[name()="image"])[15]';
        profilePicURL = await profilePage.getAttribute(imageXPATH, 'xlink:href');
        gender = await rekognition.getGenderUsingProfilePic(profilePicURL);
    }
    if (gender == "Male") {
        return true;
    }
    return false;
}

async function removeMemberFromGroup(memberPage, userProfileImageURL) {
    memberURL = 'https://www.facebook.com' + userProfileImageURL;
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
}

async function main(groupPage, memberPage, profilePage) {
    let pos = 1;
    while (pos) {
        try {
            await sleep(2000);
            let userProfileImage = maleFilteingXPATHs.getUserProfile(pos);
            scrollOnElement.scrollOnElement(groupPage, userProfileImage);
            let userProfileImageURL = await groupPage.getAttribute(userProfileImage, 'href');
            console.log(userProfileImage);
            console.log(userProfileImageURL);
            await sleep(2000);
            userID = await getUserIdFromURL(userProfileImageURL);
            let userProfileURL = await getUserProfileURL(userID);
            console.log(userProfileURL);
            let isMale = undefined;
            isMale = await getGenderOfUser(profilePage, userProfileURL)
                // await profilePage.close();
            if (isMale == true) {
                await removeMemberFromGroup(memberPage, userProfileImageURL)
            }
            await sleep(4000);

        } catch (error) {
            console.log(error);
            break;
        }
        pos++;
    }
}

module.exports = {
    main
}