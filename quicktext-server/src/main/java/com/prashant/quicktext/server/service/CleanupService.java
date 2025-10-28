package com.prashant.quicktext.server.service;

import com.prashant.quicktext.server.repository.TextShareRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupService {

    private final TextShareRepository textShareRepository;

    /**
     * Scheduled task that runs every 60 seconds to delete expired TextShare records.
     */
    @Scheduled(fixedRate =5 * 60 * 1000)
    public void deleteExpiredRecords() {
        LocalDateTime now = LocalDateTime.now();

        log.info(" Starting cleanup of expired TextShare records at {}", now);

        long beforeCount = textShareRepository.count();
        int deletedCount = textShareRepository.deleteByExpirationTimeBefore(now);
        long afterCount = textShareRepository.count();

        if (deletedCount > 0) {
            log.info(" Cleanup complete at {} — Deleted {} expired records. Remaining: {}", now, deletedCount, afterCount);
        } else {
            log.info(" No expired records found at {}", now);
        }
    }
}
