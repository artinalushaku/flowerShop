# Selenium Testing

This directory contains Selenium WebDriver tests for web applications.

## What is Selenium?

Selenium WebDriver is a tool for automating web browsers. It allows you to:
- Simulate user interactions with websites
- Automate testing of web applications
- Verify functionality across different browsers

## Setup

1. Make sure you have Node.js installed
2. Make sure Chrome browser is installed on your system
3. Install dependencies:
   ```
   npm install
   ```

## Running Tests

Run the Selenium tests:
```
npm run selenium
```

Run specific test files:
```
npm run test:selenium1  # Runs test1.js
```

## Current Tests

### test1.js - Core Functionality Tests
The `test1.js` file contains tests for core site functionality:
1. Homepage loading
2. Navigation menu functionality
3. Login form validation
4. Contact form submission

### Future Tests (test2.js and test3.js)
These files will contain tests for additional functionalities:
- Registration form validation
- Shop product filtering
- Product search
- Add to cart functionality
- User authentication flow
- Admin dashboard access
- Product management (admin)
- User profile updates

## Adapting for Your Application

To test your own application:

1. Update the test files to navigate to your application URL
2. Add tests specific to your application's features
3. Use appropriate CSS selectors to interact with your application's elements

Example (replace with your application's URL and selectors):

```javascript
testResults.push(await runTest('Homepage loads', async () => {
  await driver.get('http://localhost:5173'); // Your application URL
  await driver.wait(until.elementLocated(By.css('.your-element')), 5000);
  
  // Verify element exists
  const element = await driver.findElement(By.css('.your-element'));
  const text = await element.getText();
  console.log(`  Element text: ${text}`);
}));
```

## Common Selenium Commands

- Find element: `driver.findElement(By.css('.selector'))`
- Find multiple elements: `driver.findElements(By.css('.selector'))`
- Click: `element.click()`
- Type text: `element.sendKeys('text')`
- Get text: `await element.getText()`
- Wait for element: `await driver.wait(until.elementLocated(By.css('.selector')), timeout)`
- Navigate: `await driver.get('url')`
- Get current URL: `await driver.getCurrentUrl()`
- Take screenshot: `await driver.takeScreenshot()`

## Resources

- [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/webdriver/)
- [Selenium JavaScript API](https://www.selenium.dev/selenium/docs/api/javascript/index.html)
- [ChromeDriver](https://chromedriver.chromium.org/) 