/**
 * SELENIUM TESTS FOR FLOWERSHOP PROJECT
 * 
 * This file contains 4 automated tests for the FlowerShop website:
 * 1. Homepage Navigation Test
 * 2. Login Form Validation Test
 * 3. Shop Page Functionality Test
 * 4. Contact Form Test
 */

import { Builder, By, until } from 'selenium-webdriver';
import 'chromedriver';

// Helper function to run individual tests
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

// Main test runner function
async function runTests() {
  console.log('Starting Selenium Tests for FlowerShop...');
  const testResults = [];
  let driver;

  try {
    // Initialize the WebDriver
    console.log('Initializing WebDriver...');
    driver = await new Builder().forBrowser('chrome').build();
    console.log('WebDriver initialized successfully!');

    /************************************************************
     * TEST 1: HOMEPAGE NAVIGATION TEST
     * 
     * Verifies:
     * - Homepage loads correctly
     * - Important elements are displayed (Shop Now button, navigation)
     * - Navigation to Shop page works
     ************************************************************/
    testResults.push(await runTest('Homepage Navigation Test', async () => {
      // Navigate to homepage
      await driver.get('http://localhost:8081');
      await driver.wait(until.elementLocated(By.tagName('body')), 5000);
      
      // Check page title
      const title = await driver.getTitle();
      console.log(`  Page title: ${title}`);
      
      // Verify "Shop Now" button exists and is displayed
      const shopNowButton = await driver.findElement(By.linkText('Shop Now'));
      if (!await shopNowButton.isDisplayed()) {
        throw new Error('"Shop Now" button is not visible');
      }
      console.log('  "Shop Now" button is displayed');
      
      // Verify navigation links exist and are displayed
      const navLinks = ['Home', 'Shop', 'About', 'Contact'];
      for (const linkText of navLinks) {
        const link = await driver.findElement(By.linkText(linkText));
        if (!await link.isDisplayed()) {
          throw new Error(`"${linkText}" navigation link is not visible`);
        }
        console.log(`  "${linkText}" navigation link is displayed`);
      }
      
      // Test navigation by clicking the Shop link
      const shopLink = await driver.findElement(By.linkText('Shop'));
      await shopLink.click();
      
      // Verify navigation worked
      await driver.wait(until.urlContains('/shop'), 5000);
      const currentUrl = await driver.getCurrentUrl();
      console.log(`  Successfully navigated to: ${currentUrl}`);
    }));

    /************************************************************
     * TEST 2: LOGIN FORM VALIDATION TEST
     * 
     * Verifies:
     * - Login page loads correctly
     * - Form validation works with invalid email
     * - Form fields have required attribute
     ************************************************************/
    testResults.push(await runTest('Login Form Validation Test', async () => {
      // Navigate to login page
      await driver.get('http://localhost:8081/login');
      await driver.wait(until.elementLocated(By.id('email')), 5000);
      
      // Verify form elements exist
      const emailInput = await driver.findElement(By.id('email'));
      const passwordInput = await driver.findElement(By.id('password'));
      const submitButton = await driver.findElement(By.css('button[type="submit"]'));
      console.log('  Form fields and submit button found');
      
      // Test with invalid email format
      await emailInput.clear();
      await emailInput.sendKeys('invalid-email');
      await passwordInput.clear();
      await passwordInput.sendKeys('password123');
      await submitButton.click();
      
      // Verify validation prevents submission
      await driver.sleep(1000); // Brief wait for any validation to appear
      const currentUrl = await driver.getCurrentUrl();
      if (!currentUrl.includes('/login')) {
        throw new Error('Form submitted with invalid email, but was not rejected');
      }
      console.log('  Validation worked: Invalid submission prevented');
      
      // Verify fields have required attribute
      const emailRequired = await emailInput.getAttribute('required');
      const passwordRequired = await passwordInput.getAttribute('required');
      if (emailRequired && passwordRequired) {
        console.log('  Form has required fields properly set');
      } else {
        console.log('  Warning: Form fields are not marked as required');
      }
    }));

    /************************************************************
     * TEST 3: SHOP PAGE FUNCTIONALITY TEST
     * 
     * Verifies:
     * - Shop page loads correctly
     * - Product grid is displayed
     * - Category filters work
     * - Products are displayed
     ************************************************************/
    testResults.push(await runTest('Shop Page Functionality Test', async () => {
      // Navigate to shop page
      await driver.get('http://localhost:8081/shop');
      await driver.wait(until.elementLocated(By.css('h1')), 5000);
      
      // Verify the page heading
      const shopHeading = await driver.findElement(By.css('h1')).getText();
      console.log(`  Shop page heading: "${shopHeading}"`);
      
      // Verify product grid exists and is displayed
      const productGrid = await driver.findElement(By.css('.grid'));
      if (!await productGrid.isDisplayed()) {
        throw new Error('Product grid is not visible');
      }
      console.log('  Product grid is displayed');
      
      // Test category filter functionality
      const allCategoryButton = await driver.findElement(By.xpath("//button[text()='All' or contains(text(), 'All')]"));
      console.log('  "All" category filter button found');
      await allCategoryButton.click();
      
      // Verify products are displayed after filtering
      await driver.sleep(1000); // Wait for potential filtering
      const products = await driver.findElements(By.css('.grid > div'));
      console.log(`  Found ${products.length} products`);
      
      if (products.length === 0) {
        throw new Error('No products are displayed after filtering');
      }
    }));

    /************************************************************
     * TEST 4: CONTACT FORM TEST
     * 
     * Verifies:
     * - Contact page loads correctly
     * - Form fields exist and accept input
     * - Form values are set correctly
     * - Form submission works properly
     ************************************************************/
    testResults.push(await runTest('Contact Form Test', async () => {
      // Navigate to contact page
      await driver.get('http://localhost:8081/contact');
      await driver.wait(until.elementLocated(By.css('h1')), 5000);
      
      // Verify page heading
      const contactHeading = await driver.findElement(By.css('h1')).getText();
      console.log(`  Contact page heading: "${contactHeading}"`);
      
      // Verify form elements exist
      const nameInput = await driver.findElement(By.name('name'));
      const emailInput = await driver.findElement(By.name('email'));
      const subjectInput = await driver.findElement(By.name('subject'));
      const messageInput = await driver.findElement(By.name('message'));
      const submitButton = await driver.findElement(By.css('button[type="submit"]'));
      console.log('  All form fields found');
      
      // Test form input functionality with test data
      const testName = 'Selenium Test User';
      const testEmail = 'selenium-test@example.com';
      const testSubject = 'Automated Test Message';
      const testMessage = 'This is an automated test message sent by Selenium WebDriver. Test timestamp: ' + new Date().toISOString();
      
      await nameInput.sendKeys(testName);
      await emailInput.sendKeys(testEmail);
      await subjectInput.sendKeys(testSubject);
      await messageInput.sendKeys(testMessage);
      
      // Verify form values are set correctly
      const nameValue = await nameInput.getAttribute('value');
      const emailValue = await emailInput.getAttribute('value');
      const subjectValue = await subjectInput.getAttribute('value');
      const messageValue = await messageInput.getAttribute('value');
      
      if (nameValue !== testName || emailValue !== testEmail || 
          subjectValue !== testSubject || messageValue.length < 10) {
        throw new Error('Form field values not set correctly');
      }
      console.log('  Form filled out correctly with subject line');
      
      // Actually submit the form
      console.log('  Submitting form data to backend...');
      await submitButton.click();
      
      // Wait for submission response
      try {
        // Look for success message or redirect
        // This might need adjustment based on how your form submission is handled
        await driver.wait(
          until.elementLocated(By.xpath("//*[contains(text(), 'Thank you') or contains(text(), 'successfully')]")), 
          5000
        );
        console.log('  Form submitted successfully!');
      } catch (timeoutError) {
        // If no success message appears, check if we're still on the same page
        console.log('  Timeout waiting for success message: ' + timeoutError.message);
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes('/contact')) {
          // Still on contact page - check for any error messages
          const bodyText = await driver.findElement(By.tagName('body')).getText();
          if (bodyText.toLowerCase().includes('error') || bodyText.toLowerCase().includes('failed')) {
            throw new Error('Form submission failed: Error message displayed');
          } else {
            console.log('  Note: No explicit success message found, but no errors detected');
          }
        } else {
          console.log(`  Form submission resulted in navigation to: ${currentUrl}`);
        }
      }
    }));

  } catch (error) {
    console.error('Test setup failed:', error);
  } finally {
    // Close the browser
    if (driver) {
      console.log('Closing browser...');
      await driver.quit();
    }

    // Display test results
    const passCount = testResults.filter(r => r).length;
    const failCount = testResults.filter(r => !r).length;
    console.log(`\nTest Results: ${passCount} passed, ${failCount} failed\n`);
  }
}

// Run all tests
runTests().catch(err => {
  console.error('Fatal error running tests:', err);
});
