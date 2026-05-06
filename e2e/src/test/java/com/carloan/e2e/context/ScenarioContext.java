package com.carloan.e2e.context;

import org.openqa.selenium.WebDriver;

public class ScenarioContext {

    private WebDriver driver;
    private String trackingId;
    private final String baseUrl = System.getProperty("base.url", "http://localhost:5173");

    public WebDriver getDriver() {
        return driver;
    }

    public void setDriver(WebDriver driver) {
        this.driver = driver;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public String getBaseUrl() {
        return baseUrl;
    }
}
