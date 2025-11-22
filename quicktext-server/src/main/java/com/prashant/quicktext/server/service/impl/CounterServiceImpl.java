package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.dto.CounterDTO;
import com.prashant.quicktext.server.entity.Counter;
import com.prashant.quicktext.server.repository.CounterRepository;
import com.prashant.quicktext.server.service.CounterService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@AllArgsConstructor
public class CounterServiceImpl implements CounterService {

    private final ModelMapper modelMapper;
    private final CounterRepository counterRepo;

    private static final String TEXTSHARE_COUNTER_ID = "textshare-count";

    @Override
    public CounterDTO getTextShareCount() {
        Counter counter = counterRepo.findById(TEXTSHARE_COUNTER_ID)
                .orElse(new Counter(TEXTSHARE_COUNTER_ID, 0L));

        return modelMapper.map(counter, CounterDTO.class);
    }

    @Transactional
    @Override
    public void incrementCounter() {
        Counter counter = counterRepo.findById(TEXTSHARE_COUNTER_ID)
                .orElse(new Counter(TEXTSHARE_COUNTER_ID, 0L));

        counter.setValue(counter.getValue() + 1);
        counterRepo.save(counter);
    }
}
