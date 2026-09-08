package com.scrumboard.api.controller;

import com.scrumboard.api.model.*;
import com.scrumboard.api.service.SprintService;
import com.scrumboard.api.security.ProjectSecurityChecker;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

import java.util.UUID;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
public class SprintController {
    private final SprintService sprintService;
    private final ProjectSecurityChecker securityChecker;

    @PostMapping
    public ResponseEntity<?> createSprint(@Valid @RequestBody SprintRequest request, @RequestParam UUID projectId) {
        if (!securityChecker.hasRole(projectId, "SCRUM_MASTER")) {
            throw new AccessDeniedException("Only Scrum Masters can create sprints");
        }
        Sprint sprint = sprintService.createSprint(request, projectId);
        return ResponseEntity.ok(sprint);
    }

    @GetMapping("/active")
    public ResponseEntity<Sprint> getActiveSprint() {
        // In a real scenario, we would pass projectId and verify membership
        return ResponseEntity.ok(sprintService.getActiveSprint());
    }

    @PostMapping("/{storyId}/commit")
    public ResponseEntity<?> commitStory(@PathVariable UUID storyId, @RequestParam UUID sprintId, @RequestParam UUID projectId) {
        if (!securityChecker.hasRole(projectId, "PRODUCT_OWNER")) {
            throw new AccessDeniedException("Only Product Owners can commit stories to a sprint");
        }
        UserStory story = sprintService.commitStoryToSprint(storyId, sprintId);
        return ResponseEntity.ok(story);
    }

    @GetMapping("/active/points")
    public ResponseEntity<Integer> getCommittedPoints() {
        Sprint active = sprintService.getActiveSprint();
        return ResponseEntity.ok(sprintService.calculateCommittedPoints(active.getId()));
    }
}
