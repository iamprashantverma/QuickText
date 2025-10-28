package com.prashant.quicktext.server.controller;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;
import com.prashant.quicktext.server.service.impl.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/user")
@RestController
@CrossOrigin
@RequiredArgsConstructor
public class UserController {

    private final UserServiceImpl userServiceImpl;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRequestDTO request) {
        log.info("Register request received for email: {}", request.getEmail());

        UserResponseDTO response = userServiceImpl.createUser(request);

        log.info("User registered successfully with id: {}", response.getId());
        return ResponseEntity.ok(response);
    }

}
