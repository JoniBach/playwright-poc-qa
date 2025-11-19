import { test, expect } from '@playwright/test';
import { AccessibilityHelper } from '../../helpers/AccessibilityHelper';

/**
 * Accessibility Tests with Known Issues Documented
 * This version allows known violations while preventing new ones
 */
test.describe('WCAG 2.1 AA Compliance (With Known Issues) @a11y', () => {
  
  const KNOWN_ISSUES = {
    'document-title': {
      description: 'Missing page titles',
      severity: 'serious',
      jiraTicket: 'TODO: Create ticket',
      fixRequired: true
    }
  };

  test('should only have known accessibility violations on home page', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/');
    const results = await a11y.scanWCAG_AA();
    
    // Filter out known issues
    const unknownViolations = results.violations.filter(
      v => !KNOWN_ISSUES[v.id]
    );
    
    // Log known issues
    const knownViolations = results.violations.filter(
      v => KNOWN_ISSUES[v.id]
    );
    
    if (knownViolations.length > 0) {
      console.log('Known accessibility issues found:');
      knownViolations.forEach(v => {
        const issue = KNOWN_ISSUES[v.id];
        console.log(`  - ${v.id}: ${issue.description} (${issue.severity})`);
        console.log(`    Ticket: ${issue.jiraTicket}`);
      });
    }
    
    // Fail only on NEW violations
    expect(unknownViolations).toEqual([]);
  });

  test('should only have known violations on journey pages', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    const results = await a11y.scanWCAG_AA();
    
    const unknownViolations = results.violations.filter(
      v => !KNOWN_ISSUES[v.id]
    );
    
    const knownViolations = results.violations.filter(
      v => KNOWN_ISSUES[v.id]
    );
    
    if (knownViolations.length > 0) {
      console.log('Known accessibility issues on journey page:');
      knownViolations.forEach(v => {
        const issue = KNOWN_ISSUES[v.id];
        console.log(`  - ${v.id}: ${issue.description}`);
      });
    }
    
    expect(unknownViolations).toEqual([]);
  });

  test('should have proper form labels (no known issues)', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    await page.getByLabel('An individual').check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Manufacturer').fill('Test');
    await page.getByLabel('Model').fill('Test');
    await page.getByLabel('Serial number').fill('Test');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    const results = await a11y.checkFormLabels();
    
    // Form labels should have NO violations (not a known issue)
    expect(results.violations).toEqual([]);
  });

  test('should meet AA color contrast (not AAA)', async ({ page }) => {
    const a11y = new AccessibilityHelper(page);
    
    await page.goto('/civil-aviation-authority/register-a-plane/apply');
    
    // Check for WCAG 2.1 AA color contrast (4.5:1)
    // Not AAA enhanced (7:1) which is stricter
    const results = await a11y.scanPage({
      includeTags: ['wcag2a', 'wcag2aa'],
      rules: {
        'color-contrast-enhanced': { enabled: false } // Disable AAA check
      }
    });
    
    const contrastViolations = results.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    // Should pass AA contrast (GOV.UK green is 6.2:1, needs 4.5:1 for AA)
    expect(contrastViolations).toEqual([]);
  });
});
