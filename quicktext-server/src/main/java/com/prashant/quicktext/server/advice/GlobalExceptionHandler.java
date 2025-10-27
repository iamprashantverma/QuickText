package com.prashant.quicktext.server.advice;
import com.prashant.jobtracker.advices.APIError;
import com.prashant.quicktext.server.exception.InvalidCredentialsException;
import com.prashant.quicktext.server.exception.UserAlreadyExistsException;
import com.prashant.quicktext.server.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<APIResponse<?>> handleUserNotFound(UserNotFoundException ex) {
        APIError error = new APIError(HttpStatus.NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<APIResponse<?>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        APIError error = new APIError(HttpStatus.CONFLICT, ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<APIResponse<?>> handleInvalidCredentials(InvalidCredentialsException ex) {
        APIError error = new APIError(HttpStatus.UNAUTHORIZED, ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new APIResponse<>(error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<?>> handleGenericException(Exception ex) {
        APIError error = new APIError(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new APIResponse<>(error));
    }
}
