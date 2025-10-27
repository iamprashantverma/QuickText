package com.prashant.quicktext.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ValidateLinkDTO {

    @NotBlank(message = "Custom link cannot be blank")
    private String customLink;
    private String message;
    private Boolean isAvailable;
}
