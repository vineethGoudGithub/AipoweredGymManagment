package com.gym.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/keep-alive")
@CrossOrigin(origins = "*")
public class KeepAliveController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public String keepAlive() {
        try {
            // A simple query to wake up the database and keep the connection pool active
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return "Database is awake and connection is active! " + java.time.LocalDateTime.now();
        } catch (Exception e) {
            return "Error connecting to database: " + e.getMessage();
        }
    }
}
