# User Stories: Apply for a passport

**Generated:** 11/21/2025, 1:17:40 PM
**Journey ID:** `passport-apply`

## Summary

- **Total Pages:** 6
- **Total Components:** 27
- **User Stories:** 5
- **Acceptance Criteria:** 30
- **Test Scenarios:** 21

### Complexity Breakdown

- **medium:** 5 stories

### Component Coverage

- **textInput:** 12
- **paragraph:** 6
- **heading:** 5
- **summaryList:** 3
- **insetText:** 2
- **dateInput:** 2
- **radios:** 2
- **panel:** 1

---

## Story 1: Apply for a Passport

**ID:** `passport-apply-journey-start-1763730994665`
**Complexity:** medium
**Tags:** `passport-apply`, `government-service`, `user-experience`, `GOV.UK development`

### User Story

> **As a** User
> **I want** to start my passport application process online
> **So that** I can easily apply for, renew, replace, or update my passport from home.

**Description:**

This user story describes the initial interaction and the information required from users to begin the passport application process. The aim is to ensure it is clear, accessible, and compliant with relevant design standards.

**Pages:** `start`, `personal-details`

**Components:**

- paragraph: 2
- heading: 1
- insetText: 1
- textInput: 2
- dateInput: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** the user is on the 'Start' page of the Apply for a passport journey
- **When** the user sees the paragraph explaining the service
- **Then** the text should inform them about applying, renewing, replacing, or updating a passport and highlight that they can pay online.
- **Tags:** `journey-start`, `passport-apply`, `GOV.UK compliance`

#### 2. [MUST] ✅

- **Given** the user is on the 'Start' page
- **When** the user reads the heading 'What you need'
- **Then** the heading should be clearly visible and structured properly as a level 2 heading.
- **Tags:** `journey-start`, `GOV.UK compliance`

#### 3. [MUST] ✅

- **Given** the user is on the 'personal-details' page
- **When** the user views the input fields
- **Then** there should be input fields for first name, last name and date of birth, each properly labelled for accessibility.
- **Tags:** `passport-apply`, `accessibility`, `form-validation`

#### 4. [MUST] ✅

- **Given** the user has entered their first name
- **When** the user submits the form without entering their last name or date of birth
- **Then** the system should display an error message indicating that last name and date of birth are required.
- **Tags:** `form-validation`, `error-handling`

#### 5. [SHOULD] ✅

- **Given** the user is on the 'personal-details' page
- **When** the user inputs invalid data in the date of birth field
- **Then** the system should notify the user of the invalid format and guide them on how to correct it.
- **Tags:** `form-validation`, `error-handling`

#### 6. [MUST] ✅

- **Given** the user is on the 'Start' page
- **When** the user clicks on the 'Apply' button
- **Then** the user should be directed to the 'personal-details' page without error.
- **Tags:** `navigation-flow`, `passport-apply`

### Test Scenarios

#### 1. Verify start page loads correctly [high]

**ID:** `TS1`
**Description:** Check that the start page contains the required informational text and heading.

**Steps:**

1. Open the Apply for a passport start page
2. Verify the service usage explanation paragraph is visible
3. Verify the 'What you need' heading appears as first level h2

**Expected Result:** All specified elements are rendered correctly on the page

**Pages:** `start`
**Components:** `paragraph`, `heading`
**Tags:** `passport-apply`, `journey-start`

#### 2. Form validation on personal details [critical]

**ID:** `TS2`
**Description:** Ensure that the form provides validation when required fields are left empty.

**Steps:**

1. Navigate to the personal details page
2. Leave first name, last name, and date of birth fields empty
3. Submit the form

**Expected Result:** Error messages are displayed for each required field indicating they cannot be empty

**Pages:** `personal-details`
**Components:** `textInput`, `dateInput`
**Tags:** `form-validation`, `error-handling`

#### 3. Navigate to personal details page [high]

**ID:** `TS3`
**Description:** Verify navigation from start page to personal details page.

**Steps:**

1. Open the start page
2. Click on the 'Apply' button

**Expected Result:** User is redirected to the personal-details page.

**Pages:** `start`, `personal-details`
**Components:** `button`
**Tags:** `navigation-flow`

