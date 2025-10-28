package com.prashant.quicktext.server.dto;

import com.prashant.quicktext.server.entity.User;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class TextShareDTO {

    private String id;

    private String content;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Min(value = 1, message = "Expiration time must be at least 1 minute")
    private Long expirationMinutes;

    private String link;

    private Boolean oneTimeView;
    private UserResponseDTO user;
    private Long viewCount;

}
