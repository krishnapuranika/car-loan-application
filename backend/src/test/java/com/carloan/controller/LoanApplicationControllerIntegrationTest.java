package com.carloan.controller;

import com.carloan.dto.LoanApplicationRequest;
import com.carloan.enums.EmploymentStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class LoanApplicationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- submit ---

    @Test
    void submitApplication_shouldReturn201WithTrackingId() throws Exception {
        mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.trackingId").value(org.hamcrest.Matchers.startsWith("CAR-")))
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.applicantName").value("Jane Smith"))
                .andExpect(jsonPath("$.vehicleInfo").value("2023 Honda Accord"))
                .andExpect(jsonPath("$.statusMessage").isNotEmpty());
    }

    @Test
    void submitApplication_shouldReturn400_whenBodyIsEmpty() throws Exception {
        mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists())
                .andExpect(jsonPath("$.errors.firstName").value("First name is required"))
                .andExpect(jsonPath("$.errors.email").value("Email is required"))
                .andExpect(jsonPath("$.errors.loanAmount").value("Loan amount is required"));
    }

    @Test
    void submitApplication_shouldReturn400_whenEmailIsInvalid() throws Exception {
        LoanApplicationRequest req = buildRequest();
        req.setEmail("not-an-email");

        mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").value("Invalid email format"));
    }

    @Test
    void submitApplication_shouldReturn400_whenLoanAmountIsTooLow() throws Exception {
        LoanApplicationRequest req = buildRequest();
        req.setLoanAmount(new BigDecimal("500"));

        mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.loanAmount").value("Loan amount must be at least $1,000"));
    }

    @Test
    void submitApplication_shouldReturn400_whenVehicleYearIsTooOld() throws Exception {
        LoanApplicationRequest req = buildRequest();
        req.setVehicleYear(1950);

        mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.vehicleYear").exists());
    }

    @Test
    void submitApplication_shouldReturn400_whenPhoneIsInvalid() throws Exception {
        LoanApplicationRequest req = buildRequest();
        req.setPhone("abc");

        mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone").value("Invalid phone number format"));
    }

    // --- track ---

    @Test
    void trackApplication_shouldReturn200_afterSuccessfulSubmit() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        String trackingId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("trackingId").asText();

        mockMvc.perform(get("/api/v1/applications/{id}", trackingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackingId").value(trackingId))
                .andExpect(jsonPath("$.loanTermMonths").value(60))
                .andExpect(jsonPath("$.submittedAt").isNotEmpty());
    }

    @Test
    void trackApplication_shouldAcceptLowercaseTrackingId() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest())))
                .andExpect(status().isCreated())
                .andReturn();

        String trackingId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("trackingId").asText();

        mockMvc.perform(get("/api/v1/applications/{id}", trackingId.toLowerCase()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackingId").value(trackingId));
    }

    @Test
    void trackApplication_shouldReturn404_forUnknownId() throws Exception {
        mockMvc.perform(get("/api/v1/applications/CAR-ZZZZZZZZ"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value(
                        org.hamcrest.Matchers.containsString("CAR-ZZZZZZZZ")));
    }

    @Test
    void trackApplication_errorResponse_shouldContainStatusAndTimestamp() throws Exception {
        mockMvc.perform(get("/api/v1/applications/CAR-BADID000"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    // --- helper ---

    private LoanApplicationRequest buildRequest() {
        LoanApplicationRequest req = new LoanApplicationRequest();
        req.setFirstName("Jane");
        req.setLastName("Smith");
        req.setEmail("jane@example.com");
        req.setPhone("9876543210");
        req.setDateOfBirth(LocalDate.of(1985, 6, 15));
        req.setEmploymentStatus(EmploymentStatus.EMPLOYED);
        req.setAnnualIncome(new BigDecimal("75000"));
        req.setEmployerName("Acme Corp");
        req.setVehicleMake("Honda");
        req.setVehicleModel("Accord");
        req.setVehicleYear(2023);
        req.setVehiclePrice(new BigDecimal("30000"));
        req.setDownPayment(new BigDecimal("6000"));
        req.setLoanAmount(new BigDecimal("24000"));
        req.setLoanTermMonths(60);
        return req;
    }
}
