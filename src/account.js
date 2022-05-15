const yargs = require('yargs')

async function loginToAccount(loginPage) {
    let username = yargs.argv._[0];
    let password = yargs.argv._[1];
    await loginPage.goto('https://www.facebook.com/groups/discover/');
    await loginPage.fill('input[name=email]', username);
    await loginPage.fill('input[name=pass]', password);
    await loginPage.press('input[name=pass]', 'Enter')
    await loginPage.waitForNavigation();
    await loginPage.waitForResponse(response => {
        return response.request().resourceType() === "xhr"
    })
}

module.exports = {
    loginToAccount
}