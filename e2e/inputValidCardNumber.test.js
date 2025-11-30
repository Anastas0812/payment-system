import puppetteer from 'puppeteer';

jest.setTimeout(60000);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('Credit Card Validator form', () => {
  let browser = null;
  let page = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    browser = await puppetteer.launch({
      headless: true,
      slowMo: 100,
    });
    page = await browser.newPage();
    
    await page.goto(baseUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('✅ Page loaded');
  }, 60000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  describe('Valid card number input', () => {
    test('should highlight Visa icon for valid Visa number', async () => {
      await page.type('input[type="text"]', '4111111111111111');
      await delay(1000);

      const visaIconActive = await page.$eval('[data-card-type="visa"]', icon => 
        icon.classList.contains('active')
      );
      expect(visaIconActive).toBe(true);

      const inputValue = await page.$eval('input[type="text"]', input => input.value);
      expect(inputValue).toBe('4111 1111 1111 1111');
    });

    test('should show success alert on button click with valid card', async () => {
      let alertMessage = '';
      
      page.once('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
      });

      await page.click('.button');
      await delay(500); 
      
      expect(alertMessage).toContain('валидна');
    });

    test('should highlight Mastercard for valid Mastercard number', async () => {
      await page.click('input[type="text"]', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      
      await page.type('input[type="text"]', '5555555555554444');
      await delay(1000);

      const mastercardActive = await page.$eval('[data-card-type="mastercard"]', icon => 
        icon.classList.contains('active')
      );
      expect(mastercardActive).toBe(true);
    });
  });

  describe('Invalid card number input', () => {
    test('should not highlight any icons for invalid card number', async () => {
      await page.click('input[type="text"]', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      
      await page.type('input[type="text"]', '4111111111111112');
      await delay(1000);
      
      const activeIconsCount = await page.$$eval('.card-icon.active', icons => icons.length);
      expect(activeIconsCount).toBe(0);
    });

    test('should show error alert on button click with invalid card', async () => {
      let alertMessage = '';
      
      page.once('dialog', async dialog => {
        alertMessage = dialog.message();
        await dialog.accept();
      });

      await page.click('.button');
      await delay(500);
      
      expect(alertMessage).toContain('Неверный номер карты');
    });

    test('should not highlight icons for unknown card system', async () => {
      await page.click('input[type="text"]', { clickCount: 3 });
      await page.keyboard.press('Backspace');
      
      await page.type('input[type="text"]', '1234567812345678');
      await delay(1000);
      
      const activeIconsCount = await page.$$eval('.card-icon.active', icons => icons.length);
      expect(activeIconsCount).toBe(0);
    });
  });
});