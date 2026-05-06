package com.carloan.e2e.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class TrackPage extends BasePage {

    private static final By TRACKING_INPUT = By.cssSelector("input[placeholder='CAR-XXXXXXXX']");
    private static final By TRACK_BTN      = By.xpath("//button[text()='Track']");
    private static final By STATUS_BADGE   = By.cssSelector("span.rounded-full");
    private static final By ERROR_MESSAGE  = By.cssSelector("div.bg-red-50");
    private static final By DETAILS_SECTION = By.cssSelector("dl");

    public TrackPage(WebDriver driver) {
        super(driver);
    }

    public void open(String baseUrl) {
        driver.get(baseUrl + "/track");
        waitForVisible(By.tagName("h1"));
    }

    public String getHeadingText() {
        return getText(By.tagName("h1"));
    }

    public void enterTrackingId(String trackingId) {
        clearAndType(TRACKING_INPUT, trackingId);
    }

    public void clickTrack() {
        click(TRACK_BTN);
    }

    public boolean isErrorVisible() {
        return !driver.findElements(ERROR_MESSAGE).isEmpty();
    }

    public boolean isApplicantNameVisible(String name) {
        return isTextPresent(name);
    }

    public boolean isStatusVisible(String status) {
        return !driver.findElements(By.xpath("//span[contains(@class,'rounded-full') and contains(text(),'" + status + "')]")).isEmpty();
    }

    public boolean areDetailsVisible() {
        return !driver.findElements(DETAILS_SECTION).isEmpty();
    }
}
