package com.example.ia.controller;

import com.example.ia.entity.FacultyAssignmentRequest;
import com.example.ia.entity.Student;
import com.example.ia.entity.Subject;
import com.example.ia.entity.User;
import com.example.ia.payload.response.FacultyClassAnalytics;
import com.example.ia.repository.FacultyAssignmentRequestRepository;
import com.example.ia.repository.SubjectRepository;
import com.example.ia.repository.UserRepository;
import com.example.ia.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    FacultyService facultyService;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    FacultyAssignmentRequestRepository assignmentRequestRepository;

    @GetMapping("/my-subjects")
    @PreAuthorize("hasRole('FACULTY')")
    public List<Subject> getMySubjects() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return facultyService.getSubjectsForFaculty(username);
    }

    /**
     * Returns students filtered by the logged-in faculty's assigned sections.
     * Faculty's section field stores comma-separated sections, e.g. "A,B".
     * If no section is set, all students are returned (graceful fallback).
     */
    @GetMapping("/my-students")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<Student>> getMyStudents() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Student> students = facultyService.getStudentsForFaculty(username);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/analytics")
    public FacultyClassAnalytics getAnalytics() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return facultyService.getAnalytics(username);
    }

    // ========== CROSS-DEPARTMENT ASSIGNMENT ENDPOINTS ==========

    /**
     * Returns all distinct departments from the subjects table.
     * Faculty uses this to pick a target department for cross-dept assignment.
     */
    @GetMapping("/all-departments")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<Subject> allSubjects = subjectRepository.findAll();
        List<String> departments = allSubjects.stream()
                .map(Subject::getDepartment)
                .filter(d -> d != null && !d.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        return ResponseEntity.ok(departments);
    }

    /**
     * Returns subjects for a given department.
     * Faculty uses this to select which subjects they want to teach.
     */
    @GetMapping("/department-subjects")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<Subject>> getDepartmentSubjects(@RequestParam String department) {
        List<Subject> subjects = subjectRepository.findByDepartment(department);
        return ResponseEntity.ok(subjects);
    }

    /**
     * Faculty submits a request to teach subjects in another department.
     * Body: { targetDepartment, subjects (CSV), sections (CSV), semester }
     */
    @PostMapping("/assignment-request")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<?> createAssignmentRequest(@RequestBody Map<String, String> data) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User faculty = userRepository.findByUsername(username).orElse(null);
        if (faculty == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Faculty user not found"));
        }

        String targetDept = data.get("targetDepartment");
        String subjects = data.get("subjects");
        String sections = data.getOrDefault("sections", "");
        String semester = data.getOrDefault("semester", "");

        if (targetDept == null || targetDept.isBlank() || subjects == null || subjects.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Department and subjects are required"));
        }

        // Check for duplicate pending request for same dept
        List<FacultyAssignmentRequest> existing = assignmentRequestRepository
                .findByFacultyIdAndTargetDepartmentAndStatus(faculty.getId(), targetDept, "PENDING");
        if (!existing.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "You already have a pending request for " + targetDept
                            + " department. Please wait for HOD approval."));
        }

        FacultyAssignmentRequest request = new FacultyAssignmentRequest();
        request.setFacultyId(faculty.getId());
        request.setFacultyName(faculty.getFullName());
        request.setTargetDepartment(targetDept);
        request.setSubjects(subjects);
        request.setSections(sections);
        request.setSemester(semester);
        request.setStatus("PENDING");
        request.setRequestDate(LocalDateTime.now());

        assignmentRequestRepository.save(request);

        return ResponseEntity
                .ok(Map.of("message", "Assignment request submitted successfully. Waiting for HOD approval."));
    }

    /**
     * Faculty views all their assignment requests and their statuses.
     */
    @GetMapping("/my-assignment-requests")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<FacultyAssignmentRequest>> getMyAssignmentRequests() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User faculty = userRepository.findByUsername(username).orElse(null);
        if (faculty == null) {
            return ResponseEntity.ok(List.of());
        }
        List<FacultyAssignmentRequest> requests = assignmentRequestRepository.findByFacultyId(faculty.getId());
        return ResponseEntity.ok(requests);
    }
}
