package com.ia.management.model;

import lombok.Data;

@Data
public class CreateFacultyRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String department;
    private String designation;
}
