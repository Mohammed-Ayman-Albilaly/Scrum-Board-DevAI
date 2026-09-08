package com.scrumboard.api.controller;

import com.scrumboard.api.model.*;
import com.scrumboard.api.service.UserStoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/stories")
@RequiredArgsConstructor
public class UserStoryController {
    private final UserStoryService storyService;

    @GetMapping
    public ResponseEntity<List<UserStory>> getStories(@PathVariable UUID projectId) {
        return ResponseEntity.ok(storyService.getStoriesForProject(projectId));
    }

    @PostMapping
    public ResponseEntity<?> createStory(@PathVariable UUID projectId, @Valid @RequestBody UserStoryRequest request) {
        UserStory story = storyService.createStory(projectId, request);
        return ResponseEntity.ok(story);
    }

    @PutMapping("/{storyId}")
    public ResponseEntity<?> updateStory(@PathVariable UUID projectId, @PathVariable UUID storyId, @Valid @RequestBody UserStoryRequest request) {
        UserStory story = storyService.updateStory(storyId, request);
        return ResponseEntity.ok(story);
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<?> deleteStory(@PathVariable UUID projectId, @PathVariable UUID storyId) {
        storyService.deleteStory(storyId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{storyId}/refine")
    public ResponseEntity<?> refineStory(@PathVariable UUID projectId, @PathVariable UUID storyId) {
        UserStory story = storyService.refineStory(storyId);
        return ResponseEntity.ok(story);
    }
}
