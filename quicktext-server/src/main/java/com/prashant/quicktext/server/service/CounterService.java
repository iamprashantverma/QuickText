package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.dto.CounterDTO;

public interface CounterService {

    CounterDTO getTextShareCount();

    void incrementCounter();
}
