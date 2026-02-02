package com.ia.management.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private String role;
    private String name;
    private String token; // For future JWT, can be empty now
}
