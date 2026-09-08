package com.scrumboard.api.model;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ProjectRequest {
    @NotBlank(message = "Project name is required")
    private String name;
    private String description;
}
