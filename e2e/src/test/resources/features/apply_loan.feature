Feature: Apply for a Car Loan
  As a customer
  I want to complete the loan application form
  So that I can receive a tracking ID for my application

  Scenario: Successfully submit a complete loan application
    Given I am on the apply page
    When I fill in personal information with first name "Jane", last name "Smith", email "jane@example.com", phone "9876543210" and date of birth "1990-06-15"
    And I click "Continue"
    Then I should see "Financial Information"
    When I select employment status "EMPLOYED" and enter annual income "70000"
    And I click "Continue"
    Then I should see "Vehicle & Loan Details"
    When I fill in vehicle make "Toyota", model "Camry", year "2023", price "25000", down payment "5000", loan amount "20000" and term "60"
    And I submit the application
    Then I should see "Application Submitted!"
    And I should see a tracking ID starting with "CAR-"

  Scenario: Validation errors appear when continuing with empty step 1 fields
    Given I am on the apply page
    When I click "Continue" without filling any fields
    Then I should see at least one validation error
