package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.dto.LoginRequestDTO;
import com.prashant.quicktext.server.dto.LoginResponseDTO;
import com.prashant.quicktext.server.entity.TextShare;
import com.prashant.quicktext.server.entity.User;
import com.prashant.quicktext.server.exception.InvalidCredentialsException;
import com.prashant.quicktext.server.exception.TextNotFoundException;
import com.prashant.quicktext.server.exception.UserNotFoundException;
import com.prashant.quicktext.server.repository.TextShareRepository;
import com.prashant.quicktext.server.repository.UserRepository;
import com.prashant.quicktext.server.service.AuthService;
import com.prashant.quicktext.server.service.JWTService;
import com.prashant.quicktext.server.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final TextShareRepository textShareRepository;
    private final AuthUtil authUtil;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {


        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new UserNotFoundException(
                        "User not registered with email: " + loginRequestDTO.getEmail()
                ));


        if (!user.isEnabled()) {
            throw new InvalidCredentialsException("User account is inactive. Please contact admin.");
        }

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String refreshToken = jwtService.generateRefreshToken(user);

        log.info("User {} logged in successfully", user.getEmail());

        return LoginResponseDTO.builder()
                .message("Login successful")
                .token(refreshToken)
                .build();
    }

    public Boolean canDeleteText(String id) {
        TextShare entity = textShareRepository.findById(id).orElse(null);
        if (entity == null)
            throw  new TextNotFoundException("Invalid id");
        User currentUser = authUtil.getCurrentUser();

        if (entity.getUser() == null || currentUser == null)
            return false;

        return entity.getUser().getId().equals(currentUser.getId());
    }
}
