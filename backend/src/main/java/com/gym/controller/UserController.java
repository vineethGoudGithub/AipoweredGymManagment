package com.gym.controller;

import com.gym.model.User;
import com.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allow all origins like Vercel and localhost
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/email/{email}")
    public org.springframework.http.ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<User> getUserById(@PathVariable java.util.UUID id) {
        return userRepository.findById(id)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @PostMapping("/login-or-register")
    public User loginOrRegister(@RequestBody User requestUser) {
        User user = userRepository.findByEmail(requestUser.getEmail())
                                  .orElse(new User());
        
        user.setEmail(requestUser.getEmail());
        if (requestUser.getName() != null) user.setName(requestUser.getName());
        if (requestUser.getRole() != null) user.setRole(requestUser.getRole());
        if (requestUser.getFitnessGoal() != null) user.setFitnessGoal(requestUser.getFitnessGoal());
        if (requestUser.getExperience() != null) user.setExperience(requestUser.getExperience());
        
        if (requestUser.getUsername() != null) user.setUsername(requestUser.getUsername());
        if (requestUser.getAge() != null) user.setAge(requestUser.getAge());
        if (requestUser.getBio() != null) user.setBio(requestUser.getBio());
        if (requestUser.getTiming() != null) user.setTiming(requestUser.getTiming());
        if (requestUser.getHomeGym() != null) user.setHomeGym(requestUser.getHomeGym());
        if (requestUser.getWeeklySchedule() != null) user.setWeeklySchedule(requestUser.getWeeklySchedule());
        
        user.setLastLogin(LocalDateTime.now());
        
        return userRepository.save(user);
    }
}
