package com.gym.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    
    private String name;
    private String email;
    private String role;
    private String fitnessGoal;
    private String experience;
    
    private String username;
    private Integer age;
    private String bio;
    private String timing;
    private String homeGym;
    private String weeklySchedule;
    
    private LocalDateTime lastLogin;
}
