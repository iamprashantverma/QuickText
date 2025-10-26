package com.prashant.quicktext.server.service;


import com.prashant.quicktext.server.dto.TextShareDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface TextShareService {
    TextShareDTO createText(@Valid TextShareDTO textShareDTO);

    TextShareDTO getTextById(String id);

    List<TextShareDTO> getAllTexts();

    TextShareDTO updateText(String id, TextShareDTO textShareDTO);

    void deleteText(String id);
}
