package com.prashant.quicktext.server.controller;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;
import com.prashant.quicktext.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/user")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserRequestDTO request) {
        log.info("Register request received for email: {}", request.getEmail());

        UserResponseDTO response = userService.createUser(request);

        log.info("User registered successfully with id: {}", response.getId());
        return ResponseEntity.ok(response);
    }

}
