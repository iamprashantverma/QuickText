package com.prashant.quicktext.server.controller;

import com.prashant.quicktext.server.dto.TextShareDTO;
import com.prashant.quicktext.server.dto.ValidateLinkDTO;
import com.prashant.quicktext.server.service.TextShareService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/texts")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin
public class TextShareController {

    private final TextShareService textShareService;

    @PostMapping
    public ResponseEntity<TextShareDTO> createSharedText(@Valid  @RequestBody TextShareDTO textShareDTO) {
        TextShareDTO createdText = textShareService.createText(textShareDTO);
        return new ResponseEntity<>(createdText, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TextShareDTO> getSharedText(@PathVariable String id) {
        TextShareDTO text = textShareService.getTextById(id);
        return ResponseEntity.ok(text);
    }

    @GetMapping
    public ResponseEntity<List<TextShareDTO>> getAllSharedTexts() {
        List<TextShareDTO> texts = textShareService.getAllTexts();
        return ResponseEntity.ok(texts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TextShareDTO> updateSharedText(@PathVariable String id, @RequestBody TextShareDTO textShareDTO) {
        TextShareDTO updatedText = textShareService.updateText(id, textShareDTO);
        return ResponseEntity.ok(updatedText);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSharedText(@PathVariable String id) {
        textShareService.deleteText(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/validate-link")
    public ResponseEntity<ValidateLinkDTO> validateCustomLink(@Valid @RequestBody ValidateLinkDTO requestDTO) {
        ValidateLinkDTO resp = textShareService.validateCustomLink(requestDTO);
        return ResponseEntity.ok(resp);
    }

}
