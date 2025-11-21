import { StepBlock } from './JourneyStepBlocks';

/**
 * GOV.UK Pattern Blocks
 * Reusable blocks for common GOV.UK Design System patterns
 * 
 * These blocks implement standard GOV.UK patterns like:
 * - Start pages
 * - Question pages
 * - Check your answers
 * - Confirmation pages
 * - Task lists
 */
export class GovUKPatternBlocks {
  
  // ==================== START PAGE PATTERN ====================
  
  /**
   * Standard GOV.UK start page pattern
   * Verifies heading and clicks "Start now" button
   */
  static startPage(heading: string = 'Before you start'): StepBlock {
    return async ({ journeyRunner, page }) => {
      await journeyRunner.verifyHeading(heading);
      
      // Start pages typically have a "Start now" button
      const startButton = page.getByRole('button', { name: /Start now|Continue/i });
      await startButton.click();
    };
  }

  // ==================== QUESTION PAGE PATTERNS ====================

  /**
   * Yes/No question pattern
   */
  static yesNoQuestion(question: string, answer: 'Yes' | 'No'): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(question);
      await journeyRunner.selectRadio(answer);
      await journeyRunner.continue();
    };
  }

  /**
   * Multiple choice question pattern
   */
  static multipleChoice(question: string, option: string): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(question);
      await journeyRunner.selectRadio(option);
      await journeyRunner.continue();
    };
  }

  /**
   * Checkbox list pattern (select multiple)
   */
  static checkboxList(question: string, options: string[]): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(question);
      
      for (const option of options) {
        await journeyRunner.checkCheckbox(option);
      }
      
      await journeyRunner.continue();
    };
  }

  /**
   * Date input pattern (GOV.UK date component)
   */
  static dateInput(question: string, date: { day: string; month: string; year: string }): StepBlock {
    return async ({ journeyRunner, page }) => {
      await journeyRunner.verifyHeading(question);
      
      // GOV.UK date inputs have separate day, month, year fields
      await page.getByLabel('Day').fill(date.day);
      await page.getByLabel('Month').fill(date.month);
      await page.getByLabel('Year').fill(date.year);
      
      await journeyRunner.continue();
    };
  }

  /**
   * File upload pattern
   */
  static fileUpload(question: string, filePath: string): StepBlock {
    return async ({ journeyRunner, page }) => {
      await journeyRunner.verifyHeading(question);
      
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(filePath);
      
      await journeyRunner.continue();
    };
  }

  // ==================== CHECK YOUR ANSWERS PATTERN ====================

  /**
   * Verify multiple summary rows on Check Your Answers page
   */
  static verifySummaryRows(rows: Record<string, string>): StepBlock {
    return async ({ componentHelper }) => {
      for (const [key, value] of Object.entries(rows)) {
        await componentHelper.verifySummaryRow(key, value);
      }
    };
  }

  /**
   * Change multiple answers from Check Your Answers page
   */
  static changeAnswers(changes: Record<string, string>): StepBlock {
    return async ({ componentHelper, journeyRunner }) => {
      for (const [key, newValue] of Object.entries(changes)) {
        await componentHelper.clickChangeLink(key);
        
        // Assuming single field to change - adjust as needed
        await journeyRunner.fillStep({ [key]: newValue });
        await journeyRunner.continue();
      }
    };
  }

  // ==================== TASK LIST PATTERN ====================

  /**
   * Navigate to a task in a task list
   */
  static selectTask(taskName: string): StepBlock {
    return async ({ page }) => {
      await page.getByRole('link', { name: taskName }).click();
    };
  }

  /**
   * Verify task status in task list
   */
  static verifyTaskStatus(taskName: string, status: 'Not started' | 'In progress' | 'Completed'): StepBlock {
    return async ({ page }) => {
      const taskRow = page.locator('.govuk-task-list__item', {
        has: page.getByText(taskName)
      });
      
      const statusTag = taskRow.locator('.govuk-task-list__status');
      await statusTag.waitFor();
      
      const statusText = await statusTag.textContent();
      if (!statusText?.includes(status)) {
        throw new Error(`Expected task "${taskName}" to have status "${status}" but got "${statusText}"`);
      }
    };
  }

  // ==================== NOTIFICATION BANNER PATTERN ====================

  /**
   * Verify success notification banner
   */
  static verifySuccessNotification(message: string): StepBlock {
    return async ({ componentHelper }) => {
      await componentHelper.verifyNotification(message);
    };
  }

  /**
   * Verify important notification banner
   */
  static verifyImportantNotification(message: string): StepBlock {
    return async ({ page }) => {
      const banner = page.locator('.govuk-notification-banner--important');
      await banner.waitFor();
      await banner.getByText(message).waitFor();
    };
  }

  // ==================== ACCORDION PATTERN ====================

  /**
   * Expand accordion section and verify content
   */
  static expandAccordionAndVerify(sectionHeading: string, expectedContent: string): StepBlock {
    return async ({ componentHelper, page }) => {
      await componentHelper.expandAccordion(sectionHeading);
      
      const section = componentHelper.getAccordionSection(sectionHeading);
      await section.getByText(expectedContent).waitFor();
    };
  }

  // ==================== TABS PATTERN ====================

  /**
   * Switch to a specific tab
   */
  static selectTab(tabName: string): StepBlock {
    return async ({ page }) => {
      await page.getByRole('tab', { name: tabName }).click();
    };
  }

  /**
   * Verify content in active tab
   */
  static verifyTabContent(content: string): StepBlock {
    return async ({ page }) => {
      const activePanel = page.locator('.govuk-tabs__panel:not([hidden])');
      await activePanel.getByText(content).waitFor();
    };
  }

  // ==================== WARNING TEXT PATTERN ====================

  /**
   * Verify warning text is displayed
   */
  static verifyWarning(warningText: string): StepBlock {
    return async ({ page }) => {
      const warning = page.locator('.govuk-warning-text');
      await warning.waitFor();
      await warning.getByText(warningText).waitFor();
    };
  }

  // ==================== INSET TEXT PATTERN ====================

  /**
   * Verify inset text is displayed
   */
  static verifyInsetText(text: string): StepBlock {
    return async ({ page }) => {
      const inset = page.locator('.govuk-inset-text');
      await inset.waitFor();
      await inset.getByText(text).waitFor();
    };
  }

  // ==================== DETAILS (DISCLOSURE) PATTERN ====================

  /**
   * Expand details component and verify content
   */
  static expandDetailsAndVerify(summary: string, expectedContent: string): StepBlock {
    return async ({ page }) => {
      const details = page.locator('details', {
        has: page.locator('summary', { hasText: summary })
      });
      
      // Expand if not already expanded
      const isOpen = await details.getAttribute('open');
      if (!isOpen) {
        await details.locator('summary').click();
      }
      
      await details.getByText(expectedContent).waitFor();
    };
  }

  // ==================== TABLE PATTERN ====================

  /**
   * Verify table row content
   */
  static verifyTableRow(rowIndex: number, expectedCells: string[]): StepBlock {
    return async ({ page }) => {
      const row = page.locator('.govuk-table tbody tr').nth(rowIndex);
      
      for (let i = 0; i < expectedCells.length; i++) {
        const cell = row.locator('td').nth(i);
        await cell.waitFor();
        
        const cellText = await cell.textContent();
        if (!cellText?.includes(expectedCells[i])) {
          throw new Error(`Expected cell ${i} to contain "${expectedCells[i]}" but got "${cellText}"`);
        }
      }
    };
  }

  // ==================== PAGINATION PATTERN ====================

  /**
   * Navigate to next page in pagination
   */
  static nextPage(): StepBlock {
    return async ({ page }) => {
      await page.getByRole('link', { name: /Next/i }).click();
    };
  }

  /**
   * Navigate to previous page in pagination
   */
  static previousPage(): StepBlock {
    return async ({ page }) => {
      await page.getByRole('link', { name: /Previous/i }).click();
    };
  }

  /**
   * Navigate to specific page number
   */
  static goToPage(pageNumber: number): StepBlock {
    return async ({ page }) => {
      await page.getByRole('link', { name: pageNumber.toString() }).click();
    };
  }

  // ==================== BREADCRUMB PATTERN ====================

  /**
   * Navigate using breadcrumb
   */
  static clickBreadcrumb(linkText: string): StepBlock {
    return async ({ page }) => {
      const breadcrumb = page.locator('.govuk-breadcrumbs');
      await breadcrumb.getByRole('link', { name: linkText }).click();
    };
  }

  // ==================== PHASE BANNER PATTERN ====================

  /**
   * Verify phase banner is displayed
   */
  static verifyPhaseBanner(phase: 'Alpha' | 'Beta', feedbackLink?: boolean): StepBlock {
    return async ({ page }) => {
      const banner = page.locator('.govuk-phase-banner');
      await banner.waitFor();
      
      const tag = banner.locator('.govuk-phase-banner__content__tag');
      await tag.waitFor();
      
      const tagText = await tag.textContent();
      if (!tagText?.includes(phase)) {
        throw new Error(`Expected phase banner to show "${phase}" but got "${tagText}"`);
      }
      
      if (feedbackLink) {
        await banner.getByRole('link', { name: /feedback/i }).waitFor();
      }
    };
  }

  // ==================== COOKIE BANNER PATTERN ====================

  /**
   * Accept cookies
   */
  static acceptCookies(): StepBlock {
    return async ({ page }) => {
      const cookieBanner = page.locator('.govuk-cookie-banner');
      const isVisible = await cookieBanner.isVisible().catch(() => false);
      
      if (isVisible) {
        await cookieBanner.getByRole('button', { name: /Accept/i }).click();
      }
    };
  }

  /**
   * Reject cookies
   */
  static rejectCookies(): StepBlock {
    return async ({ page }) => {
      const cookieBanner = page.locator('.govuk-cookie-banner');
      const isVisible = await cookieBanner.isVisible().catch(() => false);
      
      if (isVisible) {
        await cookieBanner.getByRole('button', { name: /Reject/i }).click();
      }
    };
  }

  // ==================== COMPOSITE PATTERNS ====================

  /**
   * Complete a standard form page (heading + fields + continue)
   */
  static completeFormPage(heading: string, fields: Record<string, string>): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(heading);
      await journeyRunner.fillStep(fields);
      await journeyRunner.continue();
    };
  }

  /**
   * Complete a question page with radio selection
   */
  static completeQuestionPage(heading: string, option: string): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(heading);
      await journeyRunner.selectRadio(option);
      await journeyRunner.continue();
    };
  }

  /**
   * Standard confirmation page verification
   */
  static verifyConfirmationPage(heading: string, referenceLabel?: string): StepBlock {
    return async ({ journeyRunner, componentHelper, page }) => {
      await journeyRunner.verifyHeading(heading);
      await componentHelper.verifyPanelTitle(heading);
      
      if (referenceLabel) {
        const panel = page.locator('.govuk-panel');
        await panel.getByText(referenceLabel).waitFor();
      }
    };
  }
}
