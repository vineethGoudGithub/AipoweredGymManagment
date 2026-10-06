package com.gym.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class DatabaseKeepAliveRobot {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Knocks the database door every 10 minutes (600,000 milliseconds)
     * to prevent the database from going into standby mode.
     */
    @Scheduled(fixedRate = 600000)
    public void knockDatabaseDoor() {
        try {
            log.info("🤖 Robot is knocking the database door at: {}", LocalDateTime.now());
            
            // Simple query to wake up the DB
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            
            if (result != null && result == 1) {
                log.info("✅ Database replied: 'Who is it? Oh, it's just the robot. I'm awake!'");
            } else {
                log.warn("❓ Database didn't give the expected reply (1), but connection seems alive.");
            }
        } catch (Exception e) {
            log.error("❌ Robot failed to knock the database door: {}", e.getMessage());
        }
    }
}
