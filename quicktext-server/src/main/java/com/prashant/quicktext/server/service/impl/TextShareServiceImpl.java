package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.dto.TextShareDTO;
import com.prashant.quicktext.server.dto.ValidateLinkDTO;
import com.prashant.quicktext.server.entity.ArchivedText;
import com.prashant.quicktext.server.entity.TextShare;
import com.prashant.quicktext.server.entity.User;
import com.prashant.quicktext.server.exception.CustomLinkAlreadyExistsException;
import com.prashant.quicktext.server.exception.TextNotFoundException;
import com.prashant.quicktext.server.repository.ArchivedTextRepository;
import com.prashant.quicktext.server.repository.TextShareRepository;
import com.prashant.quicktext.server.service.CounterService;
import com.prashant.quicktext.server.service.TextShareService;
import com.prashant.quicktext.server.util.AppUtil;
import com.prashant.quicktext.server.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class TextShareServiceImpl implements TextShareService {
    private static final Set<String> BLOCKED_LINKS = Set.of("login", "signup", "dashboard", "create", "count", "texts", "validate-link");

    private final ModelMapper modelMapper;
    private final TextShareRepository textShareRepository;
    private final AuthUtil authUtil;
    private final ArchivedTextRepository archivedTextRepository;
    private final CounterService counterService;

    @Override
    @Transactional
    public TextShareDTO createText(TextShareDTO textShareDTO) {

        // Convert DTO to Entity
        TextShare textShare = convertToTextShareEntity(textShareDTO);
        String customLink = textShareDTO.getLink();

        //  Validate custom link uniqueness
        if (customLink != null && textShareRepository.existsByLink(customLink)) {
            throw new CustomLinkAlreadyExistsException(
                    "The custom link '" + customLink + "' is already registered by another user."
            );
        }
        boolean isBlockedLink = false;
        if (customLink != null) {
            isBlockedLink = BLOCKED_LINKS.contains(customLink);
        }
        if (isBlockedLink)
            throw new CustomLinkAlreadyExistsException(
                    "The custom link '" + customLink + "' is already registered by another user."
            );

        //  Generate unique random link
        String generatedLink;
        do {
            generatedLink = AppUtil.generateRandomLink();
        } while (textShareRepository.existsByLink(generatedLink));

        textShare.setLink(customLink != null ? customLink : generatedLink);

        //  Handle expiration or one-time view logic
        if (Boolean.TRUE.equals(textShareDTO.getOneTimeView())) {
            textShare.setOneTimeView(true);
            textShare.setViewed(false);
            textShare.setExpirationTime(null);
        } else if (textShareDTO.getExpirationMinutes() != null && textShareDTO.getExpirationMinutes() > 0) {
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(textShareDTO.getExpirationMinutes());
            textShare.setExpirationTime(expiresAt);
            textShare.setViewCount(0L);
        }
        // fetch the current User if logged in
        User currentUser = authUtil.getCurrentUser();
        textShare.setUser(currentUser);

        log.info("current User:{}",currentUser);
        //  Save entity and return DTO
        TextShare savedTextShare = textShareRepository.save(textShare);
        counterService.incrementCounter();

        return convertToTextShareDTO(savedTextShare);
    }

    @Override
    @Transactional
    public TextShareDTO getTextById(String link) {
        log.info("Fetching text content for link: {}", link);

        TextShare textShare = textShareRepository.findByLink(link)
                .orElseThrow(() -> {
                    log.warn("No content found for link: {}", link);
                    return new TextNotFoundException("Invalid or broken link.");
                });

        LocalDateTime now = LocalDateTime.now();

        boolean notExpired = textShare.getExpirationTime() == null || textShare.getExpirationTime().isAfter(now);
        boolean oneTimeValid = Boolean.TRUE.equals(textShare.getOneTimeView()) && Boolean.FALSE.equals(textShare.getViewed());

        // Validate the link
        if (!notExpired && !oneTimeValid) {
            log.warn("Link {} is expired or already viewed.", link);
            throw new TextNotFoundException("Invalid or broken link.");
        }

        // Handle one-time view
        if (Boolean.TRUE.equals(textShare.getOneTimeView())) {
            log.info("One-time view for link: {} — deleting after access.", link);
            textShareRepository.delete(textShare);
        } else {
            // Increment view count safely
            long newCount = textShare.getViewCount() == null ? 1L : textShare.getViewCount() + 1;
            textShare.setViewCount(newCount);
            textShareRepository.save(textShare);
            log.info("Incremented view count for link {}: {}", link, newCount);
        }

        return convertToTextShareDTO(textShare);
    }

    @Override
    @PreAuthorize("isAuthenticated()")
    public List<TextShareDTO> getAllTexts() {
        User user = authUtil.getCurrentUser();
        if (user ==null)
             throw new AuthorizationDeniedException("Your are not Authorized to perform this actions");

        List<TextShare> textShares = textShareRepository.findAllByUser(user);

        return textShares.stream()
                .map(text -> modelMapper.map(text,TextShareDTO.class))
                .toList();
    }

    @Override
    @Transactional
    @PreAuthorize("@authServiceImpl.canDeleteText(#id)")
    public void deleteText(String id) {
        TextShare entity = textShareRepository.findById(id)
                .orElseThrow(() -> new TextNotFoundException("Text content not found for id: " + id));

        ArchivedText archivedText = modelMapper.map(entity,ArchivedText.class);
        archivedText.setId(null);
        archivedText.setDeleteReason("Self");

        archivedTextRepository.save(archivedText);
        textShareRepository.delete(entity);
    }

    @Override
    public ValidateLinkDTO validateCustomLink(ValidateLinkDTO validateLinkDTO) {

        String link = validateLinkDTO.getCustomLink().toLowerCase();
        boolean exists = textShareRepository.existsByLink(link);
        boolean isBlockedLink = BLOCKED_LINKS.contains(link);
        if (isBlockedLink)
            exists = true;
        return ValidateLinkDTO.builder()
                .customLink(link)
                .isAvailable(!exists)
                .message(exists
                        ? "This custom link is already taken. Please try another."
                        : "This custom link is available!")
                .build();
    }

    private TextShare convertToTextShareEntity(TextShareDTO dto) {
        return modelMapper.map(dto, TextShare.class);
    }

    private TextShareDTO convertToTextShareDTO(TextShare textShare) {
        return modelMapper.map(textShare, TextShareDTO.class);
    }

}
