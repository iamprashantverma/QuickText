package com.prashant.quicktext.server.advice;

import com.prashant.jobtracker.advices.APIError;
import com.prashant.quicktext.server.exception.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;



@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<APIResponse<?>> handleUserNotFound(UserNotFoundException ex) {
        log.warn("User not found: {}", ex.getMessage());
        APIError error = new APIError(HttpStatus.NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<APIResponse<?>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        log.warn("User already exists: {}", ex.getMessage());
        APIError error = new APIError(HttpStatus.CONFLICT, ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<APIResponse<?>> handleInvalidCredentials(InvalidCredentialsException ex) {
        log.warn("Invalid credentials attempt: {}", ex.getMessage());
        APIError error = new APIError(HttpStatus.UNAUTHORIZED, ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(CustomLinkAlreadyExistsException.class)
    public ResponseEntity<APIResponse<?>> handleCustomLinkAlreadyExists(CustomLinkAlreadyExistsException ex) {
        log.warn("Custom link already exists: {}", ex.getMessage());
        APIError error = APIError.builder()
                .status(HttpStatus.CONFLICT)
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(TextNotFoundException.class)
    public ResponseEntity<APIResponse<?>> handleTextNotFoundException(TextNotFoundException ex) {
        log.warn(" link is broken : {}", ex.getMessage());
        APIError error = APIError.builder()
                .status(HttpStatus.NOT_FOUND)
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<?>> handleGenericException(Exception ex) {
        log.error("Unhandled exception occurred: {} - StackTrace: ", ex.getMessage(), ex);
        APIError error = new APIError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong: " + ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<?>> handleValidationErrors(MethodArgumentNotValidException ex) {
        StringBuilder messageBuilder = new StringBuilder("Validation failed: ");

        ex.getBindingResult().getFieldErrors().forEach(fieldError ->
                messageBuilder.append(String.format("[%s: %s] ", fieldError.getField(), fieldError.getDefaultMessage()))
        );

        String errorMessage = messageBuilder.toString().trim();

        log.warn("Validation failed: {}", errorMessage);

        APIError error = new APIError(HttpStatus.BAD_REQUEST, errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<APIResponse<?>> handleAuthorizationDenied(AuthorizationDeniedException ex) {
        log.warn("Authorization failed: {}", ex.getMessage());
        APIError error = new APIError(HttpStatus.FORBIDDEN, "Access denied: You do not have permission to perform this action.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new APIResponse<>(error));
    }
}
