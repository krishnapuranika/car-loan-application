Feature: Track a Loan Application
  As a customer
  I want to track the status of my loan application
  So that I know where it stands in the review process

  Scenario: Track a previously submitted application
    Given I have submitted a loan application
    And I am on the track page
    When I enter my tracking ID and click Track
    Then I should see the applicant name "Jane Smith"
    And I should see the status "Submitted"

  Scenario: Error shown for an unknown tracking ID
    Given I am on the track page
    When I enter tracking ID "CAR-NOTEXIST" and click Track
    Then I should see an error message