#### 4. Verify accessible labels for input fields [medium]

**ID:** `TS4`
**Description:** Check that all input fields have correct accessible labels with autocomplete attributes.

**Steps:**

1. Open the personal details page
2. Inspect the first name, last name, and date of birth fields

**Expected Result:** Input fields have visible labels and appropriate autocomplete attributes

**Pages:** `personal-details`
**Components:** `textInput`, `dateInput`
**Tags:** `accessibility`

---

## Story 2: Apply for Passport - Personal and Contact Details Submission

**ID:** `passport-apply-data-entry-1763731010840`
**Complexity:** medium
**Tags:** `passport-application`, `data-entry`, `user-experience`, `validation`

### User Story

> **As a** citizen applying for a passport
> **I want** to enter my personal, contact, and address details on the passport application form
> **So that** I can complete my application and ensure all my details are correctly recorded for processing

**Description:**

This user story captures the process of entering personal and contact data for a passport application. It ensures accessibility and compliance with the GOV.UK Design System while validating the input fields to enhance the user experience.

**Pages:** `personal-details`, `contact-details`, `address`

**Components:**

- textInput: 8
- dateInput: 1
- radios: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I am on the personal details page of the passport application
- **When** I submit the form with valid first name, last name, and date of birth
- **Then** the application should proceed to the contact details page
- **Tags:** `data-entry`, `passport-application`, `validation`

#### 2. [MUST] ✅

- **Given** I am on the contact details page of the passport application
- **When** I leave the email or phone fields empty and attempt to submit the form
- **Then** I should see an error message indicating that these fields are required and cannot be left blank
- **Tags:** `data-entry`, `passport-application`, `validation`

#### 3. [MUST] ✅

- **Given** I have filled in all required personal, contact, and address details correctly
- **When** I click the 'Continue' button to proceed to the next page
- **Then** I should navigate to the review page without any validation errors
- **Tags:** `data-entry`, `passport-application`, `navigation`

#### 4. [SHOULD] ✅

- **Given** I am on the address details page
- **When** I enter an invalid postcode and submit the form
- **Then** I should see an error message stating the postcode format is invalid
- **Tags:** `data-entry`, `passport-application`, `validation`

#### 5. [MUST] ✅

- **Given** I filled in the 'Contact Preference' options
- **When** I submit the form without selecting a preference
- **Then** I receive a prompt indicating a selection must be made before continuing
- **Tags:** `data-entry`, `passport-application`, `validation`

### Test Scenarios

#### 1. Submit valid personal details [high]

**ID:** `TS_001`
**Description:** Ensure that valid personal details allow progress to the next page

**Steps:**

1. Navigate to the personal details page
2. Enter valid first name
3. Enter valid last name
4. Enter valid date of birth
5. Click continue

**Expected Result:** User should be directed to the contact details page

**Pages:** `personal-details`
**Components:** `textInput`, `dateInput`
**Tags:** `automation`, `valid-input`

#### 2. Check error message for empty required fields [critical]

**ID:** `TS_002`
**Description:** Ensure that submitting empty required fields shows appropriate error messages

**Steps:**

1. Navigate to the personal details page
2. Leave all fields empty
3. Click continue

**Expected Result:** Displays error messages for all mandatory fields

**Pages:** `personal-details`
**Components:** `textInput`, `dateInput`
**Tags:** `automation`, `validation`

#### 3. Test navigation from contact to address page [high]

**ID:** `TS_003`
**Description:** Check that entering all contact details proceeds to the address page

**Steps:**

1. Navigate to the contact details page
2. Fill out email and phone fields
3. Select contact preference
4. Click continue

**Expected Result:** User is taken to the address details page

**Pages:** `contact-details`
**Components:** `textInput`, `radios`
**Tags:** `automation`, `valid-navigation`

#### 4. Test postcode validation [medium]

**ID:** `TS_004`
**Description:** Check for validation error when entering an invalid postcode

**Steps:**

1. Navigate to the address details page
2. Enter valid address fields but invalid postcode
3. Click continue

**Expected Result:** Displays error message regarding postcode format

**Pages:** `address`
**Components:** `textInput`
**Tags:** `automation`, `validation`

