package com.prashant.quicktext.server.filter;

import com.prashant.quicktext.server.service.JWTService;
import com.prashant.quicktext.server.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

@Component
@Slf4j
public class JWTFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserService userService;
    private final HandlerExceptionResolver exceptionResolver;

    public JWTFilter(JWTService jwtService, UserService userService, @Qualifier("handlerExceptionResolver") HandlerExceptionResolver exceptionResolver) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.exceptionResolver = exceptionResolver;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("Incoming request: {} {}", request.getMethod(), request.getRequestURI());

        try {
            final String requestTokenHeader = request.getHeader("Authorization");

            if (requestTokenHeader == null || !requestTokenHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = requestTokenHeader.substring(7);
            log.debug("Extracted JWT token: {}", token);

            String userEmail = jwtService.getUserIdFromToken(token);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userService.getUserByEmail(userEmail);

                if (!user.isEnabled()) {
                    throw new AccessDeniedException("User is not active! Contact ADMIN.");
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("Authentication successful for user: {}", userEmail);
            }

            filterChain.doFilter(request, response);
        }
        catch (JwtException | AccessDeniedException ex) {
            log.error("JWT/Access error: {}", ex.getMessage());
            exceptionResolver.resolveException(request, response, null, ex);
        }
        catch (Exception ex) {
            log.error("Unexpected error in JWT filter: {}", ex.getMessage());
            exceptionResolver.resolveException(request, response, null, ex);
        }
    }
}
