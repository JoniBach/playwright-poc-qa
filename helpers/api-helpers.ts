/**
 * API Test Helpers
 * Utilities for testing journey API endpoints
 */

/**
 * Create FormData from an object
 * The server expects multipart/form-data, not JSON
 */
export function createFormData(data: Record<string, string>): FormData {
  const formData = new FormData();
  
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  
  return formData;
}

/**
 * Valid test data for register-a-plane journey
 */
export const validPlaneData = {
  'applicant-type': 'individual',
  'aircraft-manufacturer': 'Cessna',
  'aircraft-model': '172S',
  'aircraft-serial-number': '17280001',
  'full-name': 'John Smith',
  'email-address': 'john.smith@example.com',
  'telephone-number': '07700900123'
};

/**
 * Minimal valid data (for testing specific fields)
 */
export function getMinimalValidData(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    ...validPlaneData,
    ...overrides
  };
}