---

## Story 3: Contact Details Submission for Passport Application

**ID:** `passport-apply-selection-1763731027654`
**Complexity:** medium
**Tags:** `passport`, `application`, `contact-details`, `government`, `GOV.UK`, `accessibility`

### User Story

> **As a** citizen applying for a passport
> **I want** to provide my contact details including email, phone number, and preferred contact method
> **So that** I can be updated about the status of my passport application effectively.

**Description:**

This user story captures the requirement for the contact details page of the passport application journey, ensuring that users can input their contact information in an accessible way while complying with validation rules to ensure completeness and accuracy of information provided.

**Pages:** `contact-details`

**Components:**

- textInput: 2
- radios: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** the contact details page is loaded
- **When** I see the email input
- **Then** I should see a label 'Email address' next to the input field with a hint stating 'We will use this to send you updates about your application'
- **Tags:** `accessibility`, `validation`, `UI`

#### 2. [MUST] ✅

- **Given** I have not entered my email
- **When** I submit the form
- **Then** I should receive an error message stating 'Email address is required'
- **Tags:** `error handling`, `validation`

#### 3. [MUST] ✅

- **Given** I have entered an invalid email format
- **When** I submit the form
- **Then** I should receive an error message indicating 'Please enter a valid email address'
- **Tags:** `error handling`, `validation`

#### 4. [MUST] ✅

- **Given** I have not entered my phone number
- **When** I submit the form
- **Then** I should see an error message stating 'Phone number is required'
- **Tags:** `error handling`, `validation`

#### 5. [MUST] ✅

- **Given** I have not selected a preferred contact method
- **When** I submit the form
- **Then** I should see an error message stating 'Please select a contact preference'
- **Tags:** `error handling`, `validation`

#### 6. [MUST] ✅

- **Given** I have filled out all fields correctly
- **When** I click the submit button
- **Then** I should be redirected to the next step in the passport application process
- **Tags:** `navigation`, `validation`

#### 7. [SHOULD] ✅

- **Given** I have entered my contact details
- **When** I focus on the email input field and use a screen reader
- **Then** the screen reader should announce the field label and hint
- **Tags:** `accessibility`

### Test Scenarios

#### 1. Submit contact details with missing email [critical]

**ID:** `TC1`
**Description:** Test handling of missing email when submitting the form.

**Steps:**

1. Navigate to the contact details page
2. Leave the email field empty
3. Fill in the phone number and select a contact preference
4. Submit the form

**Expected Result:** An error message stating 'Email address is required' should be displayed.

**Pages:** `contact-steps`
**Components:** `textInput`, `radios`
**Tags:** `error handling`

#### 2. Submit contact details with invalid email [high]

**ID:** `TC2`
**Description:** Test handling of invalid email format.

**Steps:**

1. Navigate to the contact details page
2. Enter an invalid email format
3. Fill in the phone number
4. Select a contact preference
5. Submit the form

**Expected Result:** An error message indicating 'Please enter a valid email address' should be displayed.

**Pages:** `contact-steps`
**Components:** `textInput`, `radios`
**Tags:** `error handling`

#### 3. Submit contact details with all fields correctly filled [critical]

**ID:** `TC3`
**Description:** Test successful submission of contact details.

**Steps:**

1. Navigate to the contact details page
2. Enter a valid email address
3. Enter a valid phone number
4. Select a contact preference
5. Submit the form

**Expected Result:** The user should be redirected to the next step in the application process.

**Pages:** `contact-steps`
**Components:** `textInput`, `radios`
**Tags:** `navigation`

#### 4. Screen reader accessibility test [high]

**ID:** `TC4`
**Description:** Test if accessible support is in place for screen readers.

**Steps:**

1. Navigate to the contact details page
2. Use a screen reader to review form fields

**Expected Result:** The screen reader should announce labels and hints correctly for email and phone inputs.

**Pages:** `contact-steps`
**Components:** `textInput`, `radios`
**Tags:** `accessibility`

---

## Story 4: Check Answers Before Passport Application Submission

**ID:** `passport-apply-review-1763731047063`
**Complexity:** medium
**Tags:** `passport`, `review`, `GOV.UK`, `digital services`, `accessibility`

