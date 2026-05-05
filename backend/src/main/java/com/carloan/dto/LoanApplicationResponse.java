package com.carloan.dto;

import com.carloan.enums.ApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LoanApplicationResponse {

    private String trackingId;
    private ApplicationStatus status;
    private String statusMessage;
    private String applicantName;
    private String email;
    private BigDecimal loanAmount;
    private Integer loanTermMonths;
    private String vehicleInfo;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    public LoanApplicationResponse() {}

    public LoanApplicationResponse(String trackingId, ApplicationStatus status, String statusMessage,
                                   String applicantName, String email, BigDecimal loanAmount,
                                   Integer loanTermMonths, String vehicleInfo,
                                   LocalDateTime submittedAt, LocalDateTime updatedAt) {
        this.trackingId = trackingId;
        this.status = status;
        this.statusMessage = statusMessage;
        this.applicantName = applicantName;
        this.email = email;
        this.loanAmount = loanAmount;
        this.loanTermMonths = loanTermMonths;
        this.vehicleInfo = vehicleInfo;
        this.submittedAt = submittedAt;
        this.updatedAt = updatedAt;
    }

    public String getTrackingId() { return trackingId; }
    public ApplicationStatus getStatus() { return status; }
    public String getStatusMessage() { return statusMessage; }
    public String getApplicantName() { return applicantName; }
    public String getEmail() { return email; }
    public BigDecimal getLoanAmount() { return loanAmount; }
    public Integer getLoanTermMonths() { return loanTermMonths; }
    public String getVehicleInfo() { return vehicleInfo; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
