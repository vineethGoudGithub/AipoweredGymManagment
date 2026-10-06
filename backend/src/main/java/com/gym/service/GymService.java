package com.gym.service;

import com.gym.model.Gym;
import com.gym.repository.GymRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class GymService {

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private com.gym.repository.GymMemberRepository gymMemberRepository;

    public List<Gym> getAllGyms() {
        return gymRepository.findAll();
    }

    public com.gym.model.Gym getGymById(UUID id) {
        return gymRepository.findById(id).orElse(null);
    }

    public List<com.gym.model.GymMember> getMembersByGymId(UUID gymId) {
        return gymMemberRepository.findByGymId(gymId);
    }

    public com.gym.model.GymMember saveMember(com.gym.model.GymMember member) {
        return gymMemberRepository.save(member);
    }

    @org.springframework.transaction.annotation.Transactional
    public void leaveCommunity(UUID gymId, UUID userId) {
        gymMemberRepository.deleteByGymIdAndUserId(gymId, userId);
    }

    public List<Gym> searchGyms(String query) {
        return gymRepository.findByNameContainingIgnoreCase(query);
    }

    public Gym saveGym(Gym gym) {
        return gymRepository.save(gym);
    }
}
