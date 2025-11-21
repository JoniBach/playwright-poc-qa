import { Page } from '@playwright/test';
import { JourneyRunner } from './JourneyRunner';
import { ComponentHelper } from './ComponentHelper';
import { StepBlock, StepBlockContext } from './JourneyStepBlocks';

/**
 * Journey Builder
 * Fluent API for composing journey tests from reusable step blocks
 * 
 * Example usage:
 * ```typescript
 * await new JourneyBuilder(page, journeyRunner, componentHelper)
 *   .addStep(JourneyStepBlocks.startJourney('/path'))
 *   .addStep(JourneyStepBlocks.selectIndividualApplicant())
 *   .addStep(JourneyStepBlocks.fillContactDetails())
 *   .addStep(JourneyStepBlocks.checkYourAnswersAndSubmit())
 *   .addStep(JourneyStepBlocks.verifyConfirmation())
 *   .execute();
 * ```
 */
export class JourneyBuilder {
  private steps: StepBlock[] = [];
  private context: StepBlockContext;
  private sharedData: Record<string, any> = {};

  constructor(
    page: Page,
    journeyRunner: JourneyRunner,
    componentHelper: ComponentHelper,
    initialData?: Record<string, any>
  ) {
    this.context = {
      page,
      journeyRunner,
      componentHelper,
      data: initialData || {}
    };
    this.sharedData = initialData || {};
  }

  /**
   * Add a single step block to the journey
   */
  addStep(step: StepBlock): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Add multiple step blocks to the journey
   */
  addSteps(steps: StepBlock[]): this {
    this.steps.push(...steps);
    return this;
  }

  /**
   * Add a custom step function
   */
  addCustomStep(stepFn: (context: StepBlockContext) => Promise<void>): this {
    this.steps.push(stepFn);
    return this;
  }

  /**
   * Set shared data that will be available to all steps
   */
  setData(key: string, value: any): this {
    this.sharedData[key] = value;
    this.context.data = this.sharedData;
    return this;
  }

  /**
   * Get shared data
   */
  getData(key: string): any {
    return this.sharedData[key];
  }

  /**
   * Execute all steps in sequence
   */
  async execute(): Promise<void> {
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      
      try {
        // Update context with latest shared data
        this.context.data = this.sharedData;
        
        // Execute the step
        await step(this.context);
        
        // Sync any data stored in journeyRunner back to shared data
        this.syncDataFromJourneyRunner();
        
      } catch (error) {
        throw new Error(`Journey failed at step ${i + 1}: ${error}`);
      }
    }
  }

  /**
   * Execute steps up to a specific index (useful for testing partial journeys)
   */
  async executeUpTo(stepIndex: number): Promise<void> {
    const stepsToExecute = this.steps.slice(0, stepIndex + 1);
    const originalSteps = this.steps;
    
    this.steps = stepsToExecute;
    await this.execute();
    
    this.steps = originalSteps;
  }

  /**
   * Execute a specific range of steps
   */
  async executeRange(startIndex: number, endIndex: number): Promise<void> {
    const stepsToExecute = this.steps.slice(startIndex, endIndex + 1);
    const originalSteps = this.steps;
    
    this.steps = stepsToExecute;
    await this.execute();
    
    this.steps = originalSteps;
  }

  /**
   * Get the number of steps in the journey
   */
  getStepCount(): number {
    return this.steps.length;
  }

  /**
   * Clear all steps
   */
  clear(): this {
    this.steps = [];
    return this;
  }

  /**
   * Reset shared data
   */
  resetData(): this {
    this.sharedData = {};
    this.context.data = {};
    return this;
  }

  /**
   * Sync data from JourneyRunner to shared data
   * This allows steps to share data through the JourneyRunner's storage
   */
  private syncDataFromJourneyRunner(): void {
    // Common data keys that might be stored in JourneyRunner
    const commonKeys = [
      'contactData',
      'companyData',
      'addressData',
      'aircraftData',
      'referenceNumber'
    ];

    for (const key of commonKeys) {
      const value = this.context.journeyRunner.getData(key);
      if (value !== undefined) {
        this.sharedData[key] = value;
      }
    }
  }

  /**
   * Clone this builder (useful for creating variations of a journey)
   */
  clone(): JourneyBuilder {
    const cloned = new JourneyBuilder(
      this.context.page,
      this.context.journeyRunner,
      this.context.componentHelper,
      { ...this.sharedData }
    );
    cloned.steps = [...this.steps];
    return cloned;
  }
}

/**
 * Journey Template Builder
 * Pre-configured journey templates for common patterns
 */
export class JourneyTemplates {
  
  /**
   * Create a basic individual application journey template
   */
  static individualApplication(
    page: Page,
    journeyRunner: JourneyRunner,
    componentHelper: ComponentHelper,
    journeyPath: string
  ): JourneyBuilder {
    return new JourneyBuilder(page, journeyRunner, componentHelper)
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.startJourney(journeyPath);
      });
  }

  /**
   * Create a basic organisation application journey template
   */
  static organisationApplication(
    page: Page,
    journeyRunner: JourneyRunner,
    componentHelper: ComponentHelper,
    journeyPath: string
  ): JourneyBuilder {
    return new JourneyBuilder(page, journeyRunner, componentHelper)
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.startJourney(journeyPath);
      });
  }

  /**
   * Create a multi-page form journey template
   */
  static multiPageForm(
    page: Page,
    journeyRunner: JourneyRunner,
    componentHelper: ComponentHelper,
    journeyPath: string
  ): JourneyBuilder {
    return new JourneyBuilder(page, journeyRunner, componentHelper)
      .addCustomStep(async ({ journeyRunner }) => {
        await journeyRunner.startJourney(journeyPath);
      });
  }
}
