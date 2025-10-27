package com.prashant.quicktext.server.repository;

import com.prashant.quicktext.server.entity.TextShare;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TextShareRepository extends MongoRepository<TextShare,String> {

    boolean existsByLink(String link);
}
