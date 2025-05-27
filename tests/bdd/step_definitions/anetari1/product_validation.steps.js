import { Given, When, Then, After, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// Shorter timeout
setDefaultTimeout(30000);

let driver;

// Common steps
Given('Jam i kyçur si administrator', async function() {
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    
    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    await driver.get('http://localhost:8081/login');
    await driver.findElement(By.id('email')).sendKeys('admin@example.com');
    await driver.findElement(By.id('password')).sendKeys('admin123');
    await driver.findElement(By.css('button[type="submit"]')).click();
});

Given('Jam në faqen e menaxhimit të produkteve', async function() {
    await driver.get('http://localhost:8081/admin/products');
});

// Product Validation Steps
When('Unë fut një përshkrim produkti me {int} karaktere', async function(length) {
    const description = 'a'.repeat(length);
    await driver.findElement(By.id('product-description')).sendKeys(description);
});

Then('Forma duhet të pranojë përshkrimin', async function() {
    const errorMessages = await driver.findElements(By.css('.error-message'));
    expect(errorMessages.length).to.equal(0);
});

Then('Nuk duhet të shoh gabime validimi', async function() {
    const errorMessages = await driver.findElements(By.css('.error-message'));
    expect(errorMessages.length).to.equal(0);
});

Then('Forma duhet të tregojë një gabim validimi', async function() {
    const errorMessage = await driver.findElement(By.css('.error-message'));
    expect(await errorMessage.isDisplayed()).to.be.true;
});

Then('Duhet të shoh një mesazh që tregon minimum {int} karaktere të kërkuara', async function(minLength) {
    const errorMessage = await driver.findElement(By.css('.error-message'));
    const messageText = await errorMessage.getText();
    expect(messageText).to.include(`Minimum ${minLength} karaktere`);
});

// Cleanup after each scenario
After(async function() {
    if (driver) {
        await driver.quit();
    }
}); 