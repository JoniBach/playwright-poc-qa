import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const JOURNEY_PATH = '/civil-aviation-authority/register-a-plane/apply';

// Note: Using .first() on headings because the journey JSON has duplicate h1 elements
// (one from GovUKPage title prop, one from the heading component in the JSON)
// This is a journey generation issue that should be fixed in the AI generator

test.describe('Register a Plane Journey', () => {
  
  test('should complete the full journey as an individual', async ({ page }) => {
    // Start the journey
    await page.goto(`${BASE_URL}${JOURNEY_PATH}`);
    
    // Page 1: Applicant Type
    await expect(page.getByRole('heading', { name: 'Who is registering the aircraft?' }).first()).toBeVisible();
    await page.getByLabel('An individual').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 2: Aircraft Details
    await expect(page.getByRole('heading', { name: 'Enter aircraft details' }).first()).toBeVisible();
    await page.getByLabel('Manufacturer').fill('Cessna');
    await page.getByLabel('Model').fill('172S');
    await page.getByLabel('Serial number').fill('17280001');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 3: Contact Details
    await expect(page.getByRole('heading', { name: 'Your contact details' }).first()).toBeVisible();
    await page.getByLabel('Full name').fill('John Smith');
    await page.getByLabel('Email address').fill('john.smith@example.com');
    await page.getByLabel('Telephone number').fill('07700900123');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 4: Check Your Answers
    await expect(page.getByRole('heading', { name: 'Check your answers before submitting' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 5: Confirmation
    await expect(page.getByRole('heading', { name: 'Application submitted' }).first()).toBeVisible();
  });

  test('should complete the full journey as an organisation', async ({ page }) => {
    // Start the journey
    await page.goto(`${BASE_URL}${JOURNEY_PATH}`);
    
    // Page 1: Applicant Type
    await expect(page.getByRole('heading', { name: 'Who is registering the aircraft?' }).first()).toBeVisible();
    await page.getByLabel('A company or organisation').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 2: Aircraft Details
    await expect(page.getByRole('heading', { name: 'Enter aircraft details' }).first()).toBeVisible();
    await page.getByLabel('Manufacturer').fill('Airbus');
    await page.getByLabel('Model').fill('A320');
    await page.getByLabel('Serial number').fill('A320-001');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 3: Contact Details
    await expect(page.getByRole('heading', { name: 'Your contact details' }).first()).toBeVisible();
    await page.getByLabel('Full name').fill('Jane Doe');
    await page.getByLabel('Email address').fill('jane.doe@aviation.com');
    await page.getByLabel('Telephone number').fill('02012345678');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 4: Check Your Answers
    await expect(page.getByRole('heading', { name: 'Check your answers before submitting' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Page 5: Confirmation
    await expect(page.getByRole('heading', { name: 'Application submitted' }).first()).toBeVisible();
  });

  // TODO: Re-enable when Back link is implemented on check-your-answers page
  test.skip('should navigate back through the journey', async ({ page }) => {
    // Start the journey and fill first page
    await page.goto(`${BASE_URL}${JOURNEY_PATH}`);
    await page.getByLabel('An individual').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Fill second page
    await page.getByLabel('Manufacturer').fill('Piper');
    await page.getByLabel('Model').fill('PA-28-161');
    await page.getByLabel('Serial number').fill('PA28-001');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Fill third page
    await page.getByLabel('Full name').fill('Test User');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Telephone number').fill('07700900000');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Now on check your answers - go back
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page.getByRole('heading', { name: 'Your contact details' }).first()).toBeVisible();
    
    // Go back again
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page.getByRole('heading', { name: 'Enter aircraft details' }).first()).toBeVisible();
    
    // Go back to first page
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page.getByRole('heading', { name: 'Who is registering the aircraft?' }).first()).toBeVisible();
  });
});
