package com.gym.controller;

import com.gym.model.Gym;
import com.gym.service.GymService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gyms")
@CrossOrigin(origins = "*") // Allow all origins like Vercel and localhost
public class GymController {

    @Autowired
    private GymService gymService;

    @GetMapping
    public List<Gym> getAllGyms(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return gymService.searchGyms(search);
        }
        return gymService.getAllGyms();
    }

    @PostMapping
    public Gym createGym(@RequestBody Gym gym) {
        return gymService.saveGym(gym);
    }

    @GetMapping("/{id}")
    public Gym getGymById(@PathVariable UUID id) {
        return gymService.getGymById(id);
    }

    @GetMapping("/{id}/members")
    public List<com.gym.model.GymMember> getMembersByGymId(@PathVariable UUID id) {
        return gymService.getMembersByGymId(id);
    }

    @PostMapping("/{id}/members")
    public com.gym.model.GymMember joinCommunity(@PathVariable UUID id, @RequestBody com.gym.model.GymMember member) {
        member.setGymId(id);
        return gymService.saveMember(member);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public org.springframework.http.ResponseEntity<Void> leaveCommunity(@PathVariable UUID id, @PathVariable UUID userId) {
        gymService.leaveCommunity(id, userId);
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
