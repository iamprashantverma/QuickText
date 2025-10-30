package com.prashant.quicktext.server.advice;

import com.cloudinary.api.AuthorizationRequired;
import com.cloudinary.api.exceptions.ApiException;
import com.cloudinary.api.exceptions.NotFound;
import com.mongodb.MongoException;
import com.prashant.jobtracker.advices.APIError;
import com.prashant.quicktext.server.exception.*;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // USER EXCEPTIONS
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<APIResponse<?>> handleUserNotFound(UserNotFoundException ex) {
        log.warn("User not found: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<APIResponse<?>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        log.warn("User already exists: {}", ex.getMessage());
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<APIResponse<?>> handleInvalidCredentials(InvalidCredentialsException ex) {
        log.warn("Invalid credentials: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    // MONGO / DATABASE EXCEPTIONS
    @ExceptionHandler({
            MongoException.class,
            DataAccessResourceFailureException.class
    })
    public ResponseEntity<APIResponse<?>> handleMongoExceptions(Exception ex) {
        log.error("MongoDB connection error: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE,
                "Database connection issue. Please try again later.");
    }

    // EXT / LINK EXCEPTIONS
    @ExceptionHandler({ CustomLinkAlreadyExistsException.class, TextNotFoundException.class })
    public ResponseEntity<APIResponse<?>> handleTextExceptions(RuntimeException ex) {
        HttpStatus status = ex instanceof TextNotFoundException ? HttpStatus.NOT_FOUND : HttpStatus.CONFLICT;
        log.warn("Text/link issue: {}", ex.getMessage());
        return buildResponse(status, ex.getMessage());
    }

    // SECURITY / AUTHORIZATION
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<APIResponse<?>> handleAuthenticationException(AuthenticationException ex) {
        log.warn("Authentication failed: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid or missing credentials.");
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<APIResponse<?>> handleAuthorizationDenied(AuthorizationDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, "You do not have permission to perform this action.");
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<APIResponse<?>> handleJWTException(JwtException ex) {
        log.warn("JWT error: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid or expired JWT token.");
    }

    // CLOUDINARY
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<APIResponse<?>> handleCloudinaryApiException(ApiException ex) {
        log.error("Cloudinary API error: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.BAD_GATEWAY, "Cloudinary service error: " + ex.getMessage());
    }

    @ExceptionHandler(NotFound.class)
    public ResponseEntity<APIResponse<?>> handleCloudinaryNotFound(NotFound ex) {
        log.warn("Cloudinary resource not found: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "Cloudinary resource not found.");
    }

    @ExceptionHandler(AuthorizationRequired.class)
    public ResponseEntity<APIResponse<?>> handleCloudinaryAuthError(AuthorizationRequired ex) {
        log.error("Cloudinary authorization error: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid Cloudinary credentials or unauthorized access.");
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<APIResponse<?>> handleCloudinaryNetworkIssues(IOException ex) {
        log.error("Cloudinary network issue: {}", ex.getMessage());
        return buildResponse(HttpStatus.GATEWAY_TIMEOUT, "Cloudinary network timeout or connectivity issue.");
    }

    //VALIDATION
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<?>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> String.format("[%s: %s]", err.getField(), err.getDefaultMessage()))
                .reduce((a, b) -> a + " " + b)
                .orElse("Validation failed.");
        log.warn("Validation failed: {}", message);
        return buildResponse(HttpStatus.BAD_REQUEST, message);
    }

    // GENERIC FALLBACK
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<?>> handleGenericException(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong: " + ex.getMessage());
    }

    // Helper method
    private ResponseEntity<APIResponse<?>> buildResponse(HttpStatus status, String message) {
        APIError error = new APIError(status, message);
        return ResponseEntity.status(status).body(new APIResponse<>(error));
    }
}
