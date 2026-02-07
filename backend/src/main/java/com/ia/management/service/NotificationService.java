package com.ia.management.service;

import com.ia.management.model.*;
import com.ia.management.repository.NotificationRepository;
import com.ia.management.repository.StudentRepository;
import com.ia.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
// Forced update to trigger recompile
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    public void createNotification(User user, String title, String message, Notification.NotificationType type,
            Long refId) {
        Notification note = new Notification();
        note.setUser(user);
        note.setTitle(title);
        note.setMessage(message);
        note.setType(type);
        note.setReferenceId(refId);
        notificationRepository.save(note);
    }

    public void notifyStudents(IAnnouncement announcement) {
        Subject subject = announcement.getSubject();
        // Assuming announcement applies to all sections for now
        List<Student> students = studentRepository.findByDepartmentAndSemester(subject.getDepartment(),
                subject.getSemester());

        for (Student student : students) {
            if (student.getUser() != null) {
                createNotification(
                        student.getUser(),
                        "New IA Scheduled: " + subject.getName(),
                        "CIE-" + announcement.getCieNumber() + " scheduled on " + announcement.getScheduledDate(),
                        Notification.NotificationType.IA_ANNOUNCEMENT,
                        announcement.getId());
            }
        }
    }

    public void notifyHOD(IAnnouncement announcement) {
        Subject subject = announcement.getSubject();
        notifyHODGeneric(subject.getDepartment(),
                "New IA Scheduled: " + subject.getName(),
                "Faculty " + announcement.getFaculty().getUsername() + " scheduled CIE-"
                        + announcement.getCieNumber() + " on " + announcement.getScheduledDate(),
                Notification.NotificationType.IA_ANNOUNCEMENT,
                announcement.getId());
    }

    public void notifyHODMarksSubmitted(Subject subject, String iaType, String facultyName) {
        notifyHODGeneric(subject.getDepartment(),
                "Marks Submitted: " + subject.getName(),
                "Faculty " + facultyName + " has submitted " + iaType + " marks for approval.",
                Notification.NotificationType.MARKS_SUBMITTED,
                subject.getId());
    }

    public void notifyFacultyMarksApproved(Subject subject, String iaType, String facultyUsername) {
        User faculty = userRepository.findByUsername(facultyUsername).orElse(null);
        if (faculty != null) {
            createNotification(faculty,
                    "Marks Approved: " + subject.getName(),
                    "Your " + iaType + " marks have been approved by HOD.",
                    Notification.NotificationType.MARKS_APPROVED,
                    subject.getId());
        }
    }

    public void notifyFacultyMarksRejected(Subject subject, String iaType, String facultyUsername) {
        User faculty = userRepository.findByUsername(facultyUsername).orElse(null);
        if (faculty != null) {
            createNotification(faculty,
                    "Marks Rejected: " + subject.getName(),
                    "Your " + iaType + " marks were rejected. Please review and resubmit.",
                    Notification.NotificationType.MARKS_REJECTED,
                    subject.getId());
        }
    }

    private void notifyHODGeneric(String department, String title, String message, Notification.NotificationType type,
            Long refId) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            String userDept = user.getAssociatedId(); // Should match Department Name
            if (user.getRole() == User.Role.HOD && (department.equalsIgnoreCase(userDept) || "CS".equals(userDept))) { // Default
                                                                                                                       // fallback
                createNotification(user, title, message, type, refId);
            }
        }
    }

    public List<Notification> getUserNotifications(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId).orElse(null);
        if (n != null) {
            n.setIsRead(true);
            notificationRepository.save(n);
        }
    }
}
