package com.gym.repository;

import com.gym.model.GymMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface GymMemberRepository extends JpaRepository<GymMember, UUID> {
    List<GymMember> findByGymId(UUID gymId);
    void deleteByGymIdAndUserId(UUID gymId, UUID userId);
}
