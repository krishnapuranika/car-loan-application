package com.carloan.e2e.steps;

import com.carloan.e2e.context.ScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class CommonSteps {

    private final ScenarioContext context;

    public CommonSteps(ScenarioContext context) {
        this.context = context;
    }

    @Then("I should see the heading {string}")
    public void iShouldSeeTheHeading(String text) {
        By locator = By.xpath("//*[contains(text(),'" + text + "')]");
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(10));
        wait.until(d -> !d.findElements(locator).isEmpty());
        assertTrue(!context.getDriver().findElements(locator).isEmpty(),
                "Expected to see heading containing: " + text);
    }

    @Then("I should see {string}")
    public void iShouldSee(String text) {
        By locator = By.xpath("//*[contains(text(),'" + text + "')]");
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(10));
        wait.until(d -> !d.findElements(locator).isEmpty());
        assertTrue(!context.getDriver().findElements(locator).isEmpty(),
                "Expected to see text: " + text);
    }

    @Then("I should be on the apply page")
    public void iShouldBeOnTheApplyPage() {
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(10));
        wait.until(d -> d.getCurrentUrl().contains("/apply"));
        assertTrue(context.getDriver().getCurrentUrl().contains("/apply"),
                "Expected URL to contain /apply, but was: " + context.getDriver().getCurrentUrl());
    }

    @Then("I should be on the track page")
    public void iShouldBeOnTheTrackPage() {
        WebDriverWait wait = new WebDriverWait(context.getDriver(), Duration.ofSeconds(10));
        wait.until(d -> d.getCurrentUrl().contains("/track"));
        assertTrue(context.getDriver().getCurrentUrl().contains("/track"),
                "Expected URL to contain /track, but was: " + context.getDriver().getCurrentUrl());
    }
}
