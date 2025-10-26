package com.prashant.quicktext.server.dto;

import jakarta.validation.constraints.NotBlank;
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

    private String contentHtml;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long viewCount;

}
