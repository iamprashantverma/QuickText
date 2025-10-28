package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.entity.User;

public interface JWTService {
    String generateAccessToken(User user);

    String generateRefreshToken(User user);

    String getUserIdFromToken(String token);
}
