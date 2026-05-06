package com.carloan.e2e.steps;

import com.carloan.e2e.context.ScenarioContext;
import com.carloan.e2e.pages.ApplyPage;
import com.carloan.e2e.pages.TrackPage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TrackPageSteps {

    private final ScenarioContext context;
    private TrackPage trackPage;

    public TrackPageSteps(ScenarioContext context) {
        this.context = context;
    }

    @Given("I have submitted a loan application")
    public void iHaveSubmittedALoanApplication() {
        ApplyPage applyPage = new ApplyPage(context.getDriver());
        applyPage.open(context.getBaseUrl());
        applyPage.fillPersonalInfo("Jane", "Smith", "jane@example.com", "9876543210", "1990-06-15");
        applyPage.clickContinue();
        applyPage.fillFinancialInfo("EMPLOYED", "70000");
        applyPage.clickContinue();
        applyPage.fillVehicleAndLoanDetails("Toyota", "Camry", "2023", "25000", "5000", "20000", "60");
        applyPage.clickSubmit();
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(15));
        wait.until(d -> applyPage.isSuccessVisible());
        context.setTrackingId(applyPage.getTrackingId());
    }

    @Given("I am on the track page")
    public void iAmOnTheTrackPage() {
        trackPage = new TrackPage(context.getDriver());
        trackPage.open(context.getBaseUrl());
    }

    @When("I enter my tracking ID and click Track")
    public void iEnterMyTrackingIdAndClickTrack() {
        trackPage.enterTrackingId(context.getTrackingId());
        trackPage.clickTrack();
    }

    @When("I enter tracking ID {string} and click Track")
    public void iEnterTrackingIdAndClickTrack(String trackingId) {
        trackPage.enterTrackingId(trackingId);
        trackPage.clickTrack();
    }

    @Then("I should see the applicant name {string}")
    public void iShouldSeeTheApplicantName(String name) {
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(10));
        wait.until(d -> trackPage.areDetailsVisible());
        assertTrue(trackPage.isApplicantNameVisible(name),
                "Expected to see applicant name: " + name);
    }

    @And("I should see the status {string}")
    public void iShouldSeeTheStatus(String status) {
        assertTrue(trackPage.isStatusVisible(status),
                "Expected to see status badge: " + status);
    }

    @Then("I should see an error message")
    public void iShouldSeeAnErrorMessage() {
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(10));
        wait.until(d -> trackPage.isErrorVisible());
        assertTrue(trackPage.isErrorVisible(), "Expected an error message to be visible");
    }
}