### User Story

> **As a** passport applicant
> **I want** to review my application details before submitting
> **So that** I can ensure all information is correct and avoid errors in my passport application.

**Description:**

As part of the 'Apply for a passport' journey, I need a Review page where I can check all personal, contact, and address details before I submit my application. This will help me confirm the accuracy of my information and ensure that my application is processed without issues.

**Pages:** `check-answers`

**Components:**

- heading: 2
- summaryList: 3
- paragraph: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I am on the 'Check your answers' page
- **When** the page loads
- **Then** I should see a heading that says 'Check your answers before submitting your application' and it should be formatted correctly as an H1
- **Tags:** `accessibility`, `ui`, `navigation`

#### 2. [MUST] ✅

- **Given** I am on the 'Check your answers' page
- **When** the personal details section is displayed
- **Then** I should see my first name, last name, and date of birth listed in a summary list format with correct labels
- **Tags:** `form`, `validation`, `display`

#### 3. [MUST] ✅

- **Given** I have filled out my contact details
- **When** I am on the 'Check your answers' page
- **Then** I should see my email address, phone number, and contact preference in a summary list format
- **Tags:** `form`, `validation`, `display`

#### 4. [MUST] ✅

- **Given** I have provided my address
- **When** I am on the 'Check your answers' page
- **Then** I should see my full address formatted correctly in a summary list
- **Tags:** `form`, `validation`, `display`

#### 5. [MUST] ✅

- **Given** I have reviewed my answers
- **When** I click the submit button
- **Then** I should see a confirmation message stating that I am confirming the accuracy of my information, and the application should submit successfully
- **Tags:** `navigation`, `submission`

#### 6. [SHOULD] ✅

- **Given** I am on the 'Check your answers' page
- **When** any details are incorrect
- **Then** I should be able to navigate back to the respective sections to correct my information
- **Tags:** `navigation`, `error handling`

#### 7. [MUST] ✅

- **Given** All fields are populated correctly
- **When** I attempt to submit the application
- **Then** I should not receive any validation errors as I submit
- **Tags:** `validation`, `submission`

### Test Scenarios

#### 1. Verify presence and accessibility of headings [high]

**ID:** `TS1`
**Description:** Ensure that the headings on the page are present and accessible with appropriate semantics

**Steps:**

1. Open the 'Check your answers' page
2. Check if the main heading is present
3. Check if the heading structure follows the GOV.UK Design System

**Expected Result:** The main heading 'Check your answers before submitting your application' should be accessible and correctly tagged as H1

**Pages:** `passport-apply-check-answers`
**Components:** `heading`, `summaryList`
**Tags:** `accessibility`, `ui`

#### 2. Validate summary list displays correct information [critical]

**ID:** `TS2`
**Description:** Ensure that all sections in the summary list display the details entered by the user.

**Steps:**

1. Open the 'Check your answers' page
2. Check all personal details in the summary list
3. Check all contact details in the summary list
4. Check address details are formatted correctly

**Expected Result:** Each section in the summary list should display the correct user-entered information.

**Pages:** `passport-apply-check-answers`
**Components:** `summaryList`
**Tags:** `validation`, `ui`

#### 3. Test form submission functionality [high]

**ID:** `TS3`
**Description:** Validate that the application is submitted when all details are confirmed as correct

**Steps:**

1. Open the 'Check your answers' page
2. Validate that all information is displayed correctly
3. Click the submit button

**Expected Result:** The application submits successfully and goes to the submission confirmation page.

**Pages:** `passport-apply-check-answers`
**Components:** `button`, `form`
**Tags:** `submission`, `navigation`

#### 4. Check navigation to correct sections [medium]

**ID:** `TS4`
**Description:** Ensure navigation works correctly to return to sections for correcting information.

**Steps:**

1. Open the 'Check your answers' page
2. Identify an incorrect field in the summary list
3. Navigate back to the relevant section to edit details

**Expected Result:** Navigation should direct the user to the correct section without loss of data.

**Pages:** `passport-apply-check-answers`
**Components:** `link`
**Tags:** `navigation`, `error handling`

#### 5. Confirm error handling for incorrect submission [high]

