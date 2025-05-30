import 'chromedriver';
import { Given, When, Then, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

setDefaultTimeout(30000); // Increase timeout for slower DB saves

Given('Jam i kyçur si administrator', async function () {
  this.driver = await new Builder().forBrowser('chrome').build();
  await this.driver.manage().window().maximize();
  await this.driver.get('http://localhost:8081/login');

  await this.driver.findElement(By.name('email')).sendKeys('tina@outlook.com');
  await this.driver.findElement(By.name('password')).sendKeys('tina1234');
  await this.driver.findElement(By.css('button[type="submit"]')).click();

  await this.driver.wait(until.urlContains('/admin'), 5000);
  console.log("✅ U kyçe si admin me sukses");
});

Given('Jam në faqen e menaxhimit të produkteve', async function () {
  await this.driver.get('http://localhost:8081/admin');

  await this.driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'Admin Panel')]")), 5000);
  const manageProductsLink = await this.driver.findElement(By.xpath("//*[contains(text(), 'Manage Products')]"));
  await this.driver.executeScript("arguments[0].scrollIntoView(true);", manageProductsLink);
  await this.driver.sleep(1000);
  await this.driver.executeScript("arguments[0].click();", manageProductsLink);
  console.log("✅ Klikoi në 'Manage Products'");

  await this.driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Product Management')]")), 5000);
});

When('Unë shtoj një kategori të re me emrin {string}', async function (categoryName) {
  const toggleBtnXpath = "//button[contains(text(), 'Manage Categories') or contains(text(), 'Hide Category Manager')]";
  const toggleBtn = await this.driver.findElement(By.xpath(toggleBtnXpath));
  const btnText = await toggleBtn.getText();

  if (btnText.includes("Manage Categories")) {
    await this.driver.executeScript("arguments[0].click();", toggleBtn);
    await this.driver.sleep(1000);
  }

  const input = await this.driver.findElement(By.css('input[placeholder="New category name"]'));
  await this.driver.wait(until.elementIsVisible(input), 3000);
  await input.clear();
  await input.sendKeys(categoryName);

  const addButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Add Category')]"));
  await this.driver.wait(until.elementIsEnabled(addButton), 3000);
  await this.driver.executeScript("arguments[0].click();", addButton);
  console.log("✅ Klikoi 'Add Category'");

  // Wait for it to show up
  await this.driver.wait(until.elementLocated(By.xpath(`//span[contains(text(), "${categoryName}")]`)), 7000);
  console.log(`✅ Kategoria "${categoryName}" u shfaq në listë`);
});

Then('Kategoria {string} duhet të shfaqet në listë', async function (categoryName) {
  // Optional: refresh and re-check to confirm it was saved
  await this.driver.navigate().refresh();
  await this.driver.sleep(1500);

  const manageProductsLink = await this.driver.findElement(By.xpath("//*[contains(text(), 'Manage Products')]"));
  await this.driver.executeScript("arguments[0].click();", manageProductsLink);
  await this.driver.sleep(1000);

  const toggleBtnXpath = "//button[contains(text(), 'Manage Categories') or contains(text(), 'Hide Category Manager')]";
  const toggleBtn = await this.driver.findElement(By.xpath(toggleBtnXpath));
  const btnText = await toggleBtn.getText();

  if (btnText.includes("Manage Categories")) {
    await this.driver.executeScript("arguments[0].click();", toggleBtn);
    await this.driver.sleep(1000);
  }

  const categorySpan = await this.driver.findElement(By.xpath(`//span[contains(text(), "${categoryName}")]`));
  const visible = await categorySpan.isDisplayed();
  assert.ok(visible, `❌ Kategoria "${categoryName}" nuk u shfaq pas rifreskimit`);
  console.log(`✅ Kategoria "${categoryName}" u ruajt dhe është ende në listë`);
});

AfterAll(async function () {
  if (this.driver) {
    try {
      await this.driver.quit();
      console.log("🧹 Browseri u mbyll");
    } catch (err) {
      console.error("❌ Gabim në mbylljen e browserit:", err);
    }
  }
});
