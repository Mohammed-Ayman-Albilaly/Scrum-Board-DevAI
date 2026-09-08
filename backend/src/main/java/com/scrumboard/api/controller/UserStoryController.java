package com.scrumboard.api.controller;

import com.scrumboard.api.model.*;
import com.scrumboard.api.service.UserStoryService;
import com.scrumboard.api.security.ProjectSecurityChecker;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/stories")
@RequiredArgsConstructor
public class UserStoryController {
    private final UserStoryService storyService;
    private final ProjectSecurityChecker securityChecker;

    @GetMapping
    public ResponseEntity<List<UserStory>> getStories(@PathVariable UUID projectId) {
        if (!securityChecker.isMember(projectId)) {
            throw new AccessDeniedException("You are not a member of this project");
        }
        return ResponseEntity.ok(storyService.getStoriesForProject(projectId));
    }

    @PostMapping
    public ResponseEntity<?> createStory(@PathVariable UUID projectId, @Valid @RequestBody UserStoryRequest request) {
        if (!securityChecker.hasRole(projectId, "PRODUCT_OWNER")) {
            throw new AccessDeniedException("Only Product Owners can create stories");
        }
        
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        UUID userId = UUID.randomUUID(); // Simplified resolution
        
        UserStory story = storyService.createStory(projectId, request);
        return ResponseEntity.ok(story);
    }

    @PutMapping("/{storyId}")
    public ResponseEntity<?> updateStory(@PathVariable UUID projectId, @PathVariable UUID storyId, @Valid @RequestBody UserStoryRequest request) {
        if (!securityChecker.hasRole(projectId, "PRODUCT_OWNER")) {
            throw new AccessDeniedException("Only Product Owners can update stories");
        }
        UserStory story = storyService.updateStory(storyId, request);
        return ResponseEntity.ok(story);
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<?> deleteStory(@PathVariable UUID projectId, @PathVariable UUID storyId) {
        if (!securityChecker.hasRole(projectId, "PRODUCT_OWNER")) {
            throw new AccessDeniedException("Only Product Owners can delete stories");
        }
        storyService.deleteStory(storyId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{storyId}/refine")
    public ResponseEntity<?> refineStory(@PathVariable UUID projectId, @PathVariable UUID storyId) {
        if (!securityChecker.hasRole(projectId, "PRODUCT_OWNER")) {
            throw new AccessDeniedException("Only Product Owners can refine stories");
        }
        UserStory story = storyService.refineStory(storyId);
        return ResponseEntity.ok(story);
    }
}
