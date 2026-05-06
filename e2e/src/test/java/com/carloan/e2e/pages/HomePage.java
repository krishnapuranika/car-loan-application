package com.carloan.e2e.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class HomePage extends BasePage {

    private static final By APPLY_CARD   = By.cssSelector("a[href='/apply']");
    private static final By TRACK_CARD   = By.cssSelector("a[href='/track']");
    private static final By PAGE_HEADING = By.tagName("h1");

    public HomePage(WebDriver driver) {
        super(driver);
    }

    public void open(String baseUrl) {
        driver.get(baseUrl + "/");
        waitForVisible(PAGE_HEADING);
    }

    public String getHeadingText() {
        return getText(PAGE_HEADING);
    }

    public boolean isApplyCardVisible() {
        return !driver.findElements(APPLY_CARD).isEmpty();
    }

    public boolean isTrackCardVisible() {
        return !driver.findElements(TRACK_CARD).isEmpty();
    }

    public void clickApplyCard() {
        click(APPLY_CARD);
    }

    public void clickTrackCard() {
        click(TRACK_CARD);
    }
}
