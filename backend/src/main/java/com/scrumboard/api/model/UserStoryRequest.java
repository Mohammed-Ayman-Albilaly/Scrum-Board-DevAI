package com.scrumboard.api.model;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class UserStoryRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private Integer storyPoints;
    private Integer priority;
    private UserStory.StoryStatus status;
}
