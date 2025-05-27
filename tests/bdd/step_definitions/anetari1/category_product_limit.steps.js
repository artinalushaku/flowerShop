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

Given('Jam në faqen e menaxhimit të produkteve', async function() {
    await driver.get('http://localhost:8081/admin/products');
    await driver.wait(until.elementLocated(By.css('.product-management')), 5000);
});

// Category Product Limit Steps
When('Unë shoh listën e kategorive', async function() {
    await driver.wait(until.elementLocated(By.css('.category-list')), 5000);
});

Then('Duhet të shoh një tregues kapaciteti për secilën kategori', async function() {
    const capacityIndicators = await driver.findElements(By.css('.category-capacity'));
    expect(capacityIndicators.length).to.be.greaterThan(0);
});

Then('Treguesi duhet të tregojë numrin aktual të produkteve dhe limitin maksimal', async function() {
    const capacityIndicator = await driver.findElement(By.css('.category-capacity'));
    const text = await capacityIndicator.getText();
    expect(text).to.match(/\d+\/\d+/); // Format: "current/max"
});

Given('Kategoria {string} ka {int} produkte', async function(categoryName, productCount) {
    const category = await driver.findElement(By.xpath(`//div[contains(@class, 'category') and contains(., '${categoryName}')]`));
    const count = await category.findElement(By.css('.product-count')).getText();
    expect(parseInt(count)).to.equal(productCount);
});

When('Unë shtoj një produkt të ri në kategorinë {string}', async function(categoryName) {
    const addButton = await driver.findElement(By.xpath(`//div[contains(@class, 'category') and contains(., '${categoryName}')]//button[contains(@class, 'add-product')]`));
    await addButton.click();
    await driver.wait(until.elementLocated(By.css('.product-form')), 5000);
    
    // Fill in product details
    await driver.findElement(By.id('product-name')).sendKeys('Test Product');
    await driver.findElement(By.id('product-description')).sendKeys('Test Description');
    await driver.findElement(By.id('product-price')).sendKeys('19.99');
    
    // Submit the form
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.elementLocated(By.css('.success-message')), 5000);
});

Then('Produkti duhet të shtohet me sukses', async function() {
    const successMessage = await driver.findElement(By.css('.success-message'));
    expect(await successMessage.isDisplayed()).to.be.true;
});

Then('Kategoria duhet të tregojë {int} \\/ {int} produkte', async function(current, max) {
    const capacityIndicator = await driver.findElement(By.css('.category-capacity'));
    const text = await capacityIndicator.getText();
    expect(text).to.equal(`${current}/${max}`);
}); 