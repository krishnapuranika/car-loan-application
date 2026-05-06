package com.carloan.e2e.steps;

import com.carloan.e2e.context.ScenarioContext;
import com.carloan.e2e.pages.ApplyPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class ApplyPageSteps {

    private final ScenarioContext context;
    private ApplyPage applyPage;

    public ApplyPageSteps(ScenarioContext context) {
        this.context = context;
    }

    @Given("I am on the apply page")
    public void iAmOnTheApplyPage() {
        applyPage = new ApplyPage(context.getDriver());
        applyPage.open(context.getBaseUrl());
    }

    @When("I fill in personal information with first name {string}, last name {string}, email {string}, phone {string} and date of birth {string}")
    public void iFillInPersonalInformation(String firstName, String lastName, String email, String phone, String dob) {
        applyPage.fillPersonalInfo(firstName, lastName, email, phone, dob);
    }

    @When("I select employment status {string} and enter annual income {string}")
    public void iSelectEmploymentStatusAndEnterAnnualIncome(String status, String income) {
        applyPage.fillFinancialInfo(status, income);
    }

    @When("I fill in vehicle make {string}, model {string}, year {string}, price {string}, down payment {string}, loan amount {string} and term {string}")
    public void iFillInVehicleAndLoanDetails(String make, String model, String year,
                                              String price, String downPayment, String loanAmount, String term) {
        applyPage.fillVehicleAndLoanDetails(make, model, year, price, downPayment, loanAmount, term);
    }

    @And("I click {string}")
    public void iClick(String buttonText) {
        if ("Continue".equals(buttonText)) {
            applyPage.clickContinue();
        }
    }

    @When("I click {string} without filling any fields")
    public void iClickWithoutFillingAnyFields(String buttonText) {
        applyPage.clickContinue();
    }

    @And("I submit the application")
    public void iSubmitTheApplication() {
        applyPage.clickSubmit();
    }

    @Then("I should see a tracking ID starting with {string}")
    public void iShouldSeeATrackingIdStartingWith(String prefix) {
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(10));
        wait.until(d -> applyPage.isSuccessVisible());
        String trackingId = applyPage.getTrackingId();
        assertTrue(trackingId.startsWith(prefix),
                "Expected tracking ID to start with " + prefix + " but was: " + trackingId);
        context.setTrackingId(trackingId);
    }

    @Then("I should see at least one validation error")
    public void iShouldSeeAtLeastOneValidationError() {
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(5));
        wait.until(d -> applyPage.hasValidationErrors());
        assertTrue(applyPage.hasValidationErrors(), "Expected at least one validation error");
    }
}
