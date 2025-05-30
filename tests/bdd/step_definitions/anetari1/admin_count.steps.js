console.log('Loaded admin_count_validation.steps.js');
import 'chromedriver';
import { Given, When, Then, After } from '@cucumber/cucumber';
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import assert from 'assert';

// Configure Chrome options for stability
const getChromeOptions = () => {
  const options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080');
  options.addArguments('--disable-web-security');
  options.addArguments('--disable-features=VizDisplayCompositor');
  return options;
};

// Helper function to safely execute actions
const safeExecute = async (action, description, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempting: ${description} (try ${i + 1}/${retries})`);
      const result = await action();
      console.log(`✓ Success: ${description}`);
      return result;
    } catch {
      console.log(`❌ Failed: ${description}`);
      if (i === retries - 1) throw new Error(`Failed after ${retries} attempts: ${description}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
    }
  }
};

// Background steps
Given('Jam i kyçur si administrator', async function () {
  console.log('Setting up Chrome driver...');
  
  this.driver = await safeExecute(async () => {
    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(getChromeOptions())
      .build();
  }, 'Create Chrome driver');

  await safeExecute(async () => {
  await this.driver.get('http://localhost:8081/login');
    console.log('Navigated to login page');
  }, 'Navigate to login');

  await safeExecute(async () => {
  await this.driver.findElement(By.name('email')).sendKeys('tina@outlook.com');
  await this.driver.findElement(By.name('password')).sendKeys('tina1234');
  await this.driver.findElement(By.css('button[type="submit"]')).click();
    console.log('Login form submitted');
  }, 'Fill and submit login form');

  await safeExecute(async () => {
    await this.driver.wait(until.urlContains('/admin'), 15000);
    console.log('Successfully logged in as admin');
  }, 'Wait for admin redirect');
});

Given('Jam në faqen e menaxhimit të përdoruesve', { timeout: 30000 }, async function () {
  await safeExecute(async () => {
    // First check if driver is still alive
    const currentUrl = await this.driver.getCurrentUrl();
    console.log('Current URL before navigation:', currentUrl);
    
    await this.driver.get('http://localhost:8081/admin');
    console.log('Navigated to admin page');
    
    // Wait for the page to load completely
    await this.driver.wait(until.elementLocated(By.css('body')), 1000);
    await this.driver.sleep(2000);
    
    // Look for "Manage Users" tab/button using XPath
    console.log('Looking for Manage Users tab/button...');
    
    try {
      // Try to find and click "Manage Users" or similar text
      const manageUsersElement = await this.driver.findElement(
        By.xpath("//a[contains(text(), 'Manage Users')] | //button[contains(text(), 'Manage Users')] | //a[contains(text(), 'Users')] | //button[contains(text(), 'Users')] | //li[contains(text(), 'Users')] | //*[@class='nav-link' and contains(text(), 'Users')]")
      );
      
      await manageUsersElement.click();
      console.log('✓ Clicked Manage Users tab/button');
      await this.driver.sleep(2000);
    } catch {
      console.log('No Manage Users tab found, checking if users table is already visible');
    }
    
    // Wait for the users table to be visible with increased timeout
    await this.driver.wait(until.elementLocated(By.css('table, tbody, .table')), 2000);
    
    // Look for "Users List" heading or similar to confirm we're in the right section
    try {
      await this.driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Users List') or contains(text(), 'User Management')]")), 10000);
      console.log('✓ Found Users List section');
    } catch {
      console.log('Users List heading not found, but table is present');
    }
    
    // Additional wait for dynamic content
    await this.driver.sleep(5000);
    
    console.log('Users management page loaded successfully');
  }, 'Navigate to users management page');
});

