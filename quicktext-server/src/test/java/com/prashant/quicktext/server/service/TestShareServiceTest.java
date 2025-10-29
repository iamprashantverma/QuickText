package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.dto.TextShareDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestShareServiceTest {

    @Autowired
    TextShareService textShareService;

    @Test
    public void createText() {
        TextShareDTO shareDTO = TextShareDTO.builder()
                .content("Hello ji, this is the first Text")
                .build();
        System.out.println(textShareService.createText(shareDTO));
    }

    @Test
    public void getText(){
        String textId = "68fddc9aec0fd9f5aea9c54f";
        TextShareDTO textShareDTO = textShareService.getTextById(textId);
    }

    @Test
    public void deleteText() {
        String textId = "68fddc9aec0fd9f5aea9c54f";
        textShareService.deleteText(textId);
    }



}
