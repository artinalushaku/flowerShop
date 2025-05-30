import { Before, After } from '@cucumber/cucumber';
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import 'chromedriver';

Before(async function () {
  try {
    console.log('Starting to create Chrome driver...');
    const options = new chrome.Options();
    
    // Add these options to help with stability
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--remote-debugging-port=9222');
    
    // Set Chrome binary path explicitly
    options.setChromeBinaryPath('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
    
    console.log('Chrome options set, creating driver...');
    
    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
      
    console.log('Chrome driver created successfully');
    
    // Set implicit wait time
    await this.driver.manage().setTimeouts({ implicit: 10000 });
    
  } catch (error) {
    console.error('Error creating Chrome driver:', error);
    throw error;
  }
});

After(async function () {
  try {
    if (this.driver) {
      console.log('Closing Chrome driver...');
      await this.driver.quit();
      console.log('Chrome driver closed successfully');
    }
  } catch (error) {
    console.error('Error closing Chrome driver:', error);
  }
});
