package com.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private java.util.UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "muscle_group")
    private String muscleGroup;

    @Column(name = "secondary_muscles")
    private String secondaryMuscles;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "instructions", columnDefinition = "text[]")
    private List<String> instructions;

    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.ARRAY)
    @Column(name = "common_mistakes", columnDefinition = "text[]")
    private List<String> commonMistakes;

    @Column(name = "pro_tip", columnDefinition = "TEXT")
    private String proTip;

    @Column(name = "video_path")
    private String videoPath;
}
