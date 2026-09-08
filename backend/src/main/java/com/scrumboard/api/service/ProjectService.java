package com.scrumboard.api.service;

import com.scrumboard.api.model.*;
import com.scrumboard.api.repository.ProjectMemberRepository;
import com.scrumboard.api.repository.ProjectRepository;
import com.scrumboard.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public Project createProject(ProjectRequest request, UUID creatorId) {
        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        
        Project savedProject = projectRepository.save(project);

        // Automatically assign creator as PRODUCT_OWNER
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProjectMember member = ProjectMember.builder()
                .project(savedProject)
                .user(creator)
                .role(ProjectMember.ProjectRole.PRODUCT_OWNER)
                .build();
        
        projectMemberRepository.save(member);
        
        return savedProject;
    }

    public List<Project> getProjectsForUser(UUID userId) {
        List<ProjectMember> memberships = projectMemberRepository.findByUserId(userId);
        return memberships.stream()
                .map(ProjectMember::getProject)
                .toList();
    }

    @Transactional
    public ProjectMember assignMember(UUID projectId, MemberAssignmentRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User user = userRepository.findById(UUID.fromString(request.getUserId()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (projectMemberRepository.existsByProjectIdAndUserId(projectId, user.getId())) {
            throw new RuntimeException("User is already a member of this project");
        }

        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(user)
                .role(ProjectMember.ProjectRole.valueOf(request.getRole()))
                .build();

        return projectMemberRepository.save(member);
    }

    public List<ProjectMember> getProjectMembers(UUID projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }

    @Transactional
    public void removeMember(UUID memberId) {
        projectMemberRepository.deleteById(memberId);
    }
}