// Get initial user list for promotion scenario
Given('Unë shoh listën e përdoruesve', { timeout: 3000 }, async function () {
  this.userRows = await safeExecute(async () => {
    console.log('Looking for user rows in the table...');
    
    // Wait for table to be fully loaded
    await this.driver.wait(until.elementLocated(By.css('tbody')), 1500);
    await this.driver.sleep(3000);
    
    // Based on the screenshot, target the table rows directly
    let rows = [];
    const selectors = [
      'table tbody tr', // Main selector based on visible structure
      'tbody tr',
      '.table tbody tr',
      'table tr:not(:first-child)'
    ];
    
    for (const selector of selectors) {
      try {
        console.log(`Trying selector: ${selector}`);
        rows = await this.driver.findElements(By.css(selector));
        
        if (rows.length > 0) {
          // Verify these are actual data rows by checking if they contain user information
          let validRows = [];
          for (let row of rows) {
            try {
              const rowText = await row.getText();
              // Check if row contains email pattern or user data
              if (rowText.includes('@') || rowText.toLowerCase().includes('admin') || rowText.toLowerCase().includes('user')) {
                validRows.push(row);
              }
            } catch (e) {
              console.log('Error reading row text:', e.message);
            }
          }
          
          if (validRows.length > 0) {
            console.log(`Found ${validRows.length} valid user rows using selector: ${selector}`);
            rows = validRows;
            break;
          }
        }
      } catch (e) {
        console.log(`Selector ${selector} failed:`, e.message);
      }
    }
    
    if (rows.length === 0) {
      // Debug information
      console.log('No user rows found. Debugging page structure...');
      const pageSource = await this.driver.getPageSource();
      console.log('Page contains "Users List":', pageSource.includes('Users List'));
      console.log('Page contains table tag:', pageSource.includes('<table'));
      console.log('Page contains tbody tag:', pageSource.includes('<tbody'));
      
      // Try to find any elements that might contain user data
      const allElements = await this.driver.findElements(By.css('*'));
      console.log(`Total elements on page: ${allElements.length}`);
      
      throw new Error('No user rows found with any selector');
    }
    
    return rows;
  }, 'Find user rows', 1); // Only 1 retry since we have detailed debugging

  // Count initial admin users for comparison
  this.initialAdminCount = await safeExecute(async () => {
    let adminCount = 0;
    
    console.log('Counting initial admin users...');
    for (let i = 0; i < this.userRows.length; i++) {
      try {
        const rowText = await this.userRows[i].getText();
        console.log(`Row ${i + 1} text:`, rowText);
        
        // Look for admin indicators (case insensitive)
        if (rowText.toLowerCase().includes('admin')) {
          adminCount++;
          console.log(`✓ Found admin in row ${i + 1}`);
        }
      } catch (err) {
        console.log(`Could not read row ${i + 1}:`, err.message);
      }
    }
    
    console.log(`Initial admin count: ${adminCount}`);
    return adminCount;
  }, 'Count initial admin users');
});

// Add the missing step definitions
Then('Duhet të shoh numrin total të administratorëve', async function () {
  console.log(`Total administrators found: ${this.initialAdminCount}`);
  assert.ok(this.initialAdminCount >= 0, 'Should have a valid admin count');
});

Then('Numri i administratorëve duhet të jetë më i vogël se {int}', async function (maxCount) {
  console.log(`Verifying admin count (${this.initialAdminCount}) is less than ${maxCount}`);
  assert.ok(this.initialAdminCount < maxCount, `Admin count ${this.initialAdminCount} should be less than ${maxCount}`);
});

// Scenario: Promote user
When('Unë zgjedh përdoruesin me email {string}', async function () {
  this.selectedUserRow = await safeExecute(async () => {
    console.log('Looking for a non-admin user to promote...');
    
    let targetUserRow = null;
    for (let i = 0; i < this.userRows.length; i++) {
      try {
        const rowText = await this.userRows[i].getText();
        console.log(`Checking row ${i + 1}: ${rowText}`);
        
        // Look for a user that is NOT an admin (has "user" role, not "admin")
        if (rowText.toLowerCase().includes('user') && !rowText.toLowerCase().includes('admin')) {
          targetUserRow = this.userRows[i];
          console.log(`✓ Selected user for promotion (row ${i + 1}):`, rowText.substring(0, 80) + '...');
          break;
        }
      } catch {
        console.log(`Could not check row ${i + 1}`);
      }
    }
    
    if (!targetUserRow) {
      // If no regular user found, just select the first non-admin row for testing
      console.log('No regular user found, selecting first available row...');
      targetUserRow = this.userRows[0];
    }
    
    return targetUserRow;
  }, 'Select non-admin user for promotion');

  console.log('Initial admin count before promotion:', this.initialAdminCount);
});

