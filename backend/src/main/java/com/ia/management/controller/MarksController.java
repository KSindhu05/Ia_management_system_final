package com.ia.management.controller;

import com.ia.management.model.IAMark;
import com.ia.management.model.Student;
import com.ia.management.model.Subject;
import com.ia.management.service.MarksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.ia.management.model.PendingApprovalDTO;

@RestController
@RequestMapping("/api/marks")

public class MarksController {

    @Autowired
    private MarksService marksService;

    @GetMapping("/subjects")
    public List<Subject> getSubjects() {
        return marksService.getAllSubjects();
    }

    @GetMapping("/students")
    public List<Student> getStudents() {
        return marksService.getAllStudents();
    }

    @GetMapping("/subject/{subjectId}")
    public List<IAMark> getMarksForSubject(@PathVariable Long subjectId) {
        return marksService.getMarksForSubject(subjectId);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateMark(@RequestBody Map<String, Object> payload) {
        try {
            Long studentId = Long.valueOf(payload.get("studentId").toString());
            Long subjectId = Long.valueOf(payload.get("subjectId").toString());
            String iaType = (String) payload.get("iaType");

            Double co1 = payload.get("co1") != null ? Double.valueOf(payload.get("co1").toString()) : 0.0;
            Double co2 = payload.get("co2") != null ? Double.valueOf(payload.get("co2").toString()) : 0.0;

            IAMark updated = marksService.updateMark(studentId, subjectId, iaType, co1, co2);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating mark: " + e.getMessage());
        }
    }

    @PostMapping("/update/batch")
    public ResponseEntity<?> updateMarksBatch(@RequestBody List<Map<String, Object>> payload) {
        try {
            marksService.updateMarksBatch(payload);
            return ResponseEntity.ok("Batch update successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating batch: " + e.getMessage());
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitMarks(@RequestParam Long subjectId, @RequestParam String iaType) {
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            marksService.submitMarks(subjectId, iaType, auth.getName());
            return ResponseEntity.ok("Marks submitted successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting marks: " + e.getMessage());
        }
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approveMarks(@RequestParam Long subjectId, @RequestParam String iaType) {
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            // TODO: Verify HOD role if not done by SecurityConfig
            marksService.approveMarks(subjectId, iaType, auth.getName());
            return ResponseEntity.ok("Marks approved successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error approving marks: " + e.getMessage());
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectMarks(@RequestParam Long subjectId, @RequestParam String iaType) {
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            marksService.rejectMarks(subjectId, iaType, auth.getName());
            return ResponseEntity.ok("Marks rejected.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rejecting marks: " + e.getMessage());
        }
    }

    @GetMapping("/my-marks")
    public ResponseEntity<?> getMyMarks() {
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            String username = auth.getName();

            // If username is "anonymousUser", handle strictly
            if (username == null || username.equals("anonymousUser")) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            List<IAMark> marks = marksService.getMyMarks(username);
            return ResponseEntity.ok(marks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching marks: " + e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PendingApprovalDTO>> getPendingMarks(@RequestParam String department) {
        try {
            List<PendingApprovalDTO> pending = marksService.getPendingSubmissions(department);
            return ResponseEntity.ok(pending);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
