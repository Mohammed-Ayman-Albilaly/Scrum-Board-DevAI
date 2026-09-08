package com.scrumboard.api.service;

import com.scrumboard.api.model.*;
import com.scrumboard.api.repository.ProjectRepository;
import com.scrumboard.api.repository.SprintRepository;
import com.scrumboard.api.repository.UserStoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SprintService {
    private final SprintRepository sprintRepository;
    private final UserStoryRepository storyRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public Sprint createSprint(SprintRequest request, UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found");
        }

        // Close existing open sprint if any
        sprintRepository.findFirstByIsClosedFalse().ifPresent(s -> {
            s.setClosed(true);
            sprintRepository.save(s);
        });

        Sprint sprint = Sprint.builder()
                .name(request.getName())
                .goal(request.getGoal())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isClosed(false)
                .build();

        return sprintRepository.save(sprint);
    }

    public Sprint getActiveSprint() {
        return sprintRepository.findFirstByIsClosedFalse()
                .orElseThrow(() -> new RuntimeException("No active sprint found"));
    }

    @Transactional
    public UserStory commitStoryToSprint(UUID storyId, UUID sprintId) {
        UserStory story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new RuntimeException("Sprint not found"));

        if (sprint.isClosed()) {
            throw new RuntimeException("Cannot add stories to a closed sprint");
        }

        if (story.getStatus() != UserStory.StoryStatus.READY) {
            throw new RuntimeException("Only READY stories can be committed to a sprint");
        }

        story.setCurrentSprintId(sprint.getId());
        story.setColumnStatus(UserStory.ColumnStatus.SPRINT_BACKLOG);
        
        return storyRepository.save(story);
    }

    public Integer calculateCommittedPoints(UUID sprintId) {
        return storyRepository.findByCurrentSprintId(sprintId).stream()
                .mapToInt(UserStory::getStoryPoints)
                .sum();
    }
}
