package com.scrumboard.api.security;

import com.scrumboard.api.repository.ProjectMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProjectSecurityChecker {
    private final ProjectMemberRepository projectMemberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public boolean isMember(UUID projectId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // In a real scenario, we'd resolve username to UUID via UserRepository
        // For this implementation, we'll assume the username is the ID or we look it up
        return projectMemberRepository.findByProjectId(projectId).stream()
                .anyMatch(m -> m.getUser().getUsername().equals(username));
    }

    public boolean hasRole(UUID projectId, String requiredRole) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return projectMemberRepository.findByProjectId(projectId).stream()
                .anyMatch(m -> m.getUser().getUsername().equals(username) 
                               && m.getRole().name().equals(requiredRole));
    }
}
