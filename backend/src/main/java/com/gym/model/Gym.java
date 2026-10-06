package com.gym.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "gyms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Gym {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private java.util.UUID id;

    @Column(nullable = false)
    private String name;

    private Double lat;
    private Double lng;

    private String address;
    private Double rating;

    @Column(name = "open_now")
    private Boolean openNow;

    private String trainer;
}
