package com.carloan.service;

import com.carloan.dto.LoanApplicationRequest;
import com.carloan.dto.LoanApplicationResponse;
import com.carloan.entity.LoanApplication;
import com.carloan.enums.ApplicationStatus;
import com.carloan.enums.EmploymentStatus;
import com.carloan.exception.ApplicationNotFoundException;
import com.carloan.repository.LoanApplicationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanApplicationServiceTest {

    @Mock
    private LoanApplicationRepository repository;

    @InjectMocks
    private LoanApplicationService service;

    // --- submitApplication ---

    @Test
    void submitApplication_shouldSaveAndReturnResponse() {
        when(repository.save(any())).thenReturn(buildEntity(ApplicationStatus.SUBMITTED));

        LoanApplicationResponse response = service.submitApplication(buildRequest());

        assertThat(response.getTrackingId()).isEqualTo("CAR-TEST1234");
        assertThat(response.getStatus()).isEqualTo(ApplicationStatus.SUBMITTED);
        assertThat(response.getApplicantName()).isEqualTo("John Doe");
        assertThat(response.getVehicleInfo()).isEqualTo("2022 Toyota Camry");
        assertThat(response.getLoanAmount()).isEqualByComparingTo("20000");
        verify(repository, times(1)).save(any());
    }

    @Test
    void submitApplication_shouldMapAllRequestFieldsToEntity() {
        when(repository.save(any())).thenAnswer(inv -> {
            LoanApplication app = inv.getArgument(0);
            app.setTrackingId("CAR-TEST0000");
            app.setStatus(ApplicationStatus.SUBMITTED);
            app.setSubmittedAt(LocalDateTime.now());
            app.setUpdatedAt(LocalDateTime.now());
            return app;
        });

        LoanApplicationRequest request = buildRequest();
        request.setEmployerName("Acme Corp");
        service.submitApplication(request);

        verify(repository).save(argThat(app ->
                "John".equals(app.getFirstName()) &&
                "Doe".equals(app.getLastName()) &&
                "john@example.com".equals(app.getEmail()) &&
                "Acme Corp".equals(app.getEmployerName()) &&
                "Toyota".equals(app.getVehicleMake())
        ));
    }

    // --- trackApplication ---

    @Test
    void trackApplication_shouldReturnApplicationByTrackingId() {
        when(repository.findByTrackingId("CAR-TEST1234"))
                .thenReturn(Optional.of(buildEntity(ApplicationStatus.SUBMITTED)));

        LoanApplicationResponse response = service.trackApplication("CAR-TEST1234");

        assertThat(response.getApplicantName()).isEqualTo("John Doe");
        assertThat(response.getVehicleInfo()).isEqualTo("2022 Toyota Camry");
    }

    @Test
    void trackApplication_shouldUppercaseTrackingId() {
        when(repository.findByTrackingId("CAR-TEST1234"))
                .thenReturn(Optional.of(buildEntity(ApplicationStatus.SUBMITTED)));

        service.trackApplication("car-test1234");

        verify(repository).findByTrackingId("CAR-TEST1234");
    }

    @Test
    void trackApplication_shouldThrowWhenNotFound() {
        when(repository.findByTrackingId(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.trackApplication("CAR-UNKNOWN"))
                .isInstanceOf(ApplicationNotFoundException.class)
                .hasMessageContaining("CAR-UNKNOWN");
    }

    // --- status messages ---

    @Test
    void statusMessage_submitted() {
        when(repository.save(any())).thenReturn(buildEntity(ApplicationStatus.SUBMITTED));
        LoanApplicationResponse r = service.submitApplication(buildRequest());
        assertThat(r.getStatusMessage()).containsIgnoringCase("received");
    }

    @Test
    void statusMessage_underReview() {
        when(repository.findByTrackingId(anyString()))
                .thenReturn(Optional.of(buildEntity(ApplicationStatus.UNDER_REVIEW)));
        LoanApplicationResponse r = service.trackApplication("CAR-TEST1234");
        assertThat(r.getStatusMessage()).containsIgnoringCase("reviewing");
    }

    @Test
    void statusMessage_approved() {
        when(repository.findByTrackingId(anyString()))
                .thenReturn(Optional.of(buildEntity(ApplicationStatus.APPROVED)));
        LoanApplicationResponse r = service.trackApplication("CAR-TEST1234");
        assertThat(r.getStatusMessage()).containsIgnoringCase("approved");
    }

    @Test
    void statusMessage_rejected() {
        when(repository.findByTrackingId(anyString()))
                .thenReturn(Optional.of(buildEntity(ApplicationStatus.REJECTED)));
        LoanApplicationResponse r = service.trackApplication("CAR-TEST1234");
        assertThat(r.getStatusMessage()).containsIgnoringCase("not approved");
    }

    // --- helpers ---

    private LoanApplicationRequest buildRequest() {
        LoanApplicationRequest req = new LoanApplicationRequest();
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setEmail("john@example.com");
        req.setPhone("1234567890");
        req.setDateOfBirth(LocalDate.of(1990, 1, 1));
        req.setEmploymentStatus(EmploymentStatus.EMPLOYED);
        req.setAnnualIncome(new BigDecimal("60000"));
        req.setVehicleMake("Toyota");
        req.setVehicleModel("Camry");
        req.setVehicleYear(2022);
        req.setVehiclePrice(new BigDecimal("25000"));
        req.setDownPayment(new BigDecimal("5000"));
        req.setLoanAmount(new BigDecimal("20000"));
        req.setLoanTermMonths(60);
        return req;
    }

    private LoanApplication buildEntity(ApplicationStatus status) {
        LoanApplication e = new LoanApplication();
        e.setId(1L);
        e.setTrackingId("CAR-TEST1234");
        e.setFirstName("John");
        e.setLastName("Doe");
        e.setEmail("john@example.com");
        e.setPhone("1234567890");
        e.setDateOfBirth(LocalDate.of(1990, 1, 1));
        e.setEmploymentStatus(EmploymentStatus.EMPLOYED);
        e.setAnnualIncome(new BigDecimal("60000"));
        e.setVehicleMake("Toyota");
        e.setVehicleModel("Camry");
        e.setVehicleYear(2022);
        e.setVehiclePrice(new BigDecimal("25000"));
        e.setDownPayment(new BigDecimal("5000"));
        e.setLoanAmount(new BigDecimal("20000"));
        e.setLoanTermMonths(60);
        e.setStatus(status);
        e.setSubmittedAt(LocalDateTime.now());
        e.setUpdatedAt(LocalDateTime.now());
        return e;
    }
}
