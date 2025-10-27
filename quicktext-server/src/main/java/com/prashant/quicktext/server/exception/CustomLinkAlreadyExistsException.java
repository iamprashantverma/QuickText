package com.prashant.quicktext.server.exception;

public class CustomLinkAlreadyExistsException extends RuntimeException {
    public CustomLinkAlreadyExistsException(String message) {
        super(message);
    }
}
