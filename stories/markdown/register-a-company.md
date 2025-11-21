# User Stories: Register a company

**Generated:** 11/21/2025, 2:17:36 PM
**Journey ID:** `register-a-company`

## Summary

- **Total Pages:** 8
- **Total Components:** 31
- **User Stories:** 3
- **Acceptance Criteria:** 13
- **Test Scenarios:** 9

### Complexity Breakdown

- **medium:** 3 stories

### Component Coverage

- **textInput:** 17
- **paragraph:** 6
- **heading:** 6
- **insetText:** 2

---

## Story 1: User Story for Registering a Company Journey - Start Page

**ID:** `register-a-company-journey-start-1763734618756`
**Complexity:** medium
**Tags:** `company-registration`, `user-journey`, `GOV.UK`

### User Story

> **As a** new business owner
> **I want** to understand the company registration process before starting my application
> **So that** I can prepare the necessary information needed to register my company efficiently

**Description:**

The 'Before You Start' page provides users with a clear outline of what to expect when registering a new company with Companies House. This aims to set the right expectations and guide them in gathering required information.

**Pages:** `start`, `company-name`

**Components:**

- paragraph: 2
- heading: 1
- textInput: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I am on the Before You Start page
- **When** I view the page contents
- **Then** I should see a brief description of the registration service and what it entails
- **Tags:** `user-information`, `accessibility`, `journey-start`

#### 2. [MUST] ✅

- **Given** I am on the Before You Start page
- **When** I navigate to the company name entry page
- **Then** I should be able to see clear instructions on what is required regarding the company name
- **Tags:** `user-navigation`, `journey-start`

### Test Scenarios

#### 1. Check presence of introductory text [high]

**ID:** `TS-001`
**Description:** Verify that the introductory text is present and correctly displayed on the Before You Start page.

**Steps:**

1. Navigate to the Before You Start page
2. Observe the body text

**Expected Result:** The introductory paragraphs outlining the registration process are displayed clearly.

**Pages:** `start`
**Components:** `paragraph`
**Tags:** `accessibility`, `content-validation`

#### 2. Navigate to company name entry page [high]

**ID:** `TS-002`
**Description:** Ensure user can navigate from Before You Start to the company name entry page without issues.

**Steps:**

1. Click on the 'Start' button to proceed
2. Observe the URL change and title of the new page

**Expected Result:** The user should land on the Company Name entry page with the correct title and input field displayed.

**Pages:** `company-name`
**Components:** `button`, `heading`, `textInput`
**Tags:** `navigation`, `user-experience`

---

## Story 2: Register a Company Journey - Data Entry

**ID:** `register-a-company-data-entry-1763734634631`
**Complexity:** medium
**Tags:** `business-registration`, `data-entry`, `validation`, `government-services`, `accessibility-compliance`

### User Story

> **As a** business user
> **I want** to register a company by entering relevant details through a series of web forms
> **So that** the company can be legally recognized and operate under UK law with ease of access and verification

**Description:**

As a business user, I want to provide all required information to register my company, including the company name, registered office address, director details, shareholder details, and my contact information so that my application can be processed efficiently and accurately.

**Pages:** `company-name`, `registered-office`, `director-details`, `shareholder-details`, `contact-details`

**Components:**

- heading: 4
- textInput: 16
- insetText: 1
- paragraph: 3

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I am on the company name page
- **When** I enter a valid company name that ends with 'Limited' or 'Ltd'
- **Then** I should be able to proceed to the registered office page without any error messages and with visual accessibility requirements met.
- **Tags:** `data-entry`, `validation`, `accessibility`

#### 2. [MUST] ✅

- **Given** I am on the registered office page
- **When** I leave the 'Address line 1' field blank and attempt to proceed
- **Then** I should receive an error message stating that this field is required and should be able to navigate using keyboard shortcuts.
- **Tags:** `form-validation`, `error-handling`, `accessibility`

#### 3. [MUST] ✅

- **Given** I am on the director details page
- **When** I fill in all required fields and submit the form
- **Then** I should successfully be taken to the shareholder details page without any validation errors present.
- **Tags:** `navigation-flow`, `validation`

#### 4. [MUST] ✅

- **Given** I am entering shareholder details
- **When** I enter invalid data types (e.g., letters in 'Number of shares')
- **Then** I should see an error indicating invalid input and remain on the page until corrected.
- **Tags:** `form-validation`, `error-handling`

#### 5. [SHOULD] ✅

- **Given** I am filling out the contact details page
- **When** I enter a valid email format and a valid full name
- **Then** I should be able to submit the form without errors and receive a confirmation of my submission.
- **Tags:** `success-validation`, `email-confirmation`

### Test Scenarios

#### 1. Company Name Submission [critical]

**ID:** `TC1`
**Description:** Verify that the user can submit a valid company name successfully.

**Steps:**

1. Navigate to the company name input page
2. Enter 'Example Company Limited' in the company name field
3. Click the Next button

**Expected Result:** User should be redirected to the registered office page with no errors.

**Pages:** `company-name`
**Components:** `textInput`
**Tags:** `submission`, `navigation`

