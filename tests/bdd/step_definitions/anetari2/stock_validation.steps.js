import 'chromedriver';
import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import { setDefaultTimeout } from '@cucumber/cucumber';
import { Given, When, Then } from '@cucumber/cucumber';
setDefaultTimeout(20000);

Given('Jam i kyçur si administrator', async function () {
  this.driver = new Builder().forBrowser('chrome').build();
  await this.driver.get('http://localhost:8081/login');
  await this.driver.findElement(By.name('email')).sendKeys('admin@gmail.com');
  await this.driver.findElement(By.name('password')).sendKeys('admin123');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
  await this.driver.wait(until.urlContains('/admin'), 10000);
});

Given('Jam në faqen e menaxhimit të produkteve', async function () {
  await this.driver.get('http://localhost:8081/admin');
  await this.driver.wait(until.elementLocated(By.css('.bg-rose-700')), 5000);
  const manageProductsBtn = await this.driver.findElement(By.xpath("//*[text()='Manage Products']"));
  await manageProductsBtn.click();
  await this.driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Product Management')]")), 5000);
});

When('Unë fut një sasi prej 50 njesive', async function () {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test Product');
  await this.driver.findElement(By.name('description')).clear();
  await this.driver.findElement(By.name('description')).sendKeys('This is a valid product description with more than 20 characters.');
  await this.driver.findElement(By.name('price')).clear();
  await this.driver.findElement(By.name('price')).sendKeys('25.99');
  const categorySelect = await this.driver.findElement(By.name('category'));
  await categorySelect.click();
  await categorySelect.findElement(By.xpath(".//option[contains(text(), 'Wedding Flowers')]"))
    .click();
  await this.driver.findElement(By.name('stock')).clear();
  await this.driver.findElement(By.name('stock')).sendKeys('50');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Forma duhet të pranojë sasinë', async function () {
  const errors = await this.driver.findElements(By.css('.error-message'));
  assert.strictEqual(errors.length, 0);
});

Then('Nuk duhet të shoh gabime validimi', async function () {
  const errors = await this.driver.findElements(By.css('.error-message'));
  assert.strictEqual(errors.length, 0);
});

When('Unë fut një sasi prej -5 njesive', async function () {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test Product');
  await this.driver.findElement(By.name('description')).clear();
  await this.driver.findElement(By.name('description')).sendKeys('This is a valid product description with more than 20 characters.');
  await this.driver.findElement(By.name('price')).clear();
  await this.driver.findElement(By.name('price')).sendKeys('25.99');
  const categorySelect = await this.driver.findElement(By.name('category'));
  await categorySelect.click();
  await categorySelect.findElement(By.xpath(".//option[contains(text(), 'Wedding Flowers')]"))
    .click();
  await this.driver.findElement(By.name('stock')).clear();
  await this.driver.findElement(By.name('stock')).sendKeys('-5');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Forma duhet të tregojë një gabim validimi', async function () {
  await this.driver.wait(until.elementLocated(By.css('.error-message')), 5000);
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = await error.getText();
  assert.ok(text.length > 0);
});

Then('Duhet të shoh një mesazh që tregon që sasia duhet të jetë pozitive', async function () {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = await error.getText();
  assert.ok(text.includes('Sasia minimale është 0'));
});

When('Unë fut një sasi prej 10000 njesive', async function () {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test Product');
  await this.driver.findElement(By.name('description')).clear();
  await this.driver.findElement(By.name('description')).sendKeys('This is a valid product description with more than 20 characters.');
  await this.driver.findElement(By.name('price')).clear();
  await this.driver.findElement(By.name('price')).sendKeys('25.99');
  const categorySelect = await this.driver.findElement(By.name('category'));
  await categorySelect.click();
  await categorySelect.findElement(By.xpath(".//option[contains(text(), 'Wedding Flowers')]"))
    .click();
  await this.driver.findElement(By.name('stock')).clear();
  await this.driver.findElement(By.name('stock')).sendKeys('10000');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Duhet të shoh një mesazh që tregon maksimum 1000 njesive të lejuara', async function () {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = await error.getText();
  assert.ok(text.includes('Sasia maksimale është 100'));
}); 