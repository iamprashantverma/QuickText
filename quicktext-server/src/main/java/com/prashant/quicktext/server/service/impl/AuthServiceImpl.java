package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.dto.LoginRequestDTO;
import com.prashant.quicktext.server.dto.LoginResponseDTO;
import com.prashant.quicktext.server.entity.User;
import com.prashant.quicktext.server.exception.InvalidCredentialsException;
import com.prashant.quicktext.server.exception.UserNotFoundException;
import com.prashant.quicktext.server.repository.UserRepository;
import com.prashant.quicktext.server.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(()-> new UserNotFoundException("User not Registered with email:"+loginRequestDTO.getEmail()));

        if (!user.getPassword().equals(loginRequestDTO.getPassword()))
            throw  new InvalidCredentialsException("Invalid email or password");

        return LoginResponseDTO.builder()
                .message("Login Successfully")
                .build();
    }

}
