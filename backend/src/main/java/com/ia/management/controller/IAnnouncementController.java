package com.ia.management.controller;

import com.ia.management.model.IAnnouncement;
import com.ia.management.model.Notification;
import com.ia.management.model.Student;
import com.ia.management.model.User;
import com.ia.management.repository.StudentRepository;
import com.ia.management.repository.SubjectRepository;
import com.ia.management.repository.UserRepository;
import com.ia.management.service.IAnnouncementService;
import com.ia.management.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class IAnnouncementController {

    @Autowired
    private IAnnouncementService announcementService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    // --- FACULTY ENDPOINTS ---

    @PostMapping("/faculty/announcements")
    public ResponseEntity<IAnnouncement> createAnnouncement(
            @RequestParam Long subjectId,
            @RequestBody IAnnouncement announcement,
            Authentication authentication) {
        return ResponseEntity
                .ok(announcementService.createAnnouncement(subjectId, authentication.getName(), announcement));
    }

    @GetMapping("/faculty/announcements/details")
    public ResponseEntity<IAnnouncement> getAnnouncementDetails(
            @RequestParam Long subjectId,
            @RequestParam Integer cieNumber) {
        return ResponseEntity.ok(announcementService.getAnnouncementDetails(subjectId, cieNumber));
    }

    @GetMapping("/faculty/announcements")
    public ResponseEntity<List<IAnnouncement>> getMyAnnouncements(Authentication authentication) {
        return ResponseEntity.ok(announcementService.getFacultyAnnouncements(authentication.getName()));
    }

    // --- STUDENT ENDPOINTS ---

    @GetMapping("/student/announcements")
    public ResponseEntity<List<IAnnouncement>> getStudentAnnouncements(Authentication authentication) {
        // 1. Get Student Profile
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        Student student = studentRepository.findByRegNo(user.getAssociatedId()).orElseThrow();

        // 2. Find Subjects for Student (Dept + Sem)
        List<Long> subjectIds = subjectRepository
                .findByDepartmentAndSemester(student.getDepartment(), student.getSemester())
                .stream().map(s -> s.getId()).collect(Collectors.toList());

        // 3. Find Announcements
        // Using Repository directly here or via Service if exposed
        // For simplicity, let's add a helper in Service or Repostiory
        // Actually Repository has: findBySubjectIdInAndScheduledDateAfter...
        // Need to autowire Repository or expose method in Service.
        // Let's expose in Service properly.

        // Fix: Call Service method (need to update Service to accept subjectIds)
        // Temporary hack: use direct repo call if service not updated, but better
        // Update Service.
        // I'll update the Service content below to include
        // getStudentAnnouncementsBySubjects
        return ResponseEntity.ok(announcementService.getAnnouncementsForSubjects(subjectIds));
    }

    @GetMapping("/student/notifications")
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getUserNotifications(authentication.getName()));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    // --- HOD ENDPOINTS ---

    @GetMapping("/hod/announcements")
    public ResponseEntity<List<IAnnouncement>> getDepartmentAnnouncements(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName()).orElseThrow();
        // HOD associatedId stores Department Name or Department field
        String department = user.getDepartment();
        if (department == null)
            department = user.getAssociatedId(); // Fallback

        return ResponseEntity.ok(announcementService.getDepartmentAnnouncements(department));
    }

    @PostMapping("/hod/announcements")
    public ResponseEntity<IAnnouncement> createHODAnnouncement(
            @RequestParam Long subjectId,
            @RequestBody IAnnouncement announcement,
            Authentication authentication) {
        return ResponseEntity
                .ok(announcementService.createAnnouncement(subjectId, authentication.getName(), announcement));
    }
}
