package com.ia.management.service;

import com.ia.management.model.HODDashboardData;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class HODService {

        @org.springframework.beans.factory.annotation.Autowired
        private com.ia.management.repository.UserRepository userRepository;

        @org.springframework.beans.factory.annotation.Autowired
        private com.ia.management.repository.IAnnouncementRepository announcementRepository;

        @org.springframework.beans.factory.annotation.Autowired
        private org.springframework.security.crypto.password.PasswordEncoder encoder;

        public void addFaculty(com.ia.management.model.CreateFacultyRequest request) {
                if (userRepository.existsByUsername(request.getUsername())) {
                        throw new RuntimeException("Username already exists!");
                }

                com.ia.management.model.User user = new com.ia.management.model.User();
                user.setUsername(request.getUsername());
                user.setFullName(request.getFullName());
                user.setPassword(encoder.encode(request.getPassword()));
                user.setEmail(request.getEmail());
                user.setDepartment(request.getDepartment()); // Should come from HOD's dept or request
                user.setRole(com.ia.management.model.User.Role.FACULTY);

                userRepository.save(user);
        }

        public HODDashboardData getDashboardData() {
                var profile = HODDashboardData.HODProfile.builder()
                                .name("Dr. V. K. Singh")
                                .department("Computer Science Department")
                                .build();

                var stats = HODDashboardData.DepartmentStats.builder()
                                .totalStudents(450)
                                .facultyCount(24)
                                .passPercentage(88)
                                .pendingIssues(3)
                                .build();

                var branchComparison = HODDashboardData.BranchComparison.builder()
                                .labels(Arrays.asList("Year 1", "Year 2", "Year 3"))
                                .passPercentage(Arrays.asList(85, 92, 88))
                                .attendance(Arrays.asList(78, 82, 85))
                                .build();

                var requests = Arrays.asList(
                                HODDashboardData.ResourceRequest.builder().id(1).request("Projector Repair - Lab 2")
                                                .requester("Mr. Amit").status("Pending").build(),
                                HODDashboardData.ResourceRequest.builder().id(2).request("New Textbooks for Library")
                                                .requester("Mrs. Sharma").status("Approved").build());

                var alerts = Arrays.asList(
                                HODDashboardData.DepartmentAlert.builder().id(1).message("Low attendance in 2nd Year B")
                                                .date("2 hrs ago").type("warning").build(),
                                HODDashboardData.DepartmentAlert.builder().id(2)
                                                .message("Syllabus completion deadline approaching").date("1 day ago")
                                                .type("info").build());

                var roster = Arrays.asList(
                                HODDashboardData.FacultyStatus.builder().name("Dr. A. Verma").status("In Class (Lab 2)")
                                                .initials("AV").build(),
                                HODDashboardData.FacultyStatus.builder().name("Mrs. S. Gupta").status("Free")
                                                .initials("SG").build());

                return HODDashboardData.builder()
                                .profile(profile)
                                .stats(stats)
                                .branchComparison(branchComparison)
                                .resourceRequests(requests)
                                .alerts(alerts)
                                .facultyRoster(roster)
                                .build();
        }

        public java.util.List<com.ia.management.model.FacultyDTO> getDepartmentFaculty(String department) {
                java.util.List<com.ia.management.model.User> facultyList = userRepository
                                .findByDepartmentAndRole(department, com.ia.management.model.User.Role.FACULTY);

                return facultyList.stream().map(faculty -> {
                        // Derive subjects from IAnnouncement history
                        java.util.List<com.ia.management.model.IAnnouncement> announcements = announcementRepository
                                        .findByFaculty(faculty);
                        java.util.List<String> subjects = announcements.stream()
                                        .map(a -> a.getSubject().getName())
                                        .distinct()
                                        .collect(java.util.stream.Collectors.toList());

                        return com.ia.management.model.FacultyDTO.builder()
                                        .id(faculty.getId())
                                        .username(faculty.getUsername())
                                        .fullName(faculty.getFullName())
                                        .department(faculty.getDepartment())
                                        .email(faculty.getEmail())
                                        .designation("Faculty Member") // Default for now
                                        .subjects(subjects)
                                        .build();
                }).collect(java.util.stream.Collectors.toList());
        }
}
