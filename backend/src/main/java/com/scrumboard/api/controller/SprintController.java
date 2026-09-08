package com.scrumboard.api.controller;

import com.scrumboard.api.model.*;
import com.scrumboard.api.service.SprintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
public class SprintController {
    private final SprintService sprintService;

    @PostMapping
    public ResponseEntity<?> createSprint(@Valid @RequestBody SprintRequest request, @RequestParam UUID projectId) {
        Sprint sprint = sprintService.createSprint(request, projectId);
        return ResponseEntity.ok(sprint);
    }

    @GetMapping("/active")
    public ResponseEntity<Sprint> getActiveSprint() {
        return ResponseEntity.ok(sprintService.getActiveSprint());
    }

    @PostMapping("/{storyId}/commit")
    public ResponseEntity<?> commitStory(@PathVariable UUID storyId, @RequestParam UUID sprintId) {
        UserStory story = sprintService.commitStoryToSprint(storyId, sprintId);
        return ResponseEntity.ok(story);
    }

    @GetMapping("/active/points")
    public ResponseEntity<Integer> getCommittedPoints() {
        Sprint active = sprintService.getActiveSprint();
        return ResponseEntity.ok(sprintService.calculateCommittedPoints(active.getId()));
    }
}
