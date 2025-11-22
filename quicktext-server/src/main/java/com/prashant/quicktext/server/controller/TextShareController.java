package com.prashant.quicktext.server.controller;

import com.prashant.quicktext.server.dto.CounterDTO;
import com.prashant.quicktext.server.dto.TextShareDTO;
import com.prashant.quicktext.server.dto.ValidateLinkDTO;
import com.prashant.quicktext.server.service.CounterService;
import com.prashant.quicktext.server.service.TextShareService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class TextShareController {

    private final TextShareService textShareService;
    private final CounterService counterService;

    @PostMapping("/create")
    public ResponseEntity<TextShareDTO> createSharedText(@Valid  @RequestBody TextShareDTO textShareDTO) {
        TextShareDTO createdText = textShareService.createText(textShareDTO);
        return new ResponseEntity<>(createdText, HttpStatus.CREATED);
    }

    @GetMapping("/{link}")
    public ResponseEntity<TextShareDTO> getSharedText(@PathVariable String link) {
        TextShareDTO text = textShareService.getTextById(link);
        return ResponseEntity.ok(text);
    }

    @GetMapping("/texts")
    public ResponseEntity<List<TextShareDTO>> getAllSharedTexts() {
        List<TextShareDTO> texts = textShareService.getAllTexts();
        return ResponseEntity.ok(texts);
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

    @GetMapping("/count")
    public ResponseEntity<CounterDTO> getTextShareCount() {
        CounterDTO counter = counterService.getTextShareCount();
        return ResponseEntity.ok(counter);
    }

}
