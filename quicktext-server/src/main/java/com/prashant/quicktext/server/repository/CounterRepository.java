package com.prashant.quicktext.server.repository;

import com.prashant.quicktext.server.entity.Counter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CounterRepository extends MongoRepository<Counter,String> {
}
