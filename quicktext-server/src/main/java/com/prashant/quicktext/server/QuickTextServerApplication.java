package com.prashant.quicktext.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@EnableMongoAuditing
@SpringBootApplication
public class QuickTextServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickTextServerApplication.class, args);
		System.out.println("QuickText Application Is Running");
	}

}
