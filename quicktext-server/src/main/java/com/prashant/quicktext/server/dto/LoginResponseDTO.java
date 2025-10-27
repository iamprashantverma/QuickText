package com.prashant.quicktext.server.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private String message;
    private String token;
}
