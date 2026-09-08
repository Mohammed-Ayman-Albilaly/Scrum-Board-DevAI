package com.scrumboard.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "sprints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sprint {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @jakarta.validation.constraints.NotBlank
    private String name;

    private String goal;
    private LocalDate startDate;
    private LocalDate endDate;
    
    @Builder.Default
    private boolean isClosed = false;
}
