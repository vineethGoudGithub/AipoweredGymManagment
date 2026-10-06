package com.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "gym_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GymMember {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "gym_id")
    private UUID gymId;
    
    @Column(name = "user_id")
    private UUID userId;

    @Column(columnDefinition = "TEXT")
    private String name;
    @Column(columnDefinition = "TEXT")
    private String goal;
    @Column(columnDefinition = "TEXT")
    private String timing;
    
    @Column(name = "specific_time", columnDefinition = "TEXT")
    private String specificTime;

    @Column(columnDefinition = "TEXT")
    private String details;
}
