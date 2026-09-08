package com.scrumboard.api.model;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Data
public class MemberAssignmentRequest {
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Role is required")
    private String role;
}
