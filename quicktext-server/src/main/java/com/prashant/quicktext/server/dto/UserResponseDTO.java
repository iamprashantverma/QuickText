package com.prashant.quicktext.server.dto;

import lombok.Data;

@Data
public class UserResponseDTO {
    private String id;
    private String name;
    private String email;
    private String profileImageUrl;
}
