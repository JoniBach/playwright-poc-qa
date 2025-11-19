/**
 * Reusable API mock responses for UI tests
 * These mocks can be used with Playwright route interception
 */

import { Route } from '@playwright/test';
import { 
  mockSuccessResponse, 
  mockValidationErrorResponse,
  generateMockReferenceNumber 
} from '../validation/fixtures';

/**
 * Mock a successful submission
 */
export async function mockSuccessfulSubmission(route: Route) {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      ...mockSuccessResponse,
      referenceNumber: generateMockReferenceNumber()
    })
  });
}

/**
 * Mock a validation error response
 */
export async function mockValidationErrors(
  route: Route,
  errors: Record<string, string>
) {
  await route.fulfill({
    status: 400,
    contentType: 'application/json',
    body: JSON.stringify({
      success: false,
      errors
    })
  });
}

/**
 * Mock a server error
 */
export async function mockServerError(route: Route, message: string = 'Internal server error') {
  await route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({
      success: false,
      error: message
    })
  });
}

/**
 * Mock a network timeout
 */
export async function mockNetworkTimeout(route: Route) {
  await new Promise(resolve => setTimeout(resolve, 30000));
  await route.abort('timedout');
}

/**
 * Create a validation interceptor that validates request data
 */
export function createValidationInterceptor(
  validateFn: (data: any) => { valid: boolean; errors?: Record<string, string> }
) {
  return async (route: Route) => {
    const request = route.request();
    const postData = await request.postData();
    
    // Parse FormData
    const formData: Record<string, any> = {};
    if (postData) {
      const entries = postData.split('&');
      for (const entry of entries) {
        const [key, value] = entry.split('=').map(decodeURIComponent);
        formData[key] = value;
      }
    }
    
    // Validate
    const validation = validateFn(formData);
    
    if (validation.valid) {
      await mockSuccessfulSubmission(route);
    } else {
      await mockValidationErrors(route, validation.errors || {});
    }
  };
}

/**
 * Capture request data for assertions
 */
export class RequestCapture {
  private requests: Array<{ url: string; method: string; data: any }> = [];
  
  async captureAndRespond(route: Route, response: any) {
    const request = route.request();
    const postData = await request.postData();
    
    this.requests.push({
      url: request.url(),
      method: request.method(),
      data: postData
    });
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  }
  
  getLastRequest() {
    return this.requests[this.requests.length - 1];
  }
  
  getAllRequests() {
    return this.requests;
  }
  
  clear() {
    this.requests = [];
  }
}
