import 'chromedriver';
import { Given, When, Then } from '@cucumber/cucumber';
import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import { setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(20000);

Given('Jam i kyçur si administrator', async function () {
  this.driver = new Builder().forBrowser('chrome').build();
  await this.driver.get('http://localhost:8081/login');

  console.log("Typing email...");
  await this.driver.findElement(By.name('email')).sendKeys('tina@outlook.com');

  console.log("Typing password...");
  await this.driver.findElement(By.name('password')).sendKeys('tina1234');

  console.log("Clicking login...");
  await this.driver.findElement(By.css('button[type="submit"]')).click();

  console.log("Waiting for admin page to load...");
  await this.driver.wait(until.urlContains('/admin'), 5000);
});

Given('Jam në faqen e menaxhimit të produkteve', async function () {
  console.log("Waiting for sidebar to load...");
  await this.driver.wait(until.elementLocated(By.linkText('Manage Products')), 5000);

  console.log("Clicking 'Manage Products'...");
  const manageProductsLink = await this.driver.findElement(By.linkText('Manage Products'));
  await manageProductsLink.click();

  console.log("Waiting for Product Management header...");
  await this.driver.wait(until.elementLocated(By.xpath("//h1[contains(text(),'Product Management')]")), 5000);
});

Given('Kategoria {string} ka {int} produkte', async function (category, count) {
  const xpath = `//*[contains(text(), '${category} (${count}/50)')]`;
  console.log(`Checking if category ${category} has ${count}/50 products...`);
  await this.driver.wait(until.elementLocated(By.xpath(xpath)), 20000);
  const element = await this.driver.findElement(By.xpath(xpath));
  assert.ok(await element.isDisplayed(), `Kategoria ${category} nuk ka (${count}/50) produkte`);
});

When('Unë shtoj një produkt të ri në kategorinë {string}', async function (category) {
  console.log("Typing product name...");
  await this.driver.findElement(By.name('name')).sendKeys('Test Product');

  console.log("Typing description...");
  await this.driver.findElement(By.name('description')).sendKeys('Ky është një përshkrim testues me më shumë se 20 karaktere.');

  console.log("Typing price...");
  await this.driver.findElement(By.name('price')).sendKeys('10');

  console.log("Typing stock...");
  await this.driver.findElement(By.name('stock')).sendKeys('5');

  console.log("Typing image URL...");
  await this.driver.findElement(By.name('imageUrl')).sendKeys('https://example.com/image.jpg');

  console.log("Selecting category...");
  const categorySelect = await this.driver.findElement(By.name('category'));
  await categorySelect.click();
  const categoryOption = await this.driver.findElement(By.xpath(`//option[contains(text(), '${category}')]`));
  await categoryOption.click();

  console.log("Submitting product...");
  await this.driver.findElement(By.css('button[type="submit"]')).click();

  await this.driver.sleep(1000); // Wait for form to submit and refresh
});

Then('Produkti duhet të shtohet me sukses', async function () {
  console.log("Checking if new product is in the list...");
  const product = await this.driver.findElements(By.xpath("//td[contains(text(),'Test Product')]"));
  assert.ok(product.length > 0, "Produkti i ri nuk u shtua me sukses");
});

Then('Kategoria duhet të tregojë {int} nga {int} produkte', async function (current, max) {
  await this.driver.sleep(1000);
  const xpath = `//*[contains(text(), '(${current}/${max})')]`;
  console.log("Verifying category badge...");
  const badge = await this.driver.findElement(By.xpath(xpath));
  assert.ok(await badge.isDisplayed(), `Kategoria nuk tregon (${current}/${max}) produkte`);
});
