import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Builder, By, until } from 'selenium-webdriver';

let driver;

// Common steps
Given('Jam në faqen e kontaktit', async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:8081/contact');
    await driver.wait(until.elementLocated(By.css('.contact-form')), 5000);
});

// Contact Form Validation Steps
When('Unë fut një subjekt me {int} karaktere', async function(length) {
    const subject = 'a'.repeat(length);
    await driver.findElement(By.id('contact-subject')).sendKeys(subject);
});

Then('Forma duhet të pranojë subjektin', async function() {
    const errorMessage = await driver.findElements(By.css('.error-message'));
    expect(errorMessage.length).to.equal(0);
});

Then('Nuk duhet të shoh gabime validimi', async function() {
    const errorMessage = await driver.findElements(By.css('.error-message'));
    expect(errorMessage.length).to.equal(0);
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