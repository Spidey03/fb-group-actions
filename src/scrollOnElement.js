async function scrollOnElement(page, selector) {
    try {
        await page.$eval(selector, (element) => {
            element.scrollIntoView();
        });
    } catch (error) {
        //pass
    }
}

module.exports = {
    scrollOnElement
}