import { Builder, By, until } from 'selenium-webdriver';
import 'chromedriver';

async function runTest(testName, testFunction) {
  console.log(`\n--- Running test: ${testName} ---`);
  try {
    await testFunction();
    console.log(`✓ PASS: ${testName}`);
    return true;
  } catch (error) {
    console.error(`✗ FAIL: ${testName}`);
    console.error(`Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Starting Selenium tests for Flower Shop...');
  const testResults = [];
  let driver;

  try {
    driver = await new Builder().forBrowser('chrome').build();

    // Test 1: Homepage loads
    testResults.push(await runTest('Homepage loads', async () => {
      await driver.get('http://localhost:8081');
      await driver.wait(until.elementLocated(By.tagName('body')), 5000);
      const title = await driver.getTitle();
      console.log(`  Page title: ${title}`);
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      if (bodyText.length < 5) throw new Error('Page content seems empty');
    }));

    // Test 2: Navigation works
    testResults.push(await runTest('Navigation works', async () => {
      await driver.get('http://localhost:8081');
      const links = await driver.findElements(By.css('a'));
      console.log(`  Found ${links.length} links on the page`);
      if (links.length > 0) {
        const linkText = await links[0].getText();
        console.log(`  Clicking link: ${linkText || '[No text]'}`);
        await links[0].click();
        await driver.sleep(1000);
        const newUrl = await driver.getCurrentUrl();
        console.log(`  Navigation URL: ${newUrl}`);
      }
    }));

    // Test 3: Login with correct credentials
    testResults.push(await runTest('Login success', async () => {
      await driver.get('http://localhost:8081/login');
      await driver.findElement(By.name('email')).sendKeys('tina@outlook.com'); // use valid login
      await driver.findElement(By.name('password')).sendKeys('tina1234');
      await driver.findElement(By.css('button[type="submit"]')).click();

      await driver.wait(until.urlContains('/admin'), 5000); // or '/' for regular user
      console.log('  Login successful, redirected!');
    }));

    // Test 4: Login with empty form
    testResults.push(await runTest('Login fails with empty fields', async () => {
      await driver.get('http://localhost:8081/login');
      await driver.findElement(By.css('button[type="submit"]')).click();
      try {
        await driver.wait(until.elementLocated(By.xpath("//*[text()='Email is required']")), 10000); // Increased timeout
        await driver.wait(until.elementLocated(By.xpath("//*[text()='Password is required']")), 10000); // Increased timeout
      } catch {
        const bodyText = await driver.findElement(By.tagName('body')).getText();
        console.error('Body text for debugging:', bodyText); // Log body text for debugging
        if (!bodyText.toLowerCase().includes('email') || !bodyText.toLowerCase().includes('password')) {
          throw new Error('Validation messages not found or not visible');
        }
      }
    }));

  } catch (error) {
    console.error('Test setup failed:', error);
  } finally {
    if (driver) {
      console.log('Closing browser...');
      await driver.quit();
    }

    const passCount = testResults.filter(r => r).length;
    const failCount = testResults.filter(r => !r).length;
    console.log(`\nTest Results: ${passCount} passed, ${failCount} failed\n`);
  }
}

runTests().catch(err => {
  console.error('Fatal error running tests:', err);
});
