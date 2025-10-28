package com.prashant.quicktext.server.service.impl;

import com.prashant.quicktext.server.entity.ArchivedText;
import com.prashant.quicktext.server.entity.TextShare;
import com.prashant.quicktext.server.repository.ArchivedTextRepository;
import com.prashant.quicktext.server.repository.TextShareRepository;
import com.prashant.quicktext.server.service.CleanupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupServiceImpl implements CleanupService {

    private final TextShareRepository textShareRepository;
    private final ArchivedTextRepository archivedTextRepository;
    private final ModelMapper modelMapper;

    /**
     * Scheduled task that runs every 5 minutes to archive and delete expired TextShare records.
     */
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void deleteExpiredRecords() {
        LocalDateTime now = LocalDateTime.now();
        log.info("Starting cleanup of expired TextShare records at {}", now);

        List<TextShare> expiredTexts = textShareRepository.findByExpirationTimeBefore(now);

        if (expiredTexts.isEmpty()) {
            log.info("No expired records found at {}", now);
            return;
        }

        List<ArchivedText> archivedTexts = expiredTexts.stream()
                .map(text -> {
                    ArchivedText archived = modelMapper.map(text, ArchivedText.class);
                    archived.setId(null);
                    archived.setDeleteReason("Expired");
                    return archived;
                })
                .collect(Collectors.toList());

        archivedTextRepository.saveAll(archivedTexts);

        textShareRepository.deleteAll(expiredTexts);

        log.info("Cleanup complete — Archived & deleted {} expired texts at {}", expiredTexts.size(), now);
    }
}
