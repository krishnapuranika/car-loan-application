Feature: Home Page Navigation
  As a visitor
  I want to see the home page and navigate to key actions
  So that I can start or track a loan application

  Scenario: Home page displays both action cards
    Given I am on the home page
    Then I should see the heading "Drive Your Dreams"
    And I should see an "Apply for a Loan" card
    And I should see a "Track Your Application" card

  Scenario: Navigate to the Apply page from the home page
    Given I am on the home page
    When I click the "Apply for a Loan" card
    Then I should be on the apply page
    And I should see the heading "Apply for a Car Loan"

  Scenario: Navigate to the Track page from the home page
    Given I am on the home page
    When I click the "Track Your Application" card
    Then I should be on the track page
    And I should see the heading "Track Your Application"