**ID:** `TS5`
**Description:** Validate error messages when details are filled incorrectly before submission.

**Steps:**

1. Open the 'Check your answers' page
2. Modify one of the fields with an invalid value
3. Attempt to submit the application

**Expected Result:** An error message should indicate that the application cannot be submitted until all details are correct.

**Pages:** `passport-apply-check-answers`
**Components:** `form`
**Tags:** `validation`, `error handling`

---

## Story 5: Passport Application Confirmation Page

**ID:** `passport-apply-completion-1763731060808`
**Complexity:** medium
**Tags:** `passport`, `user journey`, `confirmation`

### User Story

> **As a** passport applicant
> **I want** to see a confirmation of my passport application submission
> **So that** I can have assurance that my application has been received and know what to expect next

**Description:**

As an applicant for a passport, I need to receive a confirmation that my application has been successfully submitted so I can trust that I will receive my passport in a timely manner, and to understand the next steps I need to follow.

**Pages:** `confirmation`

**Components:**

- panel: 1
- heading: 2
- paragraph: 3
- insetText: 1

### Acceptance Criteria

#### 1. [MUST] ✅

- **Given** I have successfully submitted my passport application
- **When** I am on the confirmation page
- **Then** I should see a panel with the title 'Application submitted' and my reference number is displayed,
- **Tags:** `confirmation`, `application`, `passport`

#### 2. [MUST] ✅

- **Given** I am on the confirmation page
- **When** the confirmation email is sent
- **Then** I should see a paragraph stating 'We've sent you a confirmation email.'
- **Tags:** `email`, `notification`

#### 3. [MUST] ✅

- **Given** I am on the confirmation page
- **When** the expected wait time is displayed
- **Then** I should see a paragraph stating 'Your passport should arrive within 3 weeks. We'll send you an email if we need any more information.'
- **Tags:** `wait time`, `application guidance`

#### 4. [MUST] ✅

- **Given** I am on the confirmation page
- **When** I want to contact customer support
- **Then** I should see a heading 'If you need to contact us' with instructions on how to do this
- **Tags:** `contact support`, `user assistance`

#### 5. [MUST] ✅

- **Given** I am on the confirmation page
- **When** I need to call customer support
- **Then** I should see the phone number for the Passport Adviceline clearly displayed with operational hours
- **Tags:** `customer service`, `phone support`

### Test Scenarios

#### 1. Confirmation message displayed [high]

**ID:** `TS001`
**Description:** Verify that the confirmation page shows a message that the application has been submitted with the reference number.

**Steps:**

1. Submit a passport application
2. Navigate to the confirmation page
3. Check for the presence of the panel with title 'Application submitted' and a reference number

**Expected Result:** The confirmation panel is displayed with the application reference number

**Pages:** `confirmation`
**Components:** `panel`
**Tags:** `confirmation`, `UI`

#### 2. Confirmation email notification [high]

**ID:** `TS002`
**Description:** Test that the confirmation email statement is present on the confirmation page.

**Steps:**

1. Submit a passport application
2. Navigate to the confirmation page
3. Check for the paragraph that mentions confirmation email

**Expected Result:** The paragraph 'We've sent you a confirmation email.' is displayed

**Pages:** `confirmation`
**Components:** `paragraph`
**Tags:** `email`, `notification`

#### 3. Next steps visibility [high]

**ID:** `TS003`
**Description:** Ensure that the next steps information is visible after application submission.

**Steps:**

1. Submit a passport application
2. Navigate to the confirmation page
3. Check the paragraph about passport delivery time

**Expected Result:** The message explaining the passport delivery timeline is clearly displayed

**Pages:** `confirmation`
**Components:** `paragraph`
**Tags:** `application process`, `guidance`

#### 4. Contact information availability [high]

**ID:** `TS004`
**Description:** Verify that contact information for customer support is present and accessible.

**Steps:**

1. Submit a passport application
2. Navigate to the confirmation page
3. Check for the contact section

**Expected Result:** The contact information section is visible and contains the correct phone number and operational hours

**Pages:** `confirmation`
**Components:** `heading`, `paragraph`, `insetText`
**Tags:** `support`, `contact`

---
