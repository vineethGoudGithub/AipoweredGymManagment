package com.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gym_attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "gym_name")
    private String gymName;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime = LocalDateTime.now();

    @Column(name = "session_notes")
    private String sessionNotes;
}
