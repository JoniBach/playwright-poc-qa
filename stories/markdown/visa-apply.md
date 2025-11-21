# User Stories: Apply for a UK visa

**Generated:** 11/21/2025, 1:24:33 PM
**Journey ID:** `visa-apply`

## Summary

- **Total Pages:** 8
- **Total Components:** 30
- **User Stories:** 4
- **Acceptance Criteria:** 22
- **Test Scenarios:** 15

### Complexity Breakdown

- **simple:** 1 story
- **medium:** 3 stories

### Component Coverage

- **textInput:** 13
- **paragraph:** 8
- **radios:** 4
- **heading:** 3
- **dateInput:** 2
- **textarea:** 1
- **panel:** 1
- **list:** 1
- **warningText:** 1
- **button:** 1

---

## Story 1: Start Applying for a UK Visa

**ID:** `visa-apply-journey-start-1763731417015`
**Complexity:** medium
**Tags:** `governmentService`, `visaApplication`, `userJourney`, `GOVUKDesignSystem`, `accessibility`

### User Story

> **As a** User looking to apply for a UK visa
> **I want** to understand the application process and select the type of visa I need
> **So that** I can successfully start my application and ensure I meet all requirements

**Description:**

The start page provides essential information about the UK visa application process, including a prompt to gather biometric information. The visa type selection page allows users to choose the correct visa they intend to apply for, ensuring they are directed to the appropriate application pathway.

**Pages:** `start`, `visa-type`

**Components:**

- paragraph: 2
- heading: 1
- radios: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I am on the 'Start' page of the visa application journey
- **When** I read the instructions provided
- **Then** I should understand that I need to apply for my visa online and provide biometric information at a visa application centre
- **Tags:** `userNeed`, `journeyStart`, `accessibility`

#### 2. [MUST] ✅

- **Given** I am on the 'Type of visa' page
- **When** I see the radio buttons available for selection
- **Then** I should be able to select one of the visa types available (Standard Visitor, Skilled Worker, Student, Family)
- **Tags:** `visaType`, `formValidation`

#### 3. [MUST] ✅

- **Given** I try to proceed without selecting a visa type
- **When** I see a validation message
- **Then** I should not be able to continue and should see an error prompting me to select a visa type
- **Tags:** `validation`, `errorHandling`

#### 4. [MUST] ✅

- **Given** I have selected a visa type and I wish to continue
- **When** I click the 'Continue' button
- **Then** I should be taken to the next step in the application process
- **Tags:** `navigationFlow`

#### 5. [SHOULD] ✅

- **Given** I am on the 'Type of visa' page
- **When** I use a screen reader to navigate
- **Then** I should be able to understand all the options and headings clearly with appropriate labels provided by ARIA attributes
- **Tags:** `accessibility`, `a11y`

### Test Scenarios

#### 1. Display Instructions on Start Page [high]

**ID:** `TS001`
**Description:** Verify that instructions about the application process are displayed correctly on the Start page.

**Steps:**

1. Navigate to the Start page of the visa application journey
2. Check if the paragraph about applying online is visible
3. Check if the paragraph about biometric information is visible

**Expected Result:** Instructions are displayed clearly and are understandable to users

**Pages:** `start`
**Components:** `paragraph`
**Tags:** `usability`

#### 2. Select Visa Type and Proceed [critical]

**ID:** `TS002`
**Description:** Ensure users can select a visa type and proceed to the next step.

**Steps:**

1. Navigate to the Type of visa page
2. Select a visa type radio button
3. Click 'Continue'

**Expected Result:** User is directed to the appropriate next step in the journey after selecting a visa type

**Pages:** `visa-type`
**Components:** `radios`
**Tags:** `journeyFlow`

#### 3. Validation for Visa Type Selection [high]

**ID:** `TS003`
**Description:** Check if validation prompts occur when no visa type is selected.

**Steps:**

1. Navigate to the Type of visa page
2. Leave the visa type unselected
3. Click 'Continue'

**Expected Result:** An error message prompts the user to select a visa type before proceeding

**Pages:** `visa-type`
**Components:** `radios`
**Tags:** `validation`, `errorHandling`

