package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.dto.TextShareDTO;
import com.prashant.quicktext.server.dto.ValidateLinkDTO;
import com.prashant.quicktext.server.entity.TextShare;
import com.prashant.quicktext.server.exception.CustomLinkAlreadyExistsException;
import com.prashant.quicktext.server.exception.TextNotFoundException;
import com.prashant.quicktext.server.repository.TextShareRepository;
import com.prashant.quicktext.server.service.TextShareService;
import com.prashant.quicktext.server.util.AppUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TextShareServiceImpl implements TextShareService {

    private final ModelMapper modelMapper;
    private final TextShareRepository textShareRepository;

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
        }

        //  Save entity and return DTO
        TextShare savedTextShare = textShareRepository.save(textShare);
        return convertToTextShareDTO(savedTextShare);
    }


    @Override
    public TextShareDTO getTextById(String id) {
        TextShare entity = textShareRepository.findById(id)
                .orElseThrow(() -> new TextNotFoundException("Text content not found for id: " + id));
        return convertToTextShareDTO(entity);
    }

    @Override
    public List<TextShareDTO> getAllTexts() {
        return List.of();
    }

    @Override
    public TextShareDTO updateText(String id, TextShareDTO textShareDTO) {
        return null;
    }

    @Override
    public void deleteText(String id) {
        TextShare entity = textShareRepository.findById(id)
                .orElseThrow(() -> new TextNotFoundException("Text content not found for id: " + id));

        textShareRepository.delete(entity);

    }

    @Override
    public ValidateLinkDTO validateCustomLink(ValidateLinkDTO validateLinkDTO) {

        String link = validateLinkDTO.getCustomLink();

        boolean exists = textShareRepository.existsByLink(link);

        return ValidateLinkDTO.builder()
                .customLink(link)
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
