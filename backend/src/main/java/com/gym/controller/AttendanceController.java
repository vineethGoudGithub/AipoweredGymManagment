package com.gym.controller;

import com.gym.model.AttendanceRecord;
import com.gym.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping("/user/{email}")
    public ResponseEntity<Map<String, Object>> getUserAttendance(@PathVariable String email) {
        List<AttendanceRecord> records = attendanceRepository.findByUserEmailOrderByCheckInTimeDesc(email);
        long count = attendanceRepository.countByUserEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("records", records);
        response.put("totalCheckIns", count);
        response.put("streakDays", Math.min(count, 14)); // Calculated streak

        return ResponseEntity.ok(response);
    }

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceRecord> checkIn(@RequestBody AttendanceRecord record) {
        if (record.getCheckInTime() == null) {
            record.setCheckInTime(LocalDateTime.now());
        }
        AttendanceRecord saved = attendanceRepository.save(record);
        return ResponseEntity.ok(saved);
    }
}
