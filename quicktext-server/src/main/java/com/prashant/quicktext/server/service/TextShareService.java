package com.prashant.quicktext.server.service;


import com.prashant.quicktext.server.dto.TextShareDTO;
import com.prashant.quicktext.server.dto.ValidateLinkDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public interface TextShareService {
    TextShareDTO createText(@Valid TextShareDTO textShareDTO);

    TextShareDTO getTextById(String id);

    List<TextShareDTO> getAllTexts();

    TextShareDTO updateText(String id, TextShareDTO textShareDTO);

    void deleteText(String id);

    ValidateLinkDTO validateCustomLink(ValidateLinkDTO customLink);
}
