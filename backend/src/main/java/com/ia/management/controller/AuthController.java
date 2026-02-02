package com.ia.management.controller;

import com.ia.management.model.LoginRequest;
import com.ia.management.model.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String id = request.getUserId().toUpperCase();
        String password = request.getPassword();

        if (password == null || password.length() < 3) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Password must be at least 3 characters", null, null, null));
        }

        String role = "";
        String name = "";

        if (id.startsWith("S") || id.startsWith("DIP")) {
            role = "student";
            name = "Student User";
        } else if (id.startsWith("F") || id.startsWith("FAC")) {
            role = "faculty";
            name = "Faculty Member";
        } else if (id.startsWith("H") || id.startsWith("HOD")) {
            role = "hod";
            name = "Head of Department";
        } else if (id.startsWith("P") || id.equals("ADMIN") || id.startsWith("PRIN")) {
            role = "principal";
            name = "Principal";
        } else {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Invalid User ID", null, null, null));
        }

        // Mock token for now
        String token = "mock-jwt-token-" + id;
        return ResponseEntity.ok(new LoginResponse(true, "Login Successful", role, name, token));
    }
}
