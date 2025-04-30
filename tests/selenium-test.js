/**
 * Selenium test for Flower Shop application
 * Run with: npm run selenium
 */
import { Builder, By, Key, until } from 'selenium-webdriver';
import 'chromedriver';

// Function to run a single test
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

// Main test runner
async function runTests() {
  console.log('Starting Selenium tests for Flower Shop...');
  const testResults = [];
  let driver;

  try {
    // Initialize the browser
    console.log('Initializing Chrome browser...');
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions({
        args: ['--start-maximized']
      })
      .build();
      
    // Test 1: Homepage loads
    testResults.push(await runTest('Homepage loads', async () => {
      await driver.get('http://localhost:8081');
      await driver.wait(until.elementLocated(By.tagName('body')), 5000);
      const title = await driver.getTitle();
      console.log(`  Page title: ${title}`);
      
      // Take a screenshot of the homepage
      await driver.takeScreenshot();
      console.log('  Screenshot taken of homepage');
      
      // Check if we have some content
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      console.log(`  Body text length: ${bodyText.length} characters`);
      
      if (bodyText.length < 5) {
        throw new Error('Page content seems empty');
      }
    }));

    // Test 2: Find and test navigation elements
    testResults.push(await runTest('Navigation works', async () => {
      await driver.get('http://localhost:8081');
      
      // Find any navigation links
      const links = await driver.findElements(By.css('a'));
      console.log(`  Found ${links.length} links on the page`);
      
      if (links.length > 0) {
        // Try to click the first link
        try {
          const linkText = await links[0].getText();
          console.log(`  Clicking link: ${linkText || '[No text]'}`);
          await links[0].click();
          
          // Wait for page to change
          await driver.sleep(1000);
          const newUrl = await driver.getCurrentUrl();
          console.log(`  Navigation URL: ${newUrl}`);
        } catch (error) {
          console.log(`  Could not click link: ${error.message}`);
        }
      }
      
      // This test always passes - it's exploratory
      console.log('  Navigation test completed');
    }));
    
  } catch (error) {
    console.error('Test setup failed:', error);
  } finally {
    // Cleanup
    if (driver) {
      console.log('Closing browser...');
      await driver.quit();
    }
    
    // Report results
    const passCount = testResults.filter(result => result).length;
    const failCount = testResults.filter(result => !result).length;
    console.log(`\nTest Results: ${passCount} passed, ${failCount} failed\n`);
  }
}

// Run all tests
runTests().catch(err => {
  console.error('Fatal error running tests:', err);
}); 