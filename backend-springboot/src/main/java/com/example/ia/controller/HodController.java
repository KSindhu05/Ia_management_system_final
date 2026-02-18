package com.example.ia.controller;

import com.example.ia.entity.User;
import com.example.ia.repository.StudentRepository;
import com.example.ia.repository.SubjectRepository;
import com.example.ia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/hod")
public class HodController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/overview")
    @PreAuthorize("hasRole('HOD') or hasRole('PRINCIPAL')")
    public ResponseEntity<?> getOverview(@RequestParam String department) {
        long totalStudents = studentRepository.countByDepartment(department);
        long facultyCount = userRepository.countByRoleAndDepartment("FACULTY", department);

        // Calculate dept average from marks if available
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("facultyCount", facultyCount);

        Map<String, Object> data = new HashMap<>();
        data.put("stats", stats);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/faculty")
    @PreAuthorize("hasRole('HOD') or hasRole('PRINCIPAL')")
    public List<User> getFaculty(@RequestParam String department) {
        return userRepository.findByRoleAndDepartment("FACULTY", department);
    }

    @PostMapping("/faculty")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> createFaculty(@RequestBody User facultyData) {
        if (userRepository.existsByUsername(facultyData.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        User faculty = new User();
        faculty.setUsername(facultyData.getUsername());
        faculty.setFullName(facultyData.getFullName());
        faculty.setEmail(facultyData.getEmail());
        faculty.setDepartment(facultyData.getDepartment());
        faculty.setDesignation(facultyData.getDesignation());
        faculty.setSemester(facultyData.getSemester());
        faculty.setSection(facultyData.getSection());
        faculty.setSubjects(facultyData.getSubjects());
        faculty.setRole("FACULTY");
        faculty.setPassword(passwordEncoder.encode("password"));
        userRepository.save(faculty);
        return ResponseEntity.ok(faculty);
    }

    @PutMapping("/faculty/{id}")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> updateFaculty(@PathVariable Long id, @RequestBody User facultyData) {
        return userRepository.findById(id).map(faculty -> {
            if (facultyData.getFullName() != null)
                faculty.setFullName(facultyData.getFullName());
            if (facultyData.getEmail() != null)
                faculty.setEmail(facultyData.getEmail());
            if (facultyData.getDesignation() != null)
                faculty.setDesignation(facultyData.getDesignation());
            if (facultyData.getSemester() != null)
                faculty.setSemester(facultyData.getSemester());
            if (facultyData.getSection() != null)
                faculty.setSection(facultyData.getSection());
            if (facultyData.getSubjects() != null)
                faculty.setSubjects(facultyData.getSubjects());
            if (facultyData.getDepartment() != null)
                faculty.setDepartment(facultyData.getDepartment());
            userRepository.save(faculty);
            return ResponseEntity.ok(faculty);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/faculty/{id}")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> deleteFaculty(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Faculty deleted"));
        }
        return ResponseEntity.notFound().build();
    }

    // ========== STUDENT MANAGEMENT ==========

    @PostMapping("/students")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> createStudent(@RequestBody Map<String, String> data) {
        String regNo = data.get("regNo");
        String name = data.get("name");
        String department = data.get("department");
        String semester = data.getOrDefault("semester", "1");
        String section = data.getOrDefault("section", "A");
        String email = data.getOrDefault("email", "");
        String phone = data.getOrDefault("phone", "");
        String parentPhone = data.getOrDefault("parentPhone", "");
        String password = data.getOrDefault("password", "password123");

        if (regNo == null || regNo.isBlank() || name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reg No and Name are required"));
        }

        // Check for duplicate regNo in students table
        if (studentRepository.findByRegNo(regNo).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Student with this Reg No already exists"));
        }

        // Check for duplicate username in users table
        if (userRepository.existsByUsername(regNo)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username (Reg No) already exists in users"));
        }

        try {
            // 1. Create User entity (for login)
            User studentUser = new User();
            studentUser.setUsername(regNo);
            studentUser.setFullName(name);
            studentUser.setEmail(email);
            studentUser.setDepartment(department);
            studentUser.setRole("STUDENT");
            studentUser.setSemester(semester);
            studentUser.setSection(section);
            studentUser.setPassword(passwordEncoder.encode(password));
            userRepository.save(studentUser);

            // 2. Create Student entity (for academic data)
            com.example.ia.entity.Student student = new com.example.ia.entity.Student();
            student.setRegNo(regNo);
            student.setName(name);
            student.setDepartment(department);
            student.setSemester(Integer.parseInt(semester));
            student.setSection(section);
            student.setEmail(email);
            student.setPhone(phone);
            student.setParentPhone(parentPhone);
            studentRepository.save(student);

            java.util.HashMap<String, Object> response = new java.util.HashMap<>();
            response.put("message", "Student created successfully");
            response.put("studentId", student.getId());
            response.put("userId", studentUser.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error creating student: " + e.getMessage()));
        }
    }

    @DeleteMapping("/students/{regNo}")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> deleteStudent(@PathVariable String regNo) {
        var studentOpt = studentRepository.findByRegNo(regNo);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        studentRepository.delete(studentOpt.get());

        // Also delete the User login account
        var userOpt = userRepository.findByUsernameIgnoreCase(regNo);
        userOpt.ifPresent(userRepository::delete);

        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }

    // ========== CREDENTIAL MANAGEMENT ==========

    @PutMapping("/credentials/reset")
    @PreAuthorize("hasRole('HOD')")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String newPassword = data.get("newPassword");

        if (username == null || newPassword == null || newPassword.length() < 4) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Username and a password (min 4 chars) are required"));
        }

        User targetUser = userRepository.findByUsernameIgnoreCase(username).orElse(null);
        if (targetUser == null) {
            return ResponseEntity.notFound().build();
        }

        // Only allow resetting for STUDENT or FACULTY roles
        if (!"STUDENT".equals(targetUser.getRole()) && !"FACULTY".equals(targetUser.getRole())) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Can only reset credentials for students or faculty"));
        }

        targetUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(targetUser);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully for " + username));
    }
}
