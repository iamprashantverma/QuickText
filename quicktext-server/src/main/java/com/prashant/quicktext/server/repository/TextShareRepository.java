package com.prashant.quicktext.server.repository;

import com.prashant.quicktext.server.entity.TextShare;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Repository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TextShareRepository extends MongoRepository<TextShare,String> {

    Optional<TextShare> findByLink(String link);
    Boolean existsByLink(String generatedLink);
    List<TextShare> findByExpirationTimeBefore(LocalDateTime now);
}
