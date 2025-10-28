package com.prashant.quicktext.server.repository;

import com.prashant.quicktext.server.entity.ArchivedText;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchivedTextRepository extends MongoRepository<ArchivedText,String> {
}
