package com.carloan.e2e.steps;

import com.carloan.e2e.context.ScenarioContext;
import com.carloan.e2e.pages.HomePage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class HomePageSteps {

    private final ScenarioContext context;
    private HomePage homePage;

    public HomePageSteps(ScenarioContext context) {
        this.context = context;
    }

    @Given("I am on the home page")
    public void iAmOnTheHomePage() {
        homePage = new HomePage(context.getDriver());
        homePage.open(context.getBaseUrl());
    }

    @And("I should see an {string} card")
    public void iShouldSeeAnCard(String cardName) {
        if (cardName.equals("Apply for a Loan")) {
            assertTrue(homePage.isApplyCardVisible(), "Apply for a Loan card not visible");
        } else {
            assertTrue(homePage.isTrackCardVisible(), "Track Your Application card not visible");
        }
    }

    @And("I should see a {string} card")
    public void iShouldSeeACard(String cardName) {
        iShouldSeeAnCard(cardName);
    }

    @When("I click the {string} card")
    public void iClickTheCard(String cardName) {
        if (cardName.equals("Apply for a Loan")) {
            homePage.clickApplyCard();
        } else {
            homePage.clickTrackCard();
        }
    }
}
