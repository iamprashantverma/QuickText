package com.prashant.quicktext.server.advice;

import com.prashant.quicktext.server.exception.UserAlreadyExistsException;
import com.prashant.quicktext.server.exception.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<?>> handleValidationException(MethodArgumentNotValidException ex) {

        // Collect all field errors into a single string
        String errorMessages = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        // Log the error
        log.warn("Validation failed at {}: {}", LocalDateTime.now(), errorMessages);

        APIError err = APIError.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(errorMessages)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new APIResponse<>(err));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<APIResponse<?>> handleAlreadyRegisteredUser(UserAlreadyExistsException exception){
            log.warn("User Already registered,{}",exception.getMessage());
            APIError err = APIError.builder()
                    .status(HttpStatus.CONFLICT)
                    .message(exception.getMessage())
                    .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new APIResponse<>(err));
    }


    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<APIResponse<?>> handleUserNotFound(UserAlreadyExistsException exception){
        log.warn("User Not Registered registered,{}",exception.getMessage());
        APIError err = APIError.builder()
                .status(HttpStatus.NOT_FOUND)
                .message(exception.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new APIResponse<>(err));
    }

}
