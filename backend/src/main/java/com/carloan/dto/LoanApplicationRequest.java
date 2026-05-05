package com.carloan.dto;

import com.carloan.enums.EmploymentStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanApplicationRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Employment status is required")
    private EmploymentStatus employmentStatus;

    @NotNull(message = "Annual income is required")
    @DecimalMin(value = "0.01", message = "Annual income must be positive")
    @Digits(integer = 10, fraction = 2, message = "Invalid income format")
    private BigDecimal annualIncome;

    @Size(max = 100, message = "Employer name must not exceed 100 characters")
    private String employerName;

    @NotBlank(message = "Vehicle make is required")
    @Size(max = 50, message = "Vehicle make must not exceed 50 characters")
    private String vehicleMake;

    @NotBlank(message = "Vehicle model is required")
    @Size(max = 50, message = "Vehicle model must not exceed 50 characters")
    private String vehicleModel;

    @NotNull(message = "Vehicle year is required")
    @Min(value = 1980, message = "Vehicle year must be 1980 or later")
    @Max(value = 2027, message = "Vehicle year cannot be too far in the future")
    private Integer vehicleYear;

    @NotNull(message = "Vehicle price is required")
    @DecimalMin(value = "1000.00", message = "Vehicle price must be at least $1,000")
    @Digits(integer = 10, fraction = 2, message = "Invalid vehicle price format")
    private BigDecimal vehiclePrice;

    @NotNull(message = "Down payment is required")
    @DecimalMin(value = "0.00", message = "Down payment cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Invalid down payment format")
    private BigDecimal downPayment;

    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "1000.00", message = "Loan amount must be at least $1,000")
    @Digits(integer = 10, fraction = 2, message = "Invalid loan amount format")
    private BigDecimal loanAmount;

    @NotNull(message = "Loan term is required")
    private Integer loanTermMonths;

    public LoanApplicationRequest() {}

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public EmploymentStatus getEmploymentStatus() { return employmentStatus; }
    public void setEmploymentStatus(EmploymentStatus employmentStatus) { this.employmentStatus = employmentStatus; }

    public BigDecimal getAnnualIncome() { return annualIncome; }
    public void setAnnualIncome(BigDecimal annualIncome) { this.annualIncome = annualIncome; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public String getVehicleMake() { return vehicleMake; }
    public void setVehicleMake(String vehicleMake) { this.vehicleMake = vehicleMake; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public Integer getVehicleYear() { return vehicleYear; }
    public void setVehicleYear(Integer vehicleYear) { this.vehicleYear = vehicleYear; }

    public BigDecimal getVehiclePrice() { return vehiclePrice; }
    public void setVehiclePrice(BigDecimal vehiclePrice) { this.vehiclePrice = vehiclePrice; }

    public BigDecimal getDownPayment() { return downPayment; }
    public void setDownPayment(BigDecimal downPayment) { this.downPayment = downPayment; }

    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }

    public Integer getLoanTermMonths() { return loanTermMonths; }
    public void setLoanTermMonths(Integer loanTermMonths) { this.loanTermMonths = loanTermMonths; }
}
