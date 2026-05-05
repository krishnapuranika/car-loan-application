package com.carloan.repository;

import com.carloan.entity.LoanApplication;
import com.carloan.enums.ApplicationStatus;
import com.carloan.enums.EmploymentStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class LoanApplicationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private LoanApplicationRepository repository;

    @Test
    void save_shouldSetTrackingIdStatusAndTimestamps() {
        LoanApplication saved = entityManager.persistAndFlush(buildEntity());

        assertThat(saved.getTrackingId()).startsWith("CAR-");
        assertThat(saved.getTrackingId()).hasSize(12); // "CAR-" + 8 chars
        assertThat(saved.getStatus()).isEqualTo(ApplicationStatus.SUBMITTED);
        assertThat(saved.getSubmittedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    @Test
    void findByTrackingId_shouldReturnApplication() {
        LoanApplication saved = entityManager.persistAndFlush(buildEntity());

        Optional<LoanApplication> found = repository.findByTrackingId(saved.getTrackingId());

        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Alice");
        assertThat(found.get().getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void findByTrackingId_shouldReturnEmpty_whenIdDoesNotExist() {
        Optional<LoanApplication> found = repository.findByTrackingId("CAR-NOTEXIST");

        assertThat(found).isEmpty();
    }

    @Test
    void save_shouldPersistAllFields() {
        LoanApplication saved = entityManager.persistAndFlush(buildEntity());

        LoanApplication found = entityManager.find(LoanApplication.class, saved.getId());

        assertThat(found.getFirstName()).isEqualTo("Alice");
        assertThat(found.getLastName()).isEqualTo("Smith");
        assertThat(found.getVehicleMake()).isEqualTo("Honda");
        assertThat(found.getLoanAmount()).isEqualByComparingTo("16000");
        assertThat(found.getLoanTermMonths()).isEqualTo(48);
        assertThat(found.getEmploymentStatus()).isEqualTo(EmploymentStatus.EMPLOYED);
    }

    @Test
    void trackingIds_shouldBeUniqueAcrossApplications() {
        LoanApplication first  = entityManager.persistAndFlush(buildEntity());
        LoanApplication second = entityManager.persistAndFlush(buildEntity());

        assertThat(first.getTrackingId()).isNotEqualTo(second.getTrackingId());
    }

    private LoanApplication buildEntity() {
        LoanApplication app = new LoanApplication();
        app.setFirstName("Alice");
        app.setLastName("Smith");
        app.setEmail("alice@example.com");
        app.setPhone("1234567890");
        app.setDateOfBirth(LocalDate.of(1992, 4, 20));
        app.setEmploymentStatus(EmploymentStatus.EMPLOYED);
        app.setAnnualIncome(new BigDecimal("55000"));
        app.setVehicleMake("Honda");
        app.setVehicleModel("Civic");
        app.setVehicleYear(2021);
        app.setVehiclePrice(new BigDecimal("20000"));
        app.setDownPayment(new BigDecimal("4000"));
        app.setLoanAmount(new BigDecimal("16000"));
        app.setLoanTermMonths(48);
        return app;
    }
}
