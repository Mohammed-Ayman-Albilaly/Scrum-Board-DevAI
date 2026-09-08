package com.scrumboard.api.model;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Data
public class SprintRequest {
    @NotBlank(message = "Sprint name is required")
    private String name;
    private String goal;
    private LocalDate startDate;
    private LocalDate endDate;
}
