package com.scrumboard.api.service;

import com.scrumboard.api.model.*;
import com.scrumboard.api.repository.ProjectRepository;
import com.scrumboard.api.repository.UserStoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserStoryService {
    private final UserStoryRepository storyRepository;
    private final ProjectRepository projectRepository;

    public List<UserStory> getStoriesForProject(UUID projectId) {
        return storyRepository.findByProjectIdOrderByPriorityAsc(projectId);
    }

    @Transactional
    public UserStory createStory(UUID projectId, UserStoryRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        UserStory story = UserStory.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .storyPoints(request.getStoryPoints())
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : UserStory.StoryStatus.UNREFINED)
                .columnStatus(UserStory.ColumnStatus.SPRINT_BACKLOG)
                .build();

        return storyRepository.save(story);
    }

    @Transactional
    public UserStory updateStory(UUID storyId, UserStoryRequest request) {
        UserStory story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        story.setTitle(request.getTitle());
        story.setDescription(request.getDescription());
        story.setStoryPoints(request.getStoryPoints());
        story.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            story.setStatus(request.getStatus());
        }

        return storyRepository.save(story);
    }

    @Transactional
    public void deleteStory(UUID storyId) {
        storyRepository.deleteById(storyId);
    }

    @Transactional
    public UserStory refineStory(UUID storyId) {
        UserStory story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
        story.setStatus(UserStory.StoryStatus.READY);
        return storyRepository.save(story);
    }

    @Transactional
    public UserStory transitionStory(UUID storyId, UserStory.ColumnStatus newStatus) {
        UserStory story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        story.setColumnStatus(newStatus);
        return storyRepository.save(story);
    }
}
