package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;
import com.prashant.quicktext.server.entity.User;
import com.prashant.quicktext.server.exception.UserAlreadyExistsException;
import com.prashant.quicktext.server.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;



@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    public final ModelMapper modelMapper;

    public UserResponseDTO createUser(UserRequestDTO request) {
        // Check if user already exists
        userRepository.findByEmail(request.getEmail())
                .ifPresent(u -> {
                    log.warn("Signup failed: email {} already exists", request.getEmail());
                    throw new UserAlreadyExistsException("Email already registered: " + request.getEmail());
                });

        User toBeCreated = convertToUserEntity(request);
        // hash the user password

        User saveduser = userRepository.save(toBeCreated);

        log.info("User registered successfully with id: {}", saveduser.getId());
        return convertToUserResponseDTO(saveduser);
    }

    private User convertToUserEntity(UserRequestDTO requestDTO) {
        return  modelMapper.map(requestDTO,User.class);
    }

    private UserResponseDTO convertToUserResponseDTO(User user) {
        return modelMapper.map(user, UserResponseDTO.class);
    }

}