---

## Story 2: User story for visa application personal and travel details entry

**ID:** `visa-apply-data-entry-1763731439074`
**Complexity:** medium
**Tags:** `visa-application`, `data-entry`, `accessibility`, `validation`, `error-handling`, `navigation-flow`

### User Story

> **As a** visa applicant
> **I want** to fill in my personal details, travel details, address in the UK, and financial evidence
> **So that** I can successfully apply for a UK visa without any issues or errors

**Description:**

As a visa applicant, I want to easily enter my personal, travel, UK address, and financial details through a user-friendly interface. The interface should be compliant with GOV.UK Design System, accessible for all users, and ensure that all required fields are validated properly to enhance my application experience and success.

**Pages:** `personal-details`, `travel-details`, `uk-address`, `financial-evidence`

**Components:**

- textInput: 11
- dateInput: 2
- textarea: 1
- paragraph: 2
- radios: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I am on the personal details page
- **When** I fill in all the required fields with valid information
- **Then** I should be able to navigate to the travel details page without errors
- **Tags:** `visa-application`, `data-entry`, `validation`

#### 2. [MUST] ✅

- **Given** I am on the personal details page
- **When** I leave any required field empty and attempt to submit the form
- **Then** I should see appropriate error messages indicating which fields need to be completed
- **Tags:** `validation`, `error-handling`

#### 3. [MUST] ✅

- **Given** I am on the travel details page
- **When** I fill in all the required fields with valid information
- **Then** I should be redirected to the UK address page
- **Tags:** `visa-application`, `data-entry`

#### 4. [MUST] ✅

- **Given** I am on the financial evidence page
- **When** I select 'yes' for sponsorship and fill in my financial details correctly
- **Then** I should be able to proceed to the next section of the application
- **Tags:** `visa-application`, `financial-evidence`

#### 5. [SHOULD] ✅

- **Given** I am using a screen reader
- **When** I navigate through the application pages
- **Then** I should be able to hear descriptive labels for all form components
- **Tags:** `accessibility`, `compliance`

#### 6. [SHOULD] ✅

- **Given** I have filled the forms with required data
- **When** I attempt to navigate back to any previous page
- **Then** I should be prompted to save my progress before leaving the page
- **Tags:** `data-entry`, `navigation-flow`

### Test Scenarios

#### 1. Successful Navigation from Personal Details to Travel Details [high]

**ID:** `TS1`
**Description:** Validate user can navigate to travel details page after entering correct data

**Steps:**

1. Open personal details page
2. Enter valid first name
3. Enter valid last name
4. Enter valid date of birth
5. Enter valid nationality
6. Enter valid passport number
7. Click 'Next'

**Expected Result:** User is navigated to the travel details page without errors

**Pages:** `personal-details`, `travel-details`
**Components:** `textInput`, `dateInput`
**Tags:** `navigation`, `success`

#### 2. Validation Error Handling on Required Fields [critical]

**ID:** `TS2`
**Description:** Ensure that leaving required fields empty throws appropriate error messages

**Steps:**

1. Open personal details page
2. Leave first name empty
3. Leave last name empty
4. Click 'Next'

**Expected Result:** An error message indicates 'First name is required' and 'Last name is required' should be displayed

**Pages:** `personal-details`
**Components:** `textInput`
**Tags:** `validation`, `error-handling`

#### 3. Accessibility Check for Screen Reader [medium]

**ID:** `TS3`
**Description:** Ensure the application is accessible with screen reader software

**Steps:**

1. Open personal details page using a screen reader
2. Navigate through the fields

**Expected Result:** Field labels and hints are read correctly by the screen reader

**Pages:** `personal-details`, `travel-details`, `uk-address`, `financial-evidence`
**Components:** `textInput`, `dateInput`, `textarea`
**Tags:** `accessibility`, `compliance`

#### 4. Navigating Back after Filling Forms [medium]

**ID:** `TS4`
**Description:** Verify that the user is prompted to save data when trying to navigate back

**Steps:**

1. Fill in all required fields on personal details page
2. Click 'Back' button

