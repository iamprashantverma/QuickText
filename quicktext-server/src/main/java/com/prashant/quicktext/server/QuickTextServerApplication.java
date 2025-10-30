package com.prashant.quicktext.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableMongoAuditing
@SpringBootApplication
@EnableScheduling
public class QuickTextServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(QuickTextServerApplication.class, args);
		System.out.println("QuickText Application Is Running");

	}

}
