package com.prashant.quicktext.server;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableMongoAuditing
@SpringBootApplication
@EnableScheduling
@Slf4j
public class QuickTextServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(QuickTextServerApplication.class, args);
		log.info(" QuickText Application Is Running");
	}
}
