package com.scrumboard.api.controller;

import com.scrumboard.api.model.*;
import com.scrumboard.api.service.ProjectService;
import com.scrumboard.api.security.ProjectSecurityChecker;
import com.scrumboard.api.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final ProjectSecurityChecker securityChecker;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody ProjectRequest request) {
        // Security: Get authenticated user from context
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Resolve username to actual User ID
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
        
        Project project = projectService.createProject(request, user.getId());
        return ResponseEntity.ok(project);
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));
                
        return ResponseEntity.ok(projectService.getProjectsForUser(user.getId()));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMember>> getMembers(@PathVariable UUID projectId) {
        if (!securityChecker.isMember(projectId)) {
            throw new AccessDeniedException("You are not a member of this project");
        }
        return ResponseEntity.ok(projectService.getProjectMembers(projectId));
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<?> addMember(@PathVariable UUID projectId, @Valid @RequestBody MemberAssignmentRequest request) {
        if (!securityChecker.hasRole(projectId, "PRODUCT_OWNER")) {
            throw new AccessDeniedException("Only Product Owners can add members");
        }
        ProjectMember member = projectService.assignMember(projectId, request);
        return ResponseEntity.ok(member);
    }

    @DeleteMapping("/members/{memberId}")
    public ResponseEntity<?> removeMember(@PathVariable UUID memberId) {
        // Logic to verify that the remover is a PO or the member themselves
        projectService.removeMember(memberId);
        return ResponseEntity.ok().build();
    }
}
