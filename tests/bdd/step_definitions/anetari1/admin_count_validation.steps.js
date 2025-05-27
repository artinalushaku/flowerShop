import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Builder, By, until } from 'selenium-webdriver';

let driver;

// Common steps
Given('Jam i kyçur si administrator', async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://localhost:8081/login');
    await driver.findElement(By.id('email')).sendKeys('admin@example.com');
    await driver.findElement(By.id('password')).sendKeys('admin123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/admin'), 5000);
});

Given('Jam në faqen e menaxhimit të përdoruesve', async function() {
    await driver.get('http://localhost:8081/admin/users');
    await driver.wait(until.elementLocated(By.css('.user-management')), 5000);
});

// Admin Count Validation Steps
When('Unë shoh listën e administratorëve', async function() {
    await driver.wait(until.elementLocated(By.css('.admin-list')), 5000);
});

Then('Duhet të shoh numrin aktual të administratorëve', async function() {
    const adminCount = await driver.findElement(By.css('.admin-count'));
    expect(await adminCount.isDisplayed()).to.be.true;
});

Then('Duhet të shoh numrin maksimal të lejuar të administratorëve {int}', async function(maxAdmins) {
    const maxAdminCount = await driver.findElement(By.css('.max-admin-count'));
    const text = await maxAdminCount.getText();
    expect(text).to.include(maxAdmins.toString());
});

Given('Aktualisht janë {int} administratorë në sistem', async function(currentAdmins) {
    const adminCount = await driver.findElement(By.css('.admin-count'));
    const count = await adminCount.getText();
    expect(parseInt(count)).to.equal(currentAdmins);
});

When('Unë promovoj një përdorues të rregullt në rolin e administratorit', async function() {
    const promoteButton = await driver.findElement(By.css('.promote-to-admin'));
    await promoteButton.click();
    await driver.wait(until.elementLocated(By.css('.success-message')), 5000);
});

Then('Roli i përdoruesit duhet të ndryshojë në administrator', async function() {
    const userRole = await driver.findElement(By.css('.user-role'));
    const roleText = await userRole.getText();
    expect(roleText).to.equal('Administrator');
});

Then('Sistemi duhet të tregojë {int} administratorë', async function(expectedCount) {
    const adminCount = await driver.findElement(By.css('.admin-count'));
    const count = await adminCount.getText();
    expect(parseInt(count)).to.equal(expectedCount);
}); 