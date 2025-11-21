import { Page } from '@playwright/test';

/**
 * Pattern Detector
 * Detects which UI patterns a journey uses at runtime
 * This enables flexible, adaptive test blocks that work across different journey implementations
 */

export interface JourneyPatterns {
  errorDisplay: 'summary' | 'inline' | 'both' | 'none';
  summaryList: 'govuk-summary-list' | 'dl' | 'table' | 'none';
  changeAnswers: boolean;
  backNavigation: 'button' | 'link' | 'both' | 'none';
  smartQuotes: boolean;
}

export class PatternDetector {
  constructor(private page: Page) {}

  /**
   * Detect all patterns used by the current page/journey
   */
  async detectPatterns(): Promise<JourneyPatterns> {
    return {
      errorDisplay: await this.detectErrorDisplayPattern(),
      summaryList: await this.detectSummaryListPattern(),
      changeAnswers: await this.detectChangeAnswerSupport(),
      backNavigation: await this.detectBackNavigationPattern(),
      smartQuotes: await this.detectSmartQuotes()
    };
  }

  /**
   * Detect how errors are displayed
   */
  async detectErrorDisplayPattern(): Promise<'summary' | 'inline' | 'both' | 'none'> {
    const hasErrorSummary = await this.page.locator('.govuk-error-summary').isVisible().catch(() => false);
    const hasInlineErrors = await this.page.locator('text=Error:').isVisible().catch(() => false);

    if (hasErrorSummary && hasInlineErrors) return 'both';
    if (hasErrorSummary) return 'summary';
    if (hasInlineErrors) return 'inline';
    return 'none';
  }

  /**
   * Detect summary list pattern on check answers page
   */
  async detectSummaryListPattern(): Promise<'govuk-summary-list' | 'dl' | 'table' | 'none'> {
    const hasGovUKList = await this.page.locator('.govuk-summary-list').isVisible().catch(() => false);
    if (hasGovUKList) return 'govuk-summary-list';

    const hasDL = await this.page.locator('dl').isVisible().catch(() => false);
    if (hasDL) return 'dl';

    const hasTable = await this.page.locator('table').isVisible().catch(() => false);
    if (hasTable) return 'table';

    return 'none';
  }

  /**
   * Detect if change answer links are present
   */
  async detectChangeAnswerSupport(): Promise<boolean> {
    const hasChangeLinks = await this.page.locator('a:has-text("Change")').count() > 0;
    return hasChangeLinks;
  }

  /**
   * Detect back navigation pattern
   */
  async detectBackNavigationPattern(): Promise<'button' | 'link' | 'both' | 'none'> {
    const hasBackButton = await this.page.getByRole('button', { name: 'Back' }).isVisible().catch(() => false);
    const hasBackLink = await this.page.getByRole('link', { name: 'Back' }).isVisible().catch(() => false);

    if (hasBackButton && hasBackLink) return 'both';
    if (hasBackButton) return 'button';
    if (hasBackLink) return 'link';
    return 'none';
  }

  /**
   * Detect if page uses smart quotes
   */
  async detectSmartQuotes(): Promise<boolean> {
    const pageContent = await this.page.content();
    // Check for Unicode smart quotes (U+2018, U+2019, U+201C, U+201D)
    return /[\u2018\u2019\u201C\u201D]/.test(pageContent);
  }

  /**
   * Get summary list data regardless of pattern
   */
  async getSummaryData(): Promise<Record<string, string>> {
    const pattern = await this.detectSummaryListPattern();
    
    switch (pattern) {
      case 'govuk-summary-list':
        return this.getGovUKSummaryData();
      case 'dl':
        return this.getDLSummaryData();
      case 'table':
        return this.getTableSummaryData();
      default:
        return {};
    }
  }

  /**
   * Get data from GOV.UK summary list
   */
  private async getGovUKSummaryData(): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    const rows = await this.page.locator('.govuk-summary-list__row').all();

    for (const row of rows) {
      const key = await row.locator('.govuk-summary-list__key').textContent();
      const value = await row.locator('.govuk-summary-list__value').textContent();
      if (key && value) {
        data[key.trim()] = value.trim();
      }
    }

    return data;
  }

  /**
   * Get data from <dl> description list
   */
  private async getDLSummaryData(): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    const terms = await this.page.locator('dt').all();

    for (const term of terms) {
      const key = await term.textContent();
      const definition = await term.locator('+ dd').textContent();
      if (key && definition) {
        data[key.trim()] = definition.trim();
      }
    }

    return data;
  }

  /**
   * Get data from table
   */
  private async getTableSummaryData(): Promise<Record<string, string>> {
    const data: Record<string, string> = {};
    const rows = await this.page.locator('table tr').all();

    for (const row of rows) {
      const cells = await row.locator('td, th').all();
      if (cells.length >= 2) {
        const key = await cells[0].textContent();
        const value = await cells[1].textContent();
        if (key && value) {
          data[key.trim()] = value.trim();
        }
      }
    }

    return data;
  }

  /**
   * Verify summary data matches expected values (pattern-agnostic)
   */
  async verifySummaryData(expected: Record<string, string>): Promise<void> {
    const actual = await this.getSummaryData();

    for (const [key, expectedValue] of Object.entries(expected)) {
      const actualValue = actual[key];
      if (!actualValue) {
        throw new Error(`Summary key "${key}" not found. Available keys: ${Object.keys(actual).join(', ')}`);
      }
      if (actualValue !== expectedValue) {
        throw new Error(`Summary value mismatch for "${key}": expected "${expectedValue}", got "${actualValue}"`);
      }
    }
  }

  /**
   * Get all error messages regardless of pattern
   */
  async getErrorMessages(): Promise<string[]> {
    const pattern = await this.detectErrorDisplayPattern();
    
    switch (pattern) {
      case 'summary':
        return this.getErrorSummaryMessages();
      case 'inline':
        return this.getInlineErrorMessages();
      case 'both':
        const summaryErrors = await this.getErrorSummaryMessages();
        const inlineErrors = await this.getInlineErrorMessages();
        return [...new Set([...summaryErrors, ...inlineErrors])];
      default:
        return [];
    }
  }

  /**
   * Get error messages from error summary
   */
  private async getErrorSummaryMessages(): Promise<string[]> {
    const errorSummary = this.page.locator('.govuk-error-summary');
    const isVisible = await errorSummary.isVisible().catch(() => false);
    
    if (!isVisible) return [];

    const errorLinks = await errorSummary.locator('a').all();
    const messages: string[] = [];

    for (const link of errorLinks) {
      const text = await link.textContent();
      if (text) messages.push(text.trim());
    }

    return messages;
  }

  /**
   * Get inline error messages
   */
  private async getInlineErrorMessages(): Promise<string[]> {
    const errorElements = await this.page.locator('p:has-text("Error:")').all();
    const messages: string[] = [];

    for (const element of errorElements) {
      const text = await element.textContent();
      if (text) {
        // Remove "Error:" prefix and trim
        const message = text.replace(/^Error:\s*/i, '').trim();
        if (message) messages.push(message);
      }
    }

    return messages;
  }

  /**
   * Verify errors are displayed (pattern-agnostic)
   */
  async verifyErrors(expectedErrors: string[]): Promise<void> {
    const actualErrors = await this.getErrorMessages();

    for (const expected of expectedErrors) {
      const found = actualErrors.some(actual => 
        actual.toLowerCase().includes(expected.toLowerCase())
      );

      if (!found) {
        throw new Error(
          `Expected error "${expected}" not found. Actual errors: ${actualErrors.join(', ')}`
        );
      }
    }
  }
}
