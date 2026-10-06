package com.gym.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/health", "/api/keep-alive"})
@CrossOrigin(origins = "*")
public class KeepAliveController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "ApexFit AI Backend");
        status.put("version", "1.0.0");
        status.put("timestamp", LocalDateTime.now());

        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            status.put("database", "UP");
            status.put("neonPostgres", "CONNECTED");
            status.put("status", "HEALTHY");
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            status.put("database", "DOWN");
            status.put("status", "UNHEALTHY");
            status.put("error", e.getMessage());
            return ResponseEntity.status(503).body(status);
        }
    }
}
