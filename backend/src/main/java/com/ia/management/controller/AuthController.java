package com.ia.management.controller;

import com.ia.management.model.LoginRequest;
import com.ia.management.model.LoginResponse;
import com.ia.management.model.User;
import com.ia.management.repository.UserRepository;
import com.ia.management.security.JwtUtils;
import com.ia.management.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok("pong");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new LoginResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    roles.get(0))); // Assuming single role
        } catch (Exception e) {
            e.printStackTrace(); // Log to server console
            return ResponseEntity.status(401).body("Auth Failed: " + e.getMessage());
        }
    }

    @PostMapping("/register") // For manual testing/seeding via API if needed
    public ResponseEntity<?> registerUser(@RequestBody LoginRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(User.Role.STUDENT); // Default to Student for now

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String username, @RequestParam String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(encoder.encode(password));
        userRepository.save(user);
        return ResponseEntity.ok("Password reset successfully");
    }
}
