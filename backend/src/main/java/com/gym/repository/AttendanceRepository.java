package com.gym.repository;

import com.gym.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, UUID> {
    List<AttendanceRecord> findByUserEmailOrderByCheckInTimeDesc(String userEmail);
    long countByUserEmail(String userEmail);
}
