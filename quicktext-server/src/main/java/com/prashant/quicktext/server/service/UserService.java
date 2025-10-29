package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;
import com.prashant.quicktext.server.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

   UserResponseDTO createUser(UserRequestDTO request);

    UserDetails getUserByEmail(String userEmail);

    UserResponseDTO updateProfilePicture(MultipartFile profileImage);

    UserResponseDTO getUser();
}
