import 'chromedriver';
import { Given, When, Then } from '@cucumber/cucumber';
import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import { setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(20000);


Given('Jam në faqen e kontaktit', async function () {
  this.driver = new Builder().forBrowser('chrome').build();
  await this.driver.get('http://localhost:8081/contact');
  await this.driver.wait(until.elementLocated(By.css('form')), 10000);
});

When('Unë fut një mesazh me {int} karaktere', async function (count) {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test User');
  await this.driver.findElement(By.name('email')).clear();
  await this.driver.findElement(By.name('email')).sendKeys('test@example.com');
  await this.driver.findElement(By.name('subject')).clear();
  await this.driver.findElement(By.name('subject')).sendKeys('Test Subject');
  const text = 'A'.repeat(count);
  await this.driver.findElement(By.name('message')).clear();
  await this.driver.findElement(By.name('message')).sendKeys(text);
  await this.driver.findElement(By.css('button[type="submit"]')).click();
  if (count > 500) {
    await this.driver.wait(until.elementLocated(By.css('.error-message')), 5000);
  }
});

Then('Forma duhet të pranojë mesazhin', async function () {
  const errors = await this.driver.findElements(By.css('.error-message'));
  assert.strictEqual(errors.length, 0);
});

Then('Nuk duhet të shoh gabime validimi', async function () {
  const errors = await this.driver.findElements(By.css('.error-message'));
  assert.strictEqual(errors.length, 0);
});

Then('Forma duhet të tregojë një gabim validimi', async function () {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = await error.getText();
  assert.ok(text.length > 0);
});

Then('Duhet të shoh një mesazh që tregon minimum {int} karaktere të kërkuara', async function (min) {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = await error.getText();
  assert.ok(text.toLowerCase().includes('at least') || text.toLowerCase().includes('minimum'));
  assert.ok(text.includes(min.toString()));
});

Then('Duhet të shoh një mesazh që tregon maksimum {int} karaktere të lejuara', async function (max) {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = await error.getText();
  assert.ok(text.toLowerCase().includes('cannot exceed') || text.toLowerCase().includes('maximum'));
  assert.ok(text.includes(max.toString()));
}); 