const { Builder, By, until } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const config = require('../config.js');
const selectors = require('../selectors');
const { navigateToSunscreenShop } = require('../navigation.js');

// Chrome options setup
let chromeOptions = new chrome.Options();
if (config.seleniumConfig.headless) {
    chromeOptions = chromeOptions.headless();
}

// Driver setup
let driver = new Builder()
    .forBrowser(config.seleniumConfig.browser)
    .setChromeOptions(chromeOptions)
    .build();

// Navigate to the website
driver.get(config.seleniumConfig.url);

// Function to find and add product
async function findProduct(containing) {
    let products = await driver.findElements(By.xpath(selectors.productCard.allProducts));

    for(let product of products) {
        let productName = await product.findElement(By.xpath(selectors.productCard.name)).getText();

        // If the product contains the given string, click add and return
        if (productName.toLowerCase().includes(containing)) {
            await product.findElement(By.xpath(selectors.productCard.addButton)).click();
            return;
        }
    }
}

// Function to send keys individually with delay
async function sendKeys(element, keys) {
    for (let key of keys) {
        await element.sendKeys(key);
        await driver.sleep(100); // Add a short delay between each key
    }
}

// Main Test
async function cartPageTest() {
    // Navigate to sunscreen shop
    await navigateToSunscreenShop(driver);

    try {
        // Add spf-30 and spf-50 sunscreens to the cart
        await findProduct('spf-30');
        await findProduct('spf-50');

        // Navigate to the cart
        let cartButton = await driver.findElement(By.xpath(selectors.productCard.cartButton));
        await cartButton.click();

        // Verify the cart items
        let cartItems = await driver.findElements(By.xpath(selectors.cart.base));
        for(let item of cartItems) {
            let itemName = await item.getText();
            console.log(`Cart contains: ${itemName}`);
            if (!itemName.toLowerCase().includes('spf-30') && !itemName.toLowerCase().includes('spf-50')) {
                console.log('Cart does not contain the right items!');
                break;
            }
        }

        // Click the pay button
        let payButton = await driver.findElement(By.className(selectors.cart.payButton));
        await payButton.click();

        // Wait for the Stripe iframe to load and switch to it
        await driver.wait(until.elementLocated(By.xpath(selectors.cart.stripeIframe)), 10000);
        let stripeFrame = await driver.findElement(By.xpath(selectors.cart.stripeIframe));
        await driver.switchTo().frame(stripeFrame);

        // Fill out email and card details
        let emailAddress = await driver.findElement(By.xpath(selectors.payment.email));
        await emailAddress.sendKeys('example@gmail.com');
        let cardNumber = await driver.findElement(By.xpath(selectors.payment.cardNumber));
        await sendKeys(cardNumber, '4242424242424242');
        let expiryDate = await driver.findElement(By.xpath(selectors.payment.expiryDate));
        await sendKeys(expiryDate, '0124');
        let cvcCode = await driver.findElement(By.xpath(selectors.payment.cvcCode));
        await cvcCode.sendKeys('123');
        let zipCode = await driver.findElement(By.xpath(selectors.payment.zipCode));
        await zipCode.sendKeys('12345');

        // Submit the form 
        let submitButton = await driver.findElement(By.id(selectors.payment.submitButton));
        await submitButton.click();

        // Switch back to the main content
        await driver.switchTo().defaultContent();

        // Verify if the payment was successful
        await driver.wait(until.urlContains('confirmation'), 10000);
        let header = await driver.findElement(By.tagName(selectors.confirmation.header));
        let headerText = await header.getText();
        headerText === "PAYMENT SUCCESS" ? console.log("Payment was successful.") : console.log("Payment was not successful.");

    } catch (error) {
        console.error(error);
    } finally {
        // Quit the driver
        await driver.quit();
    }
}

// Run the test
cartPageTest();
