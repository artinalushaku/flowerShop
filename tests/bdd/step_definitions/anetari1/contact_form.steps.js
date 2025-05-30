import 'chromedriver';
import { Given, When, Then } from '@cucumber/cucumber';
import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

Given('Jam në faqen e kontaktit', async function () {
  this.driver = new Builder().forBrowser('chrome').build();
  await this.driver.get('http://localhost:8081/contact');
  await this.driver.wait(until.elementLocated(By.name('subject')), 5000);
});

When('Unë fut një subjekt me {int} karaktere', async function (count) {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test User');
  await this.driver.findElement(By.name('email')).clear();
  await this.driver.findElement(By.name('email')).sendKeys('test@example.com');
  await this.driver.findElement(By.name('message')).clear();
  await this.driver.findElement(By.name('message')).sendKeys('Ky është një mesazh testues me më shumë se 10 karaktere.');
  const text = 'A'.repeat(count);
  await this.driver.findElement(By.name('subject')).clear();
  await this.driver.findElement(By.name('subject')).sendKeys(text);
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Forma duhet të pranojë subjektin', async function () {
  const error = await this.driver.findElements(By.css('.error-subject'));
  assert.strictEqual(error.length, 0);
});

Then('Nuk duhet të shoh gabime validimi', async function () {
  const errors = await this.driver.findElements(By.css('.error-message'));
  assert.strictEqual(errors.length, 0);
});

Then('Forma duhet të tregojë një gabim validimi', async function () {
  const error = await this.driver.findElement(By.css('p.text-red-700')).getText();
  assert.ok(error.length > 0);
});

Then('Duhet të shoh një mesazh që tregon minimum {int} karaktere të kërkuara', async function (min) {
  const error = await this.driver.findElement(By.css('p.text-red-700')).getText();
  assert.ok(error.includes(`Subject must be at least ${min} characters long.`));
});
