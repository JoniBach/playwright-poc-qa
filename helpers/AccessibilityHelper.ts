import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Helper
 * Provides utilities for accessibility testing
 */
export class AccessibilityHelper {
  constructor(private page: Page) {}

  /**
   * Run axe accessibility scan on current page
   */
  async scanPage(options?: {
    includeTags?: string[];
    excludeTags?: string[];
    rules?: Record<string, { enabled: boolean }>;
  }) {
    const builder = new AxeBuilder({ page: this.page });

    if (options?.includeTags) {
      builder.withTags(options.includeTags);
    }

    if (options?.excludeTags) {
      for (const tag of options.excludeTags) {
        builder.disableTags([tag]);
      }
    }

    if (options?.rules) {
      builder.options({ rules: options.rules });
    }

    return await builder.analyze();
  }

  /**
   * Scan for WCAG 2.1 Level AA violations
   */
  async scanWCAG_AA() {
    return await this.scanPage({
      includeTags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
    });
  }

  /**
   * Test keyboard navigation
   */
  async testKeyboardNavigation(expectedFocusableElements: number) {
    const focusableElements: string[] = [];
    
    // Tab through all elements
    for (let i = 0; i < expectedFocusableElements; i++) {
      await this.page.keyboard.press('Tab');
      const focusedElement = await this.page.evaluate(() => {
        const el = document.activeElement;
        return el?.tagName + (el?.getAttribute('aria-label') ? ` [${el.getAttribute('aria-label')}]` : '');
      });
      focusableElements.push(focusedElement);
    }

    return focusableElements;
  }

  /**
   * Verify skip link functionality
   */
  async testSkipLink() {
    await this.page.keyboard.press('Tab');
    const skipLink = await this.page.locator('a:has-text("Skip to main content")');
    await skipLink.press('Enter');
    
    const mainContent = await this.page.locator('main, [role="main"]');
    const isFocused = await mainContent.evaluate(el => el === document.activeElement);
    
    return isFocused;
  }

  /**
   * Check color contrast
   */
  async checkColorContrast() {
    return await this.scanPage({
      includeTags: ['cat.color']
    });
  }

  /**
   * Verify ARIA labels and roles
   */
  async verifyARIA() {
    return await this.scanPage({
      includeTags: ['cat.aria']
    });
  }

  /**
   * Check form labels
   */
  async checkFormLabels() {
    return await this.scanPage({
      includeTags: ['cat.forms']
    });
  }

  /**
   * Format accessibility violations for reporting
   */
  formatViolations(violations: any[]) {
    return violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.length,
      targets: violation.nodes.map((node: any) => node.target).flat()
    }));
  }
}
