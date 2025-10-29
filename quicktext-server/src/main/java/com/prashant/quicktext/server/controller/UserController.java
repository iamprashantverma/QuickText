package com.prashant.quicktext.server.controller;

import com.prashant.quicktext.server.dto.UserRequestDTO;
import com.prashant.quicktext.server.dto.UserResponseDTO;
import com.prashant.quicktext.server.entity.User;
import com.prashant.quicktext.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PutMapping(value = "/", consumes = "multipart/form-data")
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestPart("profileImage") MultipartFile profileImage) {
       UserResponseDTO user =  userService.updateProfilePicture(profileImage);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<UserResponseDTO> getUser() {
        UserResponseDTO userResponseDTO = userService.getUser();
        return ResponseEntity.ok(userResponseDTO);
    }

}
