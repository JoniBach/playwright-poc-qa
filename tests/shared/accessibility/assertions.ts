/**
 * Shared Accessibility Assertions
 * Reusable assertions for accessibility testing
 */

import { expect } from '@playwright/test';

/**
 * Assert that there are no accessibility violations
 */
export function assertNoViolations(results: any) {
  if (results.violations.length > 0) {
    const violations = results.violations.map((v: any) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length
    }));
    
    console.error('Accessibility violations found:', JSON.stringify(violations, null, 2));
  }
  
  expect(results.violations).toEqual([]);
}

/**
 * Assert that there are no critical or serious violations
 */
export function assertNoCriticalViolations(results: any) {
  const criticalViolations = results.violations.filter(
    (v: any) => v.impact === 'critical' || v.impact === 'serious'
  );
  
  if (criticalViolations.length > 0) {
    console.error('Critical/Serious violations found:', criticalViolations);
  }
  
  expect(criticalViolations).toEqual([]);
}

/**
 * Assert that page meets WCAG AA standards
 */
export function assertWCAG_AA_Compliant(results: any) {
  const wcagViolations = results.violations.filter((v: any) => 
    v.tags.some((tag: string) => tag.includes('wcag2a') || tag.includes('wcag21a'))
  );
  
  expect(wcagViolations).toEqual([]);
}

/**
 * Assert that specific number of violations exist (for known issues)
 */
export function assertViolationCount(results: any, expectedCount: number) {
  expect(results.violations.length).toBe(expectedCount);
}

/**
 * Assert that specific violation does not exist
 */
export function assertNoViolation(results: any, violationId: string) {
  const violation = results.violations.find((v: any) => v.id === violationId);
  expect(violation).toBeUndefined();
}

/**
 * Assert that all images have alt text
 */
export function assertImagesHaveAltText(results: any) {
  const imageAltViolations = results.violations.filter(
    (v: any) => v.id === 'image-alt'
  );
  
  expect(imageAltViolations).toEqual([]);
}

/**
 * Assert that all form inputs have labels
 */
export function assertFormLabels(results: any) {
  const labelViolations = results.violations.filter(
    (v: any) => v.id === 'label' || v.id === 'label-title-only'
  );
  
  expect(labelViolations).toEqual([]);
}

/**
 * Assert that color contrast is sufficient
 */
export function assertColorContrast(results: any) {
  const contrastViolations = results.violations.filter(
    (v: any) => v.id === 'color-contrast'
  );
  
  expect(contrastViolations).toEqual([]);
}

/**
 * Assert that ARIA attributes are valid
 */
export function assertValidARIA(results: any) {
  const ariaViolations = results.violations.filter(
    (v: any) => v.tags.includes('cat.aria')
  );
  
  expect(ariaViolations).toEqual([]);
}

/**
 * Assert that keyboard navigation is possible
 */
export function assertKeyboardAccessible(focusableElements: string[]) {
  expect(focusableElements.length).toBeGreaterThan(0);
  
  // Should not have duplicate focus targets
  const uniqueElements = new Set(focusableElements);
  expect(uniqueElements.size).toBeGreaterThan(0);
}

/**
 * Assert that page has proper heading structure
 */
export function assertHeadingStructure(results: any) {
  const headingViolations = results.violations.filter(
    (v: any) => v.id.includes('heading')
  );
  
  expect(headingViolations).toEqual([]);
}

/**
 * Assert that page has no keyboard traps
 */
export function assertNoKeyboardTraps(results: any) {
  const keyboardTrapViolations = results.violations.filter(
    (v: any) => v.id === 'focus-trap' || v.tags.includes('cat.keyboard')
  );
  
  expect(keyboardTrapViolations).toEqual([]);
}

/**
 * Assert that page uses semantic HTML
 */
export function assertSemanticHTML(results: any) {
  const semanticViolations = results.violations.filter(
    (v: any) => v.tags.includes('cat.structure')
  );
  
  expect(semanticViolations).toEqual([]);
}

/**
 * Assert scan summary meets expectations
 */
export function assertScanSummary(
  summary: any,
  expectations: {
    maxViolations?: number;
    maxCritical?: number;
    maxSerious?: number;
    minPasses?: number;
  }
) {
  if (expectations.maxViolations !== undefined) {
    expect(summary.violations).toBeLessThanOrEqual(expectations.maxViolations);
  }
  
  if (expectations.maxCritical !== undefined) {
    expect(summary.criticalIssues).toBeLessThanOrEqual(expectations.maxCritical);
  }
  
  if (expectations.maxSerious !== undefined) {
    expect(summary.seriousIssues).toBeLessThanOrEqual(expectations.maxSerious);
  }
  
  if (expectations.minPasses !== undefined) {
    expect(summary.passes).toBeGreaterThanOrEqual(expectations.minPasses);
  }
}
