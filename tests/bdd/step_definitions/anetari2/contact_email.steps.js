import 'chromedriver';
import { Given, When, Then } from '@cucumber/cucumber';
import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

Given('Jam në faqen e kontaktit', async function () {
  this.driver = new Builder().forBrowser('chrome').build();
  await this.driver.get('http://localhost:8081/contact');
  await this.driver.wait(until.elementLocated(By.css('form')), 5000);
});

When('Unë plotësoj formularin me të dhënat e mia', async function () {
  await this.driver.findElement(By.name('name')).sendKeys('Test User');
  await this.driver.findElement(By.name('email')).sendKeys('test@example.com');
  await this.driver.findElement(By.name('subject')).sendKeys('Test Subject');
  await this.driver.findElement(By.name('message')).sendKeys('This is a test message');
});

When('Unë dërgoj mesazhin', async function () {
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Duhet të shfaqet mesazhi i suksesit', async function () {
  const successMessage = await this.driver.findElement(By.css('.success-message'));
  assert.ok(successMessage);
  const text = await successMessage.getText();
  assert.ok(text.includes('Thank you for your message'));
});

When('Unë fut një email të vlefshëm {string}', async function (email) {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test User');
  await this.driver.findElement(By.name('email')).clear();
  await this.driver.findElement(By.name('email')).sendKeys(email);
  await this.driver.findElement(By.name('subject')).clear();
  await this.driver.findElement(By.name('subject')).sendKeys('Test Subject');
  await this.driver.findElement(By.name('message')).clear();
  await this.driver.findElement(By.name('message')).sendKeys('Ky është një mesazh testues me më shumë se 50 karaktere për të kaluar validimin e mesazhit.');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Forma duhet të pranojë email-in', async function () {
  const errors = await this.driver.findElements(By.css('.error-message'));
  let visibleErrors = 0;
  for (let err of errors) {
    if (await err.isDisplayed() && (await err.getText()).trim().length > 0) visibleErrors++;
  }
  assert.strictEqual(visibleErrors, 0);
});

Then('Nuk duhet të shoh gabime validimi', async function () {
  const errors = await this.driver.findElements(By.css('.error-message'));
  assert.strictEqual(errors.length, 0);
});

When('Unë fut një email të pavlefshëm {string}', async function (email) {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test User');
  await this.driver.findElement(By.name('email')).clear();
  await this.driver.findElement(By.name('email')).sendKeys(email);
  await this.driver.findElement(By.name('subject')).clear();
  await this.driver.findElement(By.name('subject')).sendKeys('Test Subject');
  await this.driver.findElement(By.name('message')).clear();
  await this.driver.findElement(By.name('message')).sendKeys('Ky është një mesazh testues me më shumë se 50 karaktere për të kaluar validimin e mesazhit.');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Forma duhet të tregojë një gabim validimi', async function () {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = await error.getText();
  assert.ok(text.length > 0);
});

Then('Duhet të shoh një mesazh që tregon formatin e duhur të email-it', async function () {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = (await error.getText()).toLowerCase();
  assert.ok(
    text.includes('valid email') ||
    text.includes('valid email address') ||
    text.includes('please enter a valid email'),
    `Mesazhi i errorit: ${text}`
  );
});

When('Unë lë email-in bosh', async function () {
  await this.driver.findElement(By.name('name')).clear();
  await this.driver.findElement(By.name('name')).sendKeys('Test User');
  await this.driver.findElement(By.name('email')).clear();
  await this.driver.findElement(By.name('subject')).clear();
  await this.driver.findElement(By.name('subject')).sendKeys('Test Subject');
  await this.driver.findElement(By.name('message')).clear();
  await this.driver.findElement(By.name('message')).sendKeys('Ky është një mesazh testues me më shumë se 50 karaktere për të kaluar validimin e mesazhit.');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
});

Then('Duhet të shoh një mesazh që tregon që email-i është i detyrueshëm', async function () {
  const error = await this.driver.findElement(By.css('.error-message'));
  const text = (await error.getText()).toLowerCase();
  assert.ok(
    text.includes('email is required') ||
    text.includes('required'),
    `Mesazhi i errorit: ${text}`
  );
});  