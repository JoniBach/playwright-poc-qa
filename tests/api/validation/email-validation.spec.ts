import { test, expect } from '@playwright/test';
import { createFormData, getMinimalValidData } from '../../../helpers/api-helpers';

/**
 * API Email Validation Tests
 * Tests server-side email validation via direct API calls
 * 
 * NOTE: Server expects FormData (multipart/form-data), not JSON
 */

const BASE_URL = 'http://localhost:5173';
const JOURNEY_PATH = '/civil-aviation-authority/register-a-plane/apply';

test.describe('API Email Validation @api', () => {
  
  test('should reject invalid email format', async ({ request }) => {
    const data = getMinimalValidData({ 'email-address': 'not-an-email' });
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    
    expect(body.success).toBe(false);
    expect(body.errors).toBeDefined();
    expect(body.errors['email-address']).toBeDefined();
    expect(body.errors['email-address']).toContain('email address');
  });
  
  test('should accept valid email format', async ({ request }) => {
    const data = getMinimalValidData();
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    expect(body.success).toBe(true);
    expect(body.complete).toBe(true);
    expect(body.referenceNumber).toBeDefined();
    expect(body.referenceNumber).toMatch(/^APP-[A-Z0-9]+-[A-Z0-9]+$/);
  });
  
  test('should reject email without @ symbol', async ({ request }) => {
    const data = getMinimalValidData({ 'email-address': 'userexample.com' });
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors['email-address']).toBeDefined();
  });
  
  test('should reject email without domain', async ({ request }) => {
    const data = getMinimalValidData({ 'email-address': 'user@' });
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.errors['email-address']).toBeDefined();
  });
  
  test('should accept various valid email formats', async ({ request }) => {
    const validEmails = [
      'user@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
      'user_name@example.com',
      'user123@example.com'
    ];
    
    for (const email of validEmails) {
      const data = getMinimalValidData({ 'email-address': email });
      const formData = createFormData(data);
      
      const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
        multipart: formData
      });
      
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.success).toBe(true);
    }
  });
  
  test('should return GOV.UK-style error message', async ({ request }) => {
    const data = getMinimalValidData({ 'email-address': 'invalid' });
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    const body = await response.json();
    const errorMessage = body.errors['email-address'];
    
    // Should start with imperative verb
    expect(errorMessage).toMatch(/^(Enter|Provide|Give)/);
    
    // Should not contain technical jargon
    expect(errorMessage).not.toContain('validation');
    expect(errorMessage).not.toContain('regex');
    expect(errorMessage).not.toContain('pattern');
  });
});
