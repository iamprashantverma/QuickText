package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;

public interface UserService {

   UserResponseDTO createUser(UserRequestDTO request);

}
