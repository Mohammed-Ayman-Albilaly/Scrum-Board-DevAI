package com.scrumboard.api.model;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStoryV2 {
    // This is a shim to add the currentSprintId which was missing in the first version
    private UUID currentSprintId;
}
