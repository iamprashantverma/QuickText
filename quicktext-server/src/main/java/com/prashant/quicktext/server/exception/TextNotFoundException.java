package com.prashant.quicktext.server.exception;

public class TextNotFoundException extends RuntimeException {
  public TextNotFoundException(String message) {
    super(message);
  }
}