**Expected Result:** User is prompted with a message to save their progress before leaving the page

**Pages:** `personal-details`
**Components:** `button`
**Tags:** `navigation-flow`, `data-entry`

#### 5. Sponsorship Selection leading to Financial Details page [high]

**ID:** `TS5`
**Description:** Check that selecting 'Yes' for sponsorship allows proceeding

**Steps:**

1. Open financial evidence page
2. Select 'Yes' on sponsorship
3. Fill in financial details
4. Click 'Next'

**Expected Result:** User is taken to the next section of the application after successful submission

**Pages:** `financial-evidence`
**Components:** `radios`, `textInput`
**Tags:** `financial-evidence`, `data-entry`

---

## Story 3: User story for applying for a UK visa - Selection and Financial Evidence

**ID:** `visa-apply-selection-1763731454770`
**Complexity:** medium
**Tags:** `visa-apply`, `user-journey`, `accessibility`, `validation`, `GOV.UK compliance`

### User Story

> **As a** User applying for a UK visa
> **I want** to select the type of visa I need and provide my financial evidence
> **So that** I can proceed with my visa application confidently and correctly

**Description:**

As an applicant for a UK visa, I want to easily select the visa type that suits my needs and provide accurate financial evidence, ensuring that I'm compliant with application requirements and can navigate the process smoothly.

**Pages:** `visa-type`, `financial-evidence`

**Components:**

- radios: 2
- paragraph: 1
- textInput: 2

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** the user is on the visa type selection page
- **When** the user selects a visa type and submits the form
- **Then** the system should navigate to the financial evidence page with the selected visa type saved
- **Tags:** `visa-apply`, `selection`, `usability`, `accessibility`

#### 2. [MUST] ✅

- **Given** the user is on the financial evidence page
- **When** the user tries to submit without providing required financial information
- **Then** the system should display validation errors indicating which fields are mandatory
- **Tags:** `visa-apply`, `validation`, `error-handling`

#### 3. [MUST] ✅

- **Given** the user has filled in the financial evidence form with values
- **When** the user submits the form with all required fields filled
- **Then** the system should accept the submission and navigate to the next step in the application process
- **Tags:** `visa-apply`, `success`, `navigation`

#### 4. [SHOULD] ✅

- **Given** the user selects 'Yes' for sponsorship on the financial evidence page
- **When** the user submits the form
- **Then** the system should provide a clear indication of next steps related to sponsorship
- **Tags:** `visa-apply`, `sponsorship`, `info`

#### 5. [MUST] ✅

- **Given** the user is using assistive technology, such as a screen reader
- **When** the user navigates the visa type and financial evidence pages
- **Then** all form elements must be properly labeled and described for accessibility
- **Tags:** `visa-apply`, `accessibility`, `GOV.UK compliance`

### Test Scenarios

#### 1. Select Visa Type [high]

**ID:** `TS001`
**Description:** User selects a visa type and proceeds to financial evidence

**Steps:**

1. Navigate to the visa type page
2. Select 'Skilled Worker visa'
3. Click 'Continue'

**Expected Result:** User is navigated to the financial evidence page with 'Skilled Worker visa' stored

**Pages:** `visa-type`, `financial-evidence`
**Components:** `radios`
**Tags:** `visa-apply`, `selection`

#### 2. Submit Financial Evidence with Missing Fields [critical]

**ID:** `TS002`
**Description:** User attempts to submit the financial evidence form without filling mandatory fields

**Steps:**

1. Navigate to the financial evidence page
2. Leave all fields blank
3. Click 'Submit'

**Expected Result:** Validation errors are displayed for each required field

**Pages:** `financial-evidence`
**Components:** `textInput`, `radios`
**Tags:** `visa-apply`, `validation`

#### 3. Complete Financial Evidence Form and Submit [high]

**ID:** `TS003`
**Description:** User fills out the financial evidence form correctly and submits

**Steps:**

1. Navigate to the financial evidence page
2. Fill in 'Your monthly income' with '2500'
3. Fill in 'Your savings' with '5000'
4. Select 'No' for sponsorship
5. Click 'Submit'

