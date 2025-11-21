import { StepBlock } from './JourneyStepBlocks';
import { PatternDetector } from './PatternDetector';

/**
 * Adaptive Blocks
 * Smart blocks that automatically detect and adapt to journey-specific patterns
 * These blocks work across different journey implementations without modification
 */
export class AdaptiveBlocks {
  
  /**
   * Verify errors - adapts to summary or inline error patterns
   */
  static verifyErrors(expectedErrors: string[]): StepBlock {
    return async ({ page }) => {
      const detector = new PatternDetector(page);
      await detector.verifyErrors(expectedErrors);
    };
  }

  /**
   * Verify summary data - adapts to GOV.UK list, <dl>, or table patterns
   */
  static verifySummaryData(expected: Record<string, string>): StepBlock {
    return async ({ page }) => {
      const detector = new PatternDetector(page);
      await detector.verifySummaryData(expected);
    };
  }

  /**
   * Get summary data - returns data regardless of pattern
   */
  static getSummaryData(): StepBlock {
    return async ({ page, journeyRunner }) => {
      const detector = new PatternDetector(page);
      const data = await detector.getSummaryData();
      journeyRunner.storeData('summaryData', data);
    };
  }

  /**
   * Change answer if supported - gracefully handles journeys without change links
   */
  static changeAnswerIfSupported(key: string, newValue: string): StepBlock {
    return async ({ page, componentHelper, journeyRunner }) => {
      const detector = new PatternDetector(page);
      const supportsChange = await detector.detectChangeAnswerSupport();

      if (supportsChange) {
        await componentHelper.clickChangeLink(key);
        await journeyRunner.fillStep({ [key]: newValue });
        await journeyRunner.continue();
      } else {
        console.log(`Journey does not support changing answers - skipping change for "${key}"`);
      }
    };
  }

  /**
   * Navigate back - adapts to button or link patterns
   */
  static goBack(): StepBlock {
    return async ({ journeyRunner }) => {
      await journeyRunner.goBack();
    };
  }

  /**
   * Detect and log journey patterns - useful for debugging
   */
  static detectAndLogPatterns(): StepBlock {
    return async ({ page }) => {
      const detector = new PatternDetector(page);
      const patterns = await detector.detectPatterns();
      console.log('Detected journey patterns:', JSON.stringify(patterns, null, 2));
    };
  }

  /**
   * Complete form page with error retry - handles validation failures gracefully
   */
  static completeFormPageWithRetry(
    heading: string,
    fields: Record<string, string>,
    maxRetries: number = 1
  ): StepBlock {
    return async ({ page, journeyRunner }) => {
      await journeyRunner.verifyHeading(heading);
      await journeyRunner.fillStep(fields);
      await journeyRunner.continue();

      // Check if errors appeared
      const detector = new PatternDetector(page);
      const errors = await detector.getErrorMessages();

      if (errors.length > 0 && maxRetries > 0) {
        console.log(`Form submission failed with errors: ${errors.join(', ')}`);
        console.log(`Retrying with corrected data...`);
        
        // Retry with same data (in real scenario, you'd correct the data)
        await journeyRunner.fillStep(fields);
        await journeyRunner.continue();
      }
    };
  }

  /**
   * Verify check answers page - adapts to any summary pattern
   */
  static verifyCheckAnswers(
    heading: string,
    expectedData?: Record<string, string>
  ): StepBlock {
    return async ({ page, journeyRunner }) => {
      await journeyRunner.verifyHeading(heading);

      if (expectedData) {
        const detector = new PatternDetector(page);
        await detector.verifySummaryData(expectedData);
      }
    };
  }

  /**
   * Complete check answers and submit - adapts to any pattern
   */
  static checkAnswersAndSubmit(
    heading: string = 'Check your answers',
    expectedData?: Record<string, string>
  ): StepBlock {
    return async ({ page, journeyRunner }) => {
      await journeyRunner.verifyHeading(heading);

      if (expectedData) {
        const detector = new PatternDetector(page);
        await detector.verifySummaryData(expectedData);
      }

      await journeyRunner.submit();
    };
  }

  /**
   * Verify validation errors appear - adapts to summary or inline patterns
   */
  static verifyValidationErrors(
    heading: string,
    fields: Record<string, string>,
    expectedErrors: string[]
  ): StepBlock {
    return async ({ page, journeyRunner }) => {
      await journeyRunner.verifyHeading(heading);
      await journeyRunner.fillStep(fields);
      await journeyRunner.continue();

      const detector = new PatternDetector(page);
      await detector.verifyErrors(expectedErrors);
    };
  }

  /**
   * Complete entire journey with pattern detection
   */
  static completeJourneyWithDetection(
    journeyPath: string,
    steps: Array<{ heading: string; fields: Record<string, string> }>,
    checkAnswersHeading: string = 'Check your answers',
    confirmationHeading: string = 'Application submitted'
  ): StepBlock[] {
    const blocks: StepBlock[] = [];

    // Start journey
    blocks.push(async ({ journeyRunner }) => {
      await journeyRunner.startJourney(journeyPath);
    });

    // Detect patterns
    blocks.push(this.detectAndLogPatterns());

    // Complete each step
    for (const step of steps) {
      blocks.push(async ({ journeyRunner }) => {
        await journeyRunner.verifyHeading(step.heading);
        await journeyRunner.fillStep(step.fields);
        await journeyRunner.continue();
      });
    }

    // Check answers and submit
    blocks.push(this.checkAnswersAndSubmit(checkAnswersHeading));

    // Verify confirmation
    blocks.push(async ({ journeyRunner }) => {
      await journeyRunner.verifyHeading(confirmationHeading);
    });

    return blocks;
  }

  /**
   * Smart error verification that works with any pattern
   */
  static smartVerifyErrors(expectedErrors: string[]): StepBlock {
    return async ({ page }) => {
      // Wait for page to stabilize
      await page.waitForLoadState('domcontentloaded');
      
      const detector = new PatternDetector(page);
      const pattern = await detector.detectErrorDisplayPattern();
      
      console.log(`Detected error pattern: ${pattern}`);
      
      if (pattern === 'none') {
        throw new Error('No errors displayed on page');
      }

      await detector.verifyErrors(expectedErrors);
    };
  }

  /**
   * Smart summary verification that works with any list pattern
   */
  static smartVerifySummary(expected: Record<string, string>): StepBlock {
    return async ({ page }) => {
      const detector = new PatternDetector(page);
      const pattern = await detector.detectSummaryListPattern();
      
      console.log(`Detected summary list pattern: ${pattern}`);
      
      if (pattern === 'none') {
        throw new Error('No summary list found on page');
      }

      await detector.verifySummaryData(expected);
    };
  }

  /**
   * Conditional change answer - only attempts if supported
   */
  static conditionalChangeAnswer(
    key: string,
    newValue: string,
    fallbackAction?: StepBlock
  ): StepBlock {
    return async (context) => {
      const { page } = context;
      const detector = new PatternDetector(page);
      const supportsChange = await detector.detectChangeAnswerSupport();

      if (supportsChange) {
        await this.changeAnswerIfSupported(key, newValue)(context);
      } else if (fallbackAction) {
        console.log(`Change not supported - executing fallback action`);
        await fallbackAction(context);
      } else {
        console.log(`Change not supported and no fallback provided - skipping`);
      }
    };
  }
}
