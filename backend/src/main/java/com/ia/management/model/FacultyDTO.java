package com.ia.management.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FacultyDTO {
    private Long id;
    private String username;
    private String fullName;
    private String department;
    private String designation; // e.g. "Assistant Professor"
    private List<String> subjects; // List of subject names
    private String email;
}
