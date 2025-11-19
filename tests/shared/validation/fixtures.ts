/**
 * Reusable test data fixtures
 * Provides consistent test data across API, UI, and E2E tests
 */

/**
 * Valid helicopter registration data
 */
export const validHelicopterData = {
  helicopterMake: 'Airbus',
  helicopterModel: 'H125',
  helicopterSerial: 'ABC123456',
  ownerFullName: 'John Smith',
  ownerEmail: 'john.smith@example.com',
  ownerPhone: '07700900000'
};

/**
 * Valid plane registration data
 */
export const validPlaneData = {
  'aircraft-manufacturer': 'Boeing',
  'aircraft-model': '737',
  'aircraft-serial': 'SN123456',
  'applicant-type': 'individual' as const,
  'email-address': 'test@example.com',
  'telephone-number': '07700900123'
};

/**
 * Invalid email addresses for testing
 */
export const invalidEmails = [
  'not-an-email',
  'missing@domain',
  '@nodomain.com',
  'spaces in@email.com',
  'double@@domain.com'
];

/**
 * Valid email addresses for testing
 */
export const validEmails = [
  'test@example.com',
  'user+tag@example.co.uk',
  'first.last@subdomain.example.com',
  'user_name@example.org'
];

/**
 * Invalid phone numbers for testing
 */
export const invalidPhones = [
  '123',
  'not-a-phone',
  '00000000000',
  '+44 123'
];

/**
 * Valid phone numbers for testing
 */
export const validPhones = [
  '07700900000',
  '07700 900 000',
  '+447700900000',
  '+44 7700 900 000'
];

/**
 * Mock success response
 */
export const mockSuccessResponse = {
  success: true,
  complete: true,
  referenceNumber: 'APP-1234567890-ABC123'
};

/**
 * Mock validation error response
 */
export const mockValidationErrorResponse = {
  success: false,
  errors: {
    'email-address': 'Enter a valid email address',
    'telephone-number': 'Enter a valid phone number'
  }
};

/**
 * Generate mock reference number
 */
export function generateMockReferenceNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APP-${timestamp}-${random}`;
}

/**
 * Create partial data (missing required fields)
 */
export function createPartialHelicopterData(includeFields: string[]) {
  const data: Record<string, any> = {};
  const allData = validHelicopterData;
  
  for (const field of includeFields) {
    if (field in allData) {
      data[field] = allData[field as keyof typeof allData];
    }
  }
  
  return data;
}

/**
 * Create data with invalid values
 */
export function createInvalidHelicopterData(invalidFields: Record<string, any>) {
  return {
    ...validHelicopterData,
    ...invalidFields
  };
}
