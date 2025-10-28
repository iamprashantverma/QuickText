package com.prashant.quicktext.server.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "archived_texts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArchivedText {

    @Id
    private String id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
    private Boolean oneTimeView;
    private LocalDateTime expirationTime;
    private String deleteReason;
}
