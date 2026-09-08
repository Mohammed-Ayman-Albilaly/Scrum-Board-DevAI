package com.scrumboard.api.repository;

import com.scrumboard.api.model.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, UUID> {
    List<UserStory> findByProjectIdOrderByPriorityAsc(UUID projectId);
    List<UserStory> findByCurrentSprintId(UUID sprintId);
}
