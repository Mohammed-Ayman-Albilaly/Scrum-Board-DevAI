package com.scrumboard.api.repository;

import com.scrumboard.api.model.Sprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, UUID> {
    Optional<Sprint> findFirstByIsClosedFalse();
}
