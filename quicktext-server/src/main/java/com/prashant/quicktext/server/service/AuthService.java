package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.dto.LoginRequestDTO;
import com.prashant.quicktext.server.dto.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
}
