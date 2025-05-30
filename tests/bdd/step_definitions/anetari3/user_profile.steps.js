import 'chromedriver';
import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import { setDefaultTimeout } from '@cucumber/cucumber';
import { Given, When, Then } from '@cucumber/cucumber';
setDefaultTimeout(20000);

Given('Jam i kyçur si përdorues', async function () {
  this.driver = new Builder().forBrowser('chrome').build();
  await this.driver.get('http://localhost:8081/login');
  await this.driver.findElement(By.name('email')).sendKeys('user@gmail.com');
  await this.driver.findElement(By.name('password')).sendKeys('user123');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
  await this.driver.wait(until.urlContains('/'), 10000);
});

Given('Jam në faqen e profilit tim', async function () {
  // Prit që linku të jetë i dukshëm
  await this.driver.wait(
    until.elementLocated(By.xpath("//a[contains(text(),'My Profile')]")),
    5000
  );
  const profileBtns = await this.driver.findElements(By.xpath("//a[contains(text(),'My Profile')]"));
  let clicked = false;
  for (let btn of profileBtns) {
    if (await btn.isDisplayed()) {
      await btn.click();
      clicked = true;
      break;
    }
  }
  if (!clicked) throw new Error('No visible My Profile link found');
  await this.driver.wait(until.urlContains('/profile'), 5000);
  await this.driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'My Profile')]")), 5000);
});

When('Unë shoh profilin tim', async function () {
  await this.driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'My Profile')]")), 5000);
});

Then('Duhet të shoh emrin tim', async function () {
  const name = await this.driver.findElement(By.xpath("//h2[contains(@class, 'text-xl') and contains(@class, 'font-semibold')]"));
  const text = await name.getText();
  assert.ok(text.length > 0);
});

Then('Duhet të shoh email-in tim', async function () {
  const email = await this.driver.findElement(By.xpath("//h3[contains(text(),'Email')]/following-sibling::p"));
  const text = await email.getText();
  assert.ok(text.includes('@'));
});

Then('Duhet të shoh datën e regjistrimit', async function () {
  const date = await this.driver.findElement(By.xpath("//h3[contains(text(),'Member Since')]/following-sibling::p"));
  const text = await date.getText();
  assert.ok(text.length > 0 && text !== 'Not available');
});

When('Unë ndryshoj numrin e telefonit', async function () {
  const editBtn = await this.driver.findElement(By.xpath("//button[contains(.,'Edit Profile')]"));
  await editBtn.click();
  await this.driver.wait(until.elementLocated(By.name('phone')), 2000);
  const phoneInput = await this.driver.findElement(By.name('phone'));
  await phoneInput.clear();
  await phoneInput.sendKeys('1234567890');
});

When('Unë ruaj ndryshimet', async function () {
  const saveBtn = await this.driver.findElement(By.xpath("//button[contains(.,'Save Changes')]"));
  await saveBtn.click();
  await this.driver.sleep(1000);
});

Then('Duhet të shoh një mesazh konfirmimi', async function () {
  const alert = await this.driver.findElement(By.xpath("//div[contains(@class, 'bg-green-100')]"));
  const text = await alert.getText();
  assert.ok(text.toLowerCase().includes('profile updated'));
});

When('Unë ndryshoj emrin tim të plotë', async function () {
  // Prit që butoni të jetë i dukshëm para se ta klikosh
  await this.driver.wait(until.elementLocated(By.xpath("//button[contains(.,'Edit Profile')]")), 5000);
  const editBtn = await this.driver.findElement(By.xpath("//button[contains(.,'Edit Profile')]"));
  await this.driver.wait(until.elementIsVisible(editBtn), 2000);
  await editBtn.click();
  await this.driver.wait(until.elementLocated(By.name('name')), 2000);
  const nameInput = await this.driver.findElement(By.name('name'));
  await nameInput.clear();
  await nameInput.sendKeys('Emri Test');
});

When('Unë ndryshoj adresën time', async function () {
  // Nëse je ende në edit mode, vazhdo
  const addressInput = await this.driver.findElement(By.name('address'));
  await addressInput.clear();
  await addressInput.sendKeys('Test Address 123');
});

Then('Informacioni duhet të përditësohet', async function () {
  const name = await this.driver.findElement(By.xpath("//h2[contains(@class, 'text-xl') and contains(@class, 'font-semibold')]"));
  const text = await name.getText();
  assert.ok(text.includes('Emri Test'));
});

Then('Adresa duhet të përditësohet', async function () {
  const address = await this.driver.findElement(By.xpath("//h3[contains(text(),'Address')]/following-sibling::p"));
  const text = await address.getText();
  assert.ok(text.includes('Test Address 123'));
}); 