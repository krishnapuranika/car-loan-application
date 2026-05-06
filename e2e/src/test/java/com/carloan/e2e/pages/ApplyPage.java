package com.carloan.e2e.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.Select;

public class ApplyPage extends BasePage {

    // Step 1
    private static final By FIRST_NAME    = By.cssSelector("input[placeholder='John']");
    private static final By LAST_NAME     = By.cssSelector("input[placeholder='Doe']");
    private static final By EMAIL         = By.cssSelector("input[placeholder='john@example.com']");
    private static final By PHONE         = By.cssSelector("input[placeholder='1234567890']");
    private static final By DATE_OF_BIRTH = By.cssSelector("input[type='date']");

    // Step 2
    private static final By EMPLOYMENT_STATUS = By.cssSelector("select[name='employmentStatus']");
    private static final By ANNUAL_INCOME     = By.cssSelector("input[placeholder='60000']");

    // Step 3
    private static final By VEHICLE_MAKE  = By.cssSelector("input[name='vehicleMake']");
    private static final By VEHICLE_MODEL = By.cssSelector("input[name='vehicleModel']");
    private static final By VEHICLE_YEAR  = By.cssSelector("input[name='vehicleYear']");
    private static final By VEHICLE_PRICE = By.cssSelector("input[name='vehiclePrice']");
    private static final By DOWN_PAYMENT  = By.cssSelector("input[name='downPayment']");
    private static final By LOAN_AMOUNT   = By.cssSelector("input[name='loanAmount']");
    private static final By LOAN_TERM     = By.cssSelector("select[name='loanTermMonths']");

    // Buttons
    private static final By CONTINUE_BTN = By.xpath("//button[text()='Continue']");
    private static final By SUBMIT_BTN   = By.xpath("//button[text()='Submit Application']");

    // Success state
    private static final By SUCCESS_HEADING = By.xpath("//h2[contains(text(),'Application Submitted')]");
    private static final By TRACKING_ID_EL  = By.cssSelector("p.font-mono.text-blue-700");

    // Validation errors
    private static final By VALIDATION_ERRORS = By.cssSelector("p.form-error");

    public ApplyPage(WebDriver driver) {
        super(driver);
    }

    public void open(String baseUrl) {
        driver.get(baseUrl + "/apply");
        waitForVisible(By.tagName("h1"));
    }

    public String getHeadingText() {
        return getText(By.tagName("h1"));
    }

    // Step 1
    public void fillPersonalInfo(String firstName, String lastName, String email, String phone, String dob) {
        clearAndType(FIRST_NAME, firstName);
        clearAndType(LAST_NAME, lastName);
        clearAndType(EMAIL, email);
        clearAndType(PHONE, phone);
        clearAndType(DATE_OF_BIRTH, dob);
    }

    // Step 2
    public void fillFinancialInfo(String employmentStatus, String annualIncome) {
        new Select(waitForVisible(EMPLOYMENT_STATUS)).selectByValue(employmentStatus);
        clearAndType(ANNUAL_INCOME, annualIncome);
    }

    // Step 3
    public void fillVehicleAndLoanDetails(String make, String model, String year,
                                          String price, String downPayment, String loanAmount, String termMonths) {
        clearAndType(VEHICLE_MAKE, make);
        clearAndType(VEHICLE_MODEL, model);
        clearAndType(VEHICLE_YEAR, year);
        clearAndType(VEHICLE_PRICE, price);
        clearAndType(DOWN_PAYMENT, downPayment);
        clearAndType(LOAN_AMOUNT, loanAmount);
        new Select(waitForVisible(LOAN_TERM)).selectByValue(termMonths);
    }

    public void clickContinue() {
        click(CONTINUE_BTN);
    }

    public void clickSubmit() {
        click(SUBMIT_BTN);
    }

    public boolean isSuccessVisible() {
        return !driver.findElements(SUCCESS_HEADING).isEmpty();
    }

    public String getTrackingId() {
        return getText(TRACKING_ID_EL).trim();
    }

    public boolean hasValidationErrors() {
        return !driver.findElements(VALIDATION_ERRORS).isEmpty();
    }

    public boolean isStepHeadingVisible(String heading) {
        return isTextPresent(heading);
    }
}
