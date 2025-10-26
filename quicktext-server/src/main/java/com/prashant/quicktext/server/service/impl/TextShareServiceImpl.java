package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.dto.TextShareDTO;
import com.prashant.quicktext.server.entity.TextShare;
import com.prashant.quicktext.server.exception.TextNotFoundException;
import com.prashant.quicktext.server.repository.TextShareRepository;
import com.prashant.quicktext.server.service.TextShareService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TextShareServiceImpl implements TextShareService {

    private final ModelMapper modelMapper;
    private final TextShareRepository textShareRepository;

    @Override
    public TextShareDTO createText(TextShareDTO textShareDTO) {
        TextShare textShare = convertToTextShareEntity(textShareDTO);
        // get the current user and set in textShare Object

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

    private TextShare convertToTextShareEntity(TextShareDTO dto) {
        return modelMapper.map(dto, TextShare.class);
    }

    private TextShareDTO convertToTextShareDTO(TextShare textShare) {
        return modelMapper.map(textShare, TextShareDTO.class);
    }

}
