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

When('Unë shoh listën e kategorive', async function () {
  const manageCategoriesBtn = await this.driver.findElement(By.xpath("//*[text()='Manage Categories']"));
  await manageCategoriesBtn.click();
  await this.driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Category Management')]")), 5000);
});

Then('Duhet të shoh të gjitha kategoritë', async function () {
  const categoryElements = await this.driver.findElements(By.xpath("//div[contains(@class, 'flex items-center justify-between') and contains(., '/50') ]"));
  assert.ok(categoryElements.length > 0);
});

Then('Duhet të shoh numrin e produkteve për kategori', async function () {
  const categoryElements = await this.driver.findElements(By.xpath("//div[contains(@class, 'flex items-center justify-between') and contains(., '/50') ]"));
  for (const el of categoryElements) {
    const text = await el.getText();
    assert.ok(/\(\d+\/50\)/.test(text));
  }
});

When('Unë shtoj një kategori të re {string}', async function (category) {
  const manageCategoriesBtn = await this.driver.findElement(By.xpath("//*[text()='Manage Categories']"));
  await manageCategoriesBtn.click();
  await this.driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Category Management')]")), 5000);
  const input = await this.driver.findElement(By.css('input[placeholder="New category name"]'));
  await input.clear();
  await input.sendKeys(category);
  const addBtn = await this.driver.findElement(By.xpath("//button[contains(text(),'Add Category')]"));
  await addBtn.click();
  await this.driver.sleep(500); // Wait for UI update
});

Then('Kategoria duhet të shtohet në listë', async function () {
  const categoryElements = await this.driver.findElements(By.xpath("//div[contains(@class, 'flex items-center justify-between') and contains(., '/50') ]"));
  let found = false;
  for (const el of categoryElements) {
    const text = await el.getText();
    if (text.includes('Orkide')) found = true;
  }
  assert.ok(found);
});

Given('Kategoria {string} nuk ka produkte', async function (category) {
  // Assumes the category exists and has 0 products. If not, create it and ensure no products are assigned.
  // For test purposes, just ensure the category is present and not used.
  // (No-op for now)
});

When('Unë fshij kategorinë {string}', async function (category) {
  // Directly find and delete the category inside the category management section
  const categoryElements = await this.driver.findElements(By.xpath(`//div[contains(@class, 'flex items-center justify-between') and contains(., '${category}')]`));
  assert.ok(categoryElements.length > 0);
  const deleteBtn = await categoryElements[0].findElement(By.xpath(".//button[contains(text(),'Delete')]"));
  await deleteBtn.click();
  // Accept confirm dialog
  await this.driver.sleep(500); // Wait for confirm dialog
  await this.driver.switchTo().alert().accept();
  await this.driver.sleep(500); // Wait for UI update
});

Then('Kategoria {string} duhet të largohet nga sistemi', async function (category) {
  // Directly check for the category inside the category management section
  const categoryElements = await this.driver.findElements(By.xpath(`//div[contains(@class, 'flex items-center justify-between') and contains(., '${category}')]`));
  assert.strictEqual(categoryElements.length, 0);
}); 