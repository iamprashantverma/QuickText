package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {

   UserResponseDTO createUser(UserRequestDTO request);

    UserDetails getUserByEmail(String userEmail);
}
