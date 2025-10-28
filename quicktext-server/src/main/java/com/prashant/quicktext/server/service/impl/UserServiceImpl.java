package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;
import com.prashant.quicktext.server.entity.User;
import com.prashant.quicktext.server.exception.UserAlreadyExistsException;
import com.prashant.quicktext.server.exception.UserNotFoundException;
import com.prashant.quicktext.server.repository.UserRepository;

import com.prashant.quicktext.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    public final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${profileUrl}")
    private String profileUrl;

    @Override
    public UserResponseDTO createUser(UserRequestDTO request) {
        // Check if user already exists
        userRepository.findByEmail(request.getEmail())
                .ifPresent(u -> {
                    log.warn("Signup failed: email {} already exists", request.getEmail());
                    throw new UserAlreadyExistsException("Email already registered: " + request.getEmail());
                });

        User toBeCreated = convertToUserEntity(request);
        String password = toBeCreated.getPassword();

        String hashPassword = passwordEncoder.encode(password);
        toBeCreated.setPassword(hashPassword);
        toBeCreated.setProfileImageUrl(profileUrl);
        User saveduser = userRepository.save(toBeCreated);

        log.info("User registered successfully with id: {}", saveduser.getId());
        return convertToUserResponseDTO(saveduser);
    }

    @Override
    public UserDetails getUserByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail).orElseThrow(
                ()-> new UserNotFoundException("user not found with email:"+userEmail)
        );
    }

    private User convertToUserEntity(UserRequestDTO requestDTO) {
        return  modelMapper.map(requestDTO,User.class);
    }

    private UserResponseDTO convertToUserResponseDTO(User user) {
        return modelMapper.map(user, UserResponseDTO.class);
    }

}
