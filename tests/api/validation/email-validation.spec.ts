import { test, expect } from '@playwright/test';
import { createFormData, getMinimalValidData } from '../../../helpers/api-helpers';
// ✅ Use shared validation modules
import { 
  assertValidationError, 
  assertSuccessResponse,
  assertGovUKErrorMessages 
} from '../../shared/validation/assertions';
import { invalidEmails, validEmails } from '../../shared/validation/fixtures';

/**
 * API Email Validation Tests
 * Tests server-side email validation via direct API calls
 * 
 * NOTE: Server expects FormData (multipart/form-data), not JSON
 * NOW USING: Shared validation modules for cleaner, reusable assertions
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
    
    // ✅ Use shared assertion - cleaner and reusable!
    assertValidationError(body, ['email-address']);
  });
  
  test('should accept valid email format', async ({ request }) => {
    const data = getMinimalValidData();
    const formData = createFormData(data);
    
    const response = await request.post(`${BASE_URL}${JOURNEY_PATH}?page=check-your-answers`, {
      multipart: formData
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // ✅ Use shared assertion - validates structure and reference number format!
    assertSuccessResponse(body, { expectReferenceNumber: true, expectComplete: true });
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
    // ✅ Use shared fixtures instead of hardcoded values!
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
