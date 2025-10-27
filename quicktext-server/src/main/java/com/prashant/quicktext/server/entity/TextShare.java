package com.prashant.quicktext.server.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "text-shares")
public class TextShare {
    @Id
    private String id;

    private String content;

    @CreatedDate
    private LocalDateTime createdAt;

    private Boolean oneTimeView;

    private Boolean viewed;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime expirationTime;

    private String link;

    private  Long viewCount = 0L;

    @DBRef
    private User user;
}
