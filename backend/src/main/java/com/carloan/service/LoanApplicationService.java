package com.carloan.service;

import com.carloan.dto.LoanApplicationRequest;
import com.carloan.dto.LoanApplicationResponse;
import com.carloan.entity.LoanApplication;
import com.carloan.exception.ApplicationNotFoundException;
import com.carloan.repository.LoanApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LoanApplicationService {

    private final LoanApplicationRepository repository;

    public LoanApplicationService(LoanApplicationRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public LoanApplicationResponse submitApplication(LoanApplicationRequest request) {
        LoanApplication application = new LoanApplication();
        application.setFirstName(request.getFirstName());
        application.setLastName(request.getLastName());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setDateOfBirth(request.getDateOfBirth());
        application.setEmploymentStatus(request.getEmploymentStatus());
        application.setAnnualIncome(request.getAnnualIncome());
        application.setEmployerName(request.getEmployerName());
        application.setVehicleMake(request.getVehicleMake());
        application.setVehicleModel(request.getVehicleModel());
        application.setVehicleYear(request.getVehicleYear());
        application.setVehiclePrice(request.getVehiclePrice());
        application.setDownPayment(request.getDownPayment());
        application.setLoanAmount(request.getLoanAmount());
        application.setLoanTermMonths(request.getLoanTermMonths());

        LoanApplication saved = repository.save(application);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public LoanApplicationResponse trackApplication(String trackingId) {
        LoanApplication application = repository.findByTrackingId(trackingId.toUpperCase())
                .orElseThrow(() -> new ApplicationNotFoundException(trackingId));
        return toResponse(application);
    }

    private LoanApplicationResponse toResponse(LoanApplication app) {
        String statusMessage = switch (app.getStatus()) {
            case SUBMITTED    -> "Your application has been received and is pending review.";
            case UNDER_REVIEW -> "Our team is currently reviewing your application.";
            case APPROVED     -> "Congratulations! Your car loan application has been approved.";
            case REJECTED     -> "We're sorry, your application was not approved at this time.";
        };

        String vehicleInfo = app.getVehicleYear() + " " + app.getVehicleMake() + " " + app.getVehicleModel();

        return new LoanApplicationResponse(
                app.getTrackingId(),
                app.getStatus(),
                statusMessage,
                app.getFirstName() + " " + app.getLastName(),
                app.getEmail(),
                app.getLoanAmount(),
                app.getLoanTermMonths(),
                vehicleInfo,
                app.getSubmittedAt(),
                app.getUpdatedAt()
        );
    }
}
