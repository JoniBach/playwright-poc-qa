import { test, expect } from '@playwright/test';
import { createFormData, getMinimalValidData } from '../../../helpers/api-helpers';

/**
 * API Required Fields Validation Tests
 * Tests server-side required field validation via direct API calls
 * 
 * NOTE: Server expects FormData (multipart/form-data), not JSON
 */

const BASE_URL = 'http://localhost:5173';
const JOURNEY_PATH = '/civil-aviation-authority/register-a-plane/apply';

test.describe('API Required Fields Validation @api', () => {
  
  test('should reject submission with missing required fields', async ({ request }) => {
    const formData = createFormData({
      'applicant-type': 'individual'
      // Missing: aircraft-manufacturer, aircraft-model, aircraft-serial-number, 
      // full-name, email-address, telephone-number
    });
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    
    expect(body.success).toBe(false);
    expect(body.errors).toBeDefined();
    
    // Should have errors for all missing required fields
    expect(body.errors['aircraft-manufacturer']).toBeDefined();
    expect(body.errors['aircraft-model']).toBeDefined();
    expect(body.errors['aircraft-serial-number']).toBeDefined();
    expect(body.errors['full-name']).toBeDefined();
    expect(body.errors['email-address']).toBeDefined();
    expect(body.errors['telephone-number']).toBeDefined();
  });
  
  test('should return all validation errors at once', async ({ request }) => {
    const formData = createFormData({
      'applicant-type': 'individual',
      'email-address': 'invalid-email',
      'telephone-number': 'abc'
      // Missing other required fields
    });
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    const body = await response.json();
    
    // Should return multiple errors (not just the first one)
    expect(Object.keys(body.errors).length).toBeGreaterThan(1);
    
    // Should include both validation errors and missing field errors
    expect(body.errors['email-address']).toBeDefined();
    expect(body.errors['aircraft-manufacturer']).toBeDefined();
  });
  
  test('should accept submission with all required fields', async ({ request }) => {
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
  });
  
  test('should treat empty string as missing field', async ({ request }) => {
    const data = getMinimalValidData({
      'aircraft-manufacturer': '',  // Empty string
      'aircraft-model': '   '       // Whitespace only
    });
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    
    // Both empty string and whitespace should trigger required field errors
    expect(body.errors['aircraft-manufacturer']).toBeDefined();
    expect(body.errors['aircraft-model']).toBeDefined();
  });


  // BROKEN
  
  // test('should return helpful error messages for missing fields', async ({ request }) => {
  //   const formData = createFormData({
  //     'applicant-type': 'individual'
  //   });
    
  //   const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
  //     multipart: formData
  //   });
    
  //   const body = await response.json();
    
  //   // Error messages should start with imperative verbs
  //   Object.values(body.errors).forEach((message: any) => {
  //     expect(message).toMatch(/^(Enter|Select|Choose|Provide)/);
  //   });
    
  //   // Error messages should be specific
  //   expect(body.errors['aircraft-manufacturer']).toContain('manufacturer');
  //   expect(body.errors['email-address']).toContain('email');
  // });
  
  test('should validate each field independently', async ({ request }) => {
    // Test with only one missing field
    const data = getMinimalValidData();
    delete data['email-address'];  // Remove email
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    
    // Should only have error for the missing field
    expect(body.errors['email-address']).toBeDefined();
    expect(body.errors['aircraft-manufacturer']).toBeUndefined();
    expect(body.errors['full-name']).toBeUndefined();
  });
});