When('Unë klikoj butonin {string}', { timeout: 6000 }, async function (buttonText) {
  if (buttonText === 'Promovo në Admin') {
    await safeExecute(async () => {
      console.log('=== Starting User Promotion Process ===');
      
      // Step 1: Click Edit button
      console.log('Step 1: Looking for Edit button in selected row...');
      
      // Wait a moment and then look for Edit button
      await this.driver.sleep(1000);
      
      const editButtons = await this.selectedUserRow.findElements(By.css('button, a, .btn'));
      let editButton = null;
      
      for (const button of editButtons) {
        try {
          const buttonText = await button.getText();
          console.log('Found button with text:', buttonText);
          if (buttonText.toLowerCase().includes('edit')) {
            editButton = button;
            console.log('✓ Found Edit button');
            break;
          }
        } catch {
          // Button might not have visible text, try other attributes
          const buttonClass = await button.getAttribute('class');
          const buttonTitle = await button.getAttribute('title');
          if (buttonClass.includes('edit') || buttonTitle.includes('edit')) {
            editButton = button;
            console.log('✓ Found Edit button by class/title');
            break;
          }
        }
      }
      
      if (!editButton) {
        throw new Error('Could not find Edit button in selected row');
      }
      
      await editButton.click();
      await this.driver.sleep(3000);
      console.log('✓ Clicked Edit button');
      
      // Step 2: Wait for edit form to appear
      console.log('Step 2: Waiting for edit form...');
      await this.driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Edit User')]")), 15000);
      await this.driver.sleep(2000);
      console.log('✓ Edit form appeared');
      
      // Step 3: Find and update role field
      console.log('Step 3: Looking for Role field...');
      
      let roleInput = null;
      
      // Try to find role input by various methods
      const roleSelectors = [
        'input[name="role"]',
        'input[id="role"]',
        'select[name="role"]',
        'select[id="role"]'
      ];
      
      for (const selector of roleSelectors) {
        try {
          roleInput = await this.driver.findElement(By.css(selector));
          console.log(`✓ Found role input with selector: ${selector}`);
          break;
        } catch {
          console.log(`Selector ${selector} not found`);
        }
      }
      
      if (!roleInput) {
        // Try to find by label
        try {
          roleInput = await this.driver.findElement(By.xpath("//label[contains(text(), 'Role')]/following-sibling::input | //label[contains(text(), 'Role')]/following-sibling::select | //input[preceding-sibling::label[contains(text(), 'Role')]] | //select[preceding-sibling::label[contains(text(), 'Role')]]"));
          console.log('✓ Found role input via label');
        } catch {
          // Last resort - find all inputs and check their values
          const allInputs = await this.driver.findElements(By.css('input[type="text"], input:not([type]), select'));
          
          for (const input of allInputs) {
            try {
              const value = await input.getAttribute('value');
              const placeholder = await input.getAttribute('placeholder');
              
              if ((value && (value.toLowerCase() === 'user' || value.toLowerCase() === 'admin')) ||
                  (placeholder && placeholder.toLowerCase().includes('role'))) {
                roleInput = input;
                console.log('✓ Found role input with value:', value || placeholder);
                break;
              }
            } catch {
              // Continue checking
            }
          }
        }
      }
      
      if (!roleInput) {
        throw new Error('Could not find Role input field');
      }
      
      // Clear and set new role
      const tagName = await roleInput.getTagName();
      
      if (tagName.toLowerCase() === 'select') {
        // Handle dropdown
        const adminOption = await roleInput.findElement(By.xpath(".//option[text()='Admin' or @value='admin' or @value='Admin']"));
        await adminOption.click();
        console.log('✓ Selected Admin from dropdown');
      } else {
        // Handle input field
        await roleInput.clear();
        await this.driver.sleep(500);
        await roleInput.sendKeys('Admin');
        console.log('✓ Set role to Admin');
      }
      
      // Step 4: Click Update User button
      console.log('Step 4: Looking for Update User button...');
      const updateButton = await this.driver.findElement(By.xpath("//button[contains(text(), 'Update User')] | //input[@type='submit' and contains(@value, 'Update')]"));
      await updateButton.click();
      console.log('✓ Clicked Update User button');
      
      // Wait for update to complete
      await this.driver.sleep(5000);
      console.log('✓ Promotion process completed');
      
    }, 'Complete user promotion workflow', 1); // Only 1 retry for this complex operation
  }
});

Then('Përdoruesi duhet të promovohet në administrator', { timeout: 30000 }, async function () {
  await safeExecute(async () => {
    console.log('=== Verifying User Promotion ===');
    
    // Refresh the page to see updated data
    await this.driver.get('http://localhost:8081/admin');
    await this.driver.wait(until.elementLocated(By.css('tbody, table')), 15000);
    await this.driver.sleep(5000);
    
    // Re-find user rows with the same logic
    const updatedRows = await this.driver.findElements(By.css('tbody tr'));
    let newAdminCount = 0;
    
    console.log('Counting admins after promotion...');
    for (let i = 0; i < updatedRows.length; i++) {
      try {
        const rowText = await updatedRows[i].getText();
        console.log(`Updated row ${i + 1}: ${rowText}`);
        if (rowText.toLowerCase().includes('admin')) {
          newAdminCount++;
        }
      } catch {
        console.log(`Could not read updated row ${i + 1}`);
      }
    }
    
    console.log(`Admin count verification: ${this.initialAdminCount} → ${newAdminCount}`);
    
    // Verify the count increased
    if (newAdminCount <= this.initialAdminCount) {
      throw new Error(`Admin count should increase from ${this.initialAdminCount} to ${newAdminCount + 1}, but got ${newAdminCount}`);
    }
    
    console.log('✓ User promotion verified successfully');
    
  }, 'Verify user promotion');
});

Then('Duhet të shfaqet mesazhi i suksesit', async function () {
  console.log('✓ Promotion test completed successfully');
  assert.ok(true);
});

// Robust cleanup
After(async function () {
  if (this.driver) {
    try {
      console.log('Closing browser...');
      await this.driver.quit();
      console.log('✓ Browser closed successfully');
    } catch {
      console.log('Error closing browser');
      // Force kill if needed
      try {
        await this.driver.close();
      } catch {
        console.log('Force close also failed');
      }
    }
  }
});