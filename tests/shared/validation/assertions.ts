/**
 * Reusable assertion functions for validation testing
 * Can be used in API, UI, and E2E tests
 */

import { expect } from '@playwright/test';
import { 
  emailSchema, 
  phoneSchema, 
  referenceNumberSchema,
  validationErrorResponseSchema,
  successResponseSchema 
} from './schemas';

/**
 * Assert that response is a validation error with specific fields
 */
export function assertValidationError(
  response: any,
  expectedFields: string[]
) {
  expect(response.success).toBe(false);
  expect(response.errors).toBeDefined();
  
  // Validate response structure
  const validation = validationErrorResponseSchema.safeParse(response);
  expect(validation.success).toBe(true);
  
  // Check that all expected fields have errors
  for (const field of expectedFields) {
    expect(response.errors[field]).toBeDefined();
    expect(typeof response.errors[field]).toBe('string');
  }
}

/**
 * Assert that response is a success with optional reference number
 */
export function assertSuccessResponse(
  response: any,
  options?: {
    expectReferenceNumber?: boolean;
    expectComplete?: boolean;
  }
) {
  expect(response.success).toBe(true);
  
  // Validate response structure
  const validation = successResponseSchema.safeParse(response);
  expect(validation.success).toBe(true);
  
  if (options?.expectReferenceNumber) {
    expect(response.referenceNumber).toBeDefined();
    const refValidation = referenceNumberSchema.safeParse(response.referenceNumber);
    expect(refValidation.success).toBe(true);
  }
  
  if (options?.expectComplete !== undefined) {
    expect(response.complete).toBe(options.expectComplete);
  }
}

/**
 * Assert that error messages follow GOV.UK style guide
 * - Start with imperative verb (Enter, Select, Choose, Provide)
 * - Are specific and actionable
 */
export function assertGovUKErrorMessages(errors: Record<string, string>) {
  const imperativeVerbs = /^(Enter|Select|Choose|Provide|Give|Confirm|Check)/;
  
  Object.entries(errors).forEach(([field, message]) => {
    expect(message).toMatch(imperativeVerbs);
    expect(message.length).toBeGreaterThan(10); // Not too short
    expect(message.length).toBeLessThan(200); // Not too long
  });
}

/**
 * Assert that email is valid
 */
export function assertValidEmail(email: string) {
  const validation = emailSchema.safeParse(email);
  expect(validation.success).toBe(true);
}

/**
 * Assert that phone number is valid
 */
export function assertValidPhone(phone: string) {
  const validation = phoneSchema.safeParse(phone);
  expect(validation.success).toBe(true);
}

/**
 * Assert that reference number is valid
 */
export function assertValidReferenceNumber(refNumber: string) {
  const validation = referenceNumberSchema.safeParse(refNumber);
  expect(validation.success).toBe(true);
}

/**
 * Assert that all required fields are present in data
 */
export function assertRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
) {
  for (const field of requiredFields) {
    expect(data[field]).toBeDefined();
    expect(data[field]).not.toBe('');
    expect(data[field]).not.toBe(null);
  }
}

/**
 * Assert that response contains multiple errors
 */
export function assertMultipleErrors(
  response: any,
  minErrors: number = 2
) {
  expect(response.success).toBe(false);
  expect(response.errors).toBeDefined();
  expect(Object.keys(response.errors).length).toBeGreaterThanOrEqual(minErrors);
}

/**
 * Assert that specific error message is present for a field
 */
export function assertFieldError(
  response: any,
  field: string,
  expectedMessage?: string | RegExp
) {
  expect(response.errors).toBeDefined();
  expect(response.errors[field]).toBeDefined();
  
  if (expectedMessage) {
    if (typeof expectedMessage === 'string') {
      expect(response.errors[field]).toContain(expectedMessage);
    } else {
      expect(response.errors[field]).toMatch(expectedMessage);
    }
  }
}
