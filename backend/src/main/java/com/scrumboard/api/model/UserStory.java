package com.scrumboard.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "user_stories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @jakarta.validation.constraints.NotBlank
    private String title;

    @jakarta.validation.constraints.NotBlank
    private String description;

    private Integer storyPoints;
    private Integer priority;

    @Enumerated(EnumType.STRING)
    private StoryStatus status;

    @Enumerated(EnumType.STRING)
    private ColumnStatus columnStatus;

    private UUID currentSprintId;

    public enum StoryStatus {
        UNREFINED,
        READY
    }

    public enum ColumnStatus {
        SPRINT_BACKLOG,
        UNDER_DEVELOPMENT,
        UNDER_TESTING,
        DEPLOYED
    }
}
