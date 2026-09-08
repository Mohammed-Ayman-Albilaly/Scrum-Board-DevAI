package com.scrumboard.api.controller;

import com.scrumboard.api.model.*;
import com.scrumboard.api.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest request) {
        // In Security phase, we will replace this with actual authenticated user ID
        UUID mockUserId = UUID.randomUUID(); 
        Project project = projectService.createProject(request, mockUserId);
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects() {
        // Mock user ID for now
        UUID mockUserId = UUID.randomUUID();
        return ResponseEntity.ok(projectService.getProjectsForUser(mockUserId));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMember>> getMembers(@PathVariable UUID projectId) {
        return ResponseEntity.ok(projectService.getProjectMembers(projectId));
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<?> addMember(@PathVariable UUID projectId, @Valid @RequestBody MemberAssignmentRequest request) {
        ProjectMember member = projectService.assignMember(projectId, request);
        return ResponseEntity.ok(member);
    }

    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<?> removeMember(@PathVariable UUID memberId) {
        projectService.removeMember(memberId);
        return ResponseEntity.ok().build();
    }
}