#### 2. Mandatory Field Validation on Registered Office Page [high]

**ID:** `TC2`
**Description:** Ensure the user cannot proceed without completing required address fields.

**Steps:**

1. Navigate to the registered office page
2. Leave 'Address line 1' blank
3. Click the Next button

**Expected Result:** An error message should appear indicating 'Address line 1 is required.'

**Pages:** `registered-office`
**Components:** `textInput`
**Tags:** `form-validation`, `error-handling`

#### 3. Email Format Validation [medium]

**ID:** `TC3`
**Description:** Check that invalid email formats trigger appropriate error messages.

**Steps:**

1. Navigate to the contact details page
2. Enter 'invalid-email-format' in the email address field
3. Click the Submit button

**Expected Result:** Error message should be displayed indicating an invalid email format.”

**Pages:** `contact-details`
**Components:** `textInput`
**Tags:** `form-validation`, `error-handling`

---

## Story 3: Register a Company Confirmation Page

**ID:** `register-a-company-completion-1763734656547`
**Complexity:** medium
**Tags:** `register-a-company`, `confirmation`, `user-experience`

### User Story

> **As a** Company Registrant
> **I want** to see a confirmation message after I submit my application
> **So that** I can be assured that my application has been received and understand the next steps.

**Description:**

Upon submitting the application to register a company, users should see a confirmation page indicating that their application has been submitted successfully, along with details on how they will be informed about the status of their application. This page should also comply with accessibility standards to ensure all users, including those with disabilities, can navigate it easily.

**Pages:** `confirmation`

**Components:**

- heading: 1
- insetText: 1
- paragraph: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I have submitted my company registration application
- **When** I reach the confirmation page
- **Then** I should see a heading that says 'Your application has been submitted' in a large font size.
- **Tags:** `accessibility`, `user_flow`

#### 2. [MUST] ✅

- **Given** I am on the confirmation page
- **When** I look at the text below the heading
- **Then** I should see an inset text stating 'We’ve sent a confirmation email with your application reference number.'
- **Tags:** `email_confirmation`, `user_flow`

#### 3. [MUST] ✅

- **Given** I am on the confirmation page
- **When** I read the paragraph under the inset text
- **Then** I should see information stating that Companies House will review my application and that I will receive an email when my company has been registered, usually within 24 hours.
- **Tags:** `user_flow`, `deadline_notification`

#### 4. [MUST] ✅

- **Given** I have a disability and use a screen reader
- **When** I navigate to the confirmation page
- **Then** I should be able to hear all headings and content read out clearly with appropriate headings and landmarks as per accessibility standards.
- **Tags:** `accessibility`

#### 5. [SHOULD] ✅

- **Given** I am on the confirmation page
- **When** I press the 'Back' button on my browser
- **Then** I should not lose the progress of my application submission.
- **Tags:** `navigation_flow`

#### 6. [SHOULD] ✅

- **Given** I am viewing the confirmation page
- **When** the page loads
- **Then** the layout of the confirmation page should comply with the GOV.UK Design System standards for responsiveness and clarity.
- **Tags:** `GOV.UK Design System`, `design_compliance`

### Test Scenarios

#### 1. Confirm Application Submission Validation [critical]

**ID:** `TS001`
**Description:** Validate that the confirmation page displays the correct information after the application is submitted.

**Steps:**

1. Navigate to the registration form and complete all fields
2. Submit the application form
3. Wait for the confirmation page to load

**Expected Result:** The confirmation page displays the heading, inset text, and paragraph as described.

**Pages:** `confirmation-page`
**Components:** `heading`, `insetText`, `paragraph`
**Tags:** `confirmation`, `application_process`

#### 2. Accessibility Navigation Check [high]

**ID:** `TS002`
**Description:** Ensure that screen readers can read the confirmation page contents correctly.

**Steps:**

1. Use a screen reader to navigate to the confirmation page

**Expected Result:** All page elements (heading, inset text, paragraph) are accessible and read in the correct order.

**Pages:** `confirmation-page`
**Components:** `heading`, `insetText`, `paragraph`
**Tags:** `accessibility`, `screen_reader`

#### 3. Browser Back Navigation Check [medium]

**ID:** `TS003`
**Description:** Check that pressing the back button does not lose the application data.

**Steps:**

1. Navigate to the confirmation page
2. Press the back button on the browser

**Expected Result:** User should still see their previously entered data when returning to the registration form.

**Pages:** `registration-form`, `confirmation-page`
**Components:** `form`
**Tags:** `navigation_flow`

#### 4. GOV.UK Design Compliance Check [medium]

**ID:** `TS004`
**Description:** Ensure the confirmation page adheres to GOV.UK Design Standards.

**Steps:**

1. Navigate to the confirmation page
2. Inspect CSS and HTML structure

**Expected Result:** All elements are styled as per the GOV.UK Design System expectations, ensuring uniformity.

**Pages:** `confirmation-page`
**Components:** `layout`
**Tags:** `GOV.UK Design System`, `design_compliance`

---