**Expected Result:** User is successfully navigated to the next step in the application

**Pages:** `financial-evidence`
**Components:** `textInput`, `radios`
**Tags:** `visa-apply`, `success`

---

## Story 4: Confirmation Page for Visa Application

**ID:** `visa-apply-completion-1763731473669`
**Complexity:** simple
**Tags:** `visa`, `government services`, `confirmation`, `GOV.UK Design System`

### User Story

> **As a** Visa Applicant
> **I want** to receive a clear confirmation of my submitted visa application
> **So that** I can understand the next steps I need to take and feel reassured that my application is in process.

**Description:**

After completing my visa application, I want to reach a confirmation page that clearly outlines my application's status and the subsequent actions I need to take. This page should summarize key information, provide important warnings, and allow me to navigate to payment options easily.

**Pages:** `confirmation`

**Components:**

- panel: 1
- heading: 2
- paragraph: 3
- list: 1
- warningText: 1
- button: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I have successfully submitted my visa application
- **When** I reach the confirmation page
- **Then** I should see a panel with my application reference number, titled 'Application submitted' and the content related to my application status is visible.
- **Tags:** `confirmation`, `visa`, `application`

#### 2. [MUST] ✅

- **Given** I am on the confirmation page
- **When** I look for the next steps
- **Then** I should see a section titled 'What happens next' with a clear list of subsequent actions I must take.
- **Tags:** `next steps`, `visa`, `application`

#### 3. [MUST] ✅

- **Given** I am viewing the confirmation page
- **When** I check for processing time information
- **Then** I should see a heading titled 'Processing time' along with the details about usual decision timelines and options for expedited processing.
- **Tags:** `processing`, `information`, `visa`

#### 4. [MUST] ✅

- **Given** I have completed the visa application
- **When** I look for payment options on the confirmation page
- **Then** I should see a button labeled 'Pay visa fee' that is clearly visible and functional.
- **Tags:** `payment`, `visa`, `button`

#### 5. [SHOULD] ✅

- **Given** I am on the confirmation page
- **When** I view the page
- **Then** I should not see any error messages and all content should be displayed without any accessibility issues.
- **Tags:** `accessibility`, `error handling`, `UI`

#### 6. [SHOULD] ✅

- **Given** I have recently submitted my application
- **When** I check my inbox for an email
- **Then** I should receive a confirmation email containing my application reference number.
- **Tags:** `email confirmation`, `visa`, `application`

### Test Scenarios

#### 1. Display confirmation message [high]

**ID:** `TS-01`
**Description:** Verify that the confirmation panel shows the submitted application reference number.

**Steps:**

1. Submit the visa application
2. Navigate to the confirmation page

**Expected Result:** The confirmation panel displays the application reference number clearly.

**Pages:** `confirmation-page`
**Components:** `panel`
**Tags:** `UI`, `confirmation`

#### 2. Check next steps section [high]

**ID:** `TS-02`
**Description:** Validate that the 'What happens next' section outlines the required actions post-application submission.

**Steps:**

1. Visit the confirmation page

**Expected Result:** The section lists all necessary next steps clearly in numbered format.

**Pages:** `confirmation-page`
**Components:** `heading`, `paragraph`, `list`
**Tags:** `next steps`, `UI`

#### 3. Verify payment button accessibility [high]

**ID:** `TS-03`
**Description:** Ensure the 'Pay visa fee' button is accessible and functional.

**Steps:**

1. Load the confirmation page
2. Attempt to click the 'Pay visa fee' button

**Expected Result:** The button is responsive and leads to the visa fee payment page.

**Pages:** `confirmation-page`
**Components:** `button`
**Tags:** `payment`, `accessibility`

#### 4. Display processing time information [medium]

**ID:** `TS-04`
**Description:** Confirm the page accurately presents the processing time for visa applications.

**Steps:**

1. Access the confirmation page

**Expected Result:** The processing time section shows the expected timelines and the faster payment option.

**Pages:** `confirmation-page`
**Components:** `heading`, `paragraph`
**Tags:** `processing`, `information`

---
