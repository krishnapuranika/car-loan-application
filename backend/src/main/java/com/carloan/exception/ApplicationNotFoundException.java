package com.carloan.exception;

public class ApplicationNotFoundException extends RuntimeException {
    public ApplicationNotFoundException(String trackingId) {
        super("No application found with tracking ID: " + trackingId);
    }
}
