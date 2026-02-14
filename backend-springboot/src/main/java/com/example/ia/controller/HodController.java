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
}
