package com.carloan.controller;

import com.carloan.dto.LoanApplicationRequest;
import com.carloan.dto.LoanApplicationResponse;
import com.carloan.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
public class LoanApplicationController {

    private final LoanApplicationService service;

    public LoanApplicationController(LoanApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<LoanApplicationResponse> submitApplication(
            @Valid @RequestBody LoanApplicationRequest request) {
        LoanApplicationResponse response = service.submitApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{trackingId}")
    public ResponseEntity<LoanApplicationResponse> trackApplication(
            @PathVariable String trackingId) {
        LoanApplicationResponse response = service.trackApplication(trackingId);
        return ResponseEntity.ok(response);
    }
}
