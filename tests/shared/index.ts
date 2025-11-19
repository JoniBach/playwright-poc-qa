/**
 * Unified Exports for All Shared Test Modules
 * 
 * Import everything you need from a single location:
 * 
 * @example
 * ```typescript
 * import {
 *   ComponentHelper,
 *   AccessibilityHelper,
 *   JourneyRunner,
 *   assertNoViolations,
 *   validHelicopterData
 * } from '../shared';
 * ```
 */

// ============================================================================
// VALIDATION MODULES
// ============================================================================

// Schemas
export {
  emailSchema,
  phoneSchema,
  referenceNumberSchema,
  validationErrorResponseSchema,
  successResponseSchema,
  helicopterDataSchema,
  planeDataSchema
} from './validation/schemas';

// Assertions
export {
  assertValidationError,
  assertSuccessResponse,
  assertGovUKErrorMessages,
  assertValidReferenceNumber
} from './validation/assertions';

// Fixtures
export {
  validEmails,
  invalidEmails,
  validPhones,
  invalidPhones,
  validHelicopterData,
  validPlaneData,
  mockSuccessResponse,
  mockValidationErrorResponse
} from './validation/fixtures';

// ============================================================================
// COMPONENT MODULES
// ============================================================================

// Helpers
export { ComponentHelper } from './components/helpers';

// Assertions
export {
  assertComponentVisible,
  assertComponentNotVisible,
  assertInputValue,
  assertRadioChecked,
  assertRadioNotChecked,
  assertCheckboxChecked,
  assertErrorSummaryContains,
  assertFieldHasError,
  assertButtonEnabled,
  assertButtonDisabled,
  assertComponentText,
  assertComponentAttribute,
  assertComponentFocused,
  assertAllOptionsVisible,
  assertGovUKPattern
} from './components/assertions';

// ============================================================================
// ACCESSIBILITY MODULES
// ============================================================================

// Helpers
export { AccessibilityHelper } from './accessibility/helpers';

// Assertions
export {
  assertNoViolations,
  assertNoCriticalViolations,
  assertWCAG_AA_Compliant,
  assertViolationCount,
  assertNoViolation,
  assertImagesHaveAltText,
  assertFormLabels,
  assertColorContrast,
  assertValidARIA,
  assertKeyboardAccessible,
  assertHeadingStructure,
  assertNoKeyboardTraps,
  assertSemanticHTML,
  assertScanSummary
} from './accessibility/assertions';

// ============================================================================
// API MODULES
// ============================================================================

export {
  mockSuccessfulSubmission,
  mockValidationErrors,
  mockServerError,
  mockNetworkTimeout,
  createValidationInterceptor,
  RequestCapture
} from './api/mocks';

// ============================================================================
// JOURNEY MODULES
// ============================================================================

// Runner
export { JourneyRunner } from './journeys/runner';

// Steps
export {
  JourneySteps,
  createJourneySteps
} from './journeys/steps';

// Assertions
export {
  assertOnStep,
  assertJourneyComplete,
  assertReferenceNumberDisplayed,
  assertValidationErrors,
  assertFieldError,
  assertSummaryData,
  assertCanNavigateBack,
  assertContinueButtonVisible,
  assertStepCount,
  assertJourneyData,
  assertNoErrors,
  assertConfirmationMessage,
  assertPageTitle,
  assertNotificationBanner,
  assertRequiredFields,
  assertChangeLinksVisible,
  assertAtCheckYourAnswers,
  assertAutofillAvailable,
  assertProgressSaved
} from './journeys/assertions';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Re-export common Playwright types for convenience
export type { Page, Locator, expect } from '@playwright/test';
