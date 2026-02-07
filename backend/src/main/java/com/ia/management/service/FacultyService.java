package com.ia.management.service;

import com.ia.management.model.FacultyDashboardData;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class FacultyService {

        @org.springframework.beans.factory.annotation.Autowired
        private com.ia.management.repository.UserRepository userRepository;

        @org.springframework.beans.factory.annotation.Autowired
        private com.ia.management.repository.SubjectRepository subjectRepository;

        @org.springframework.beans.factory.annotation.Autowired
        private com.ia.management.repository.StudentRepository studentRepository;

        public FacultyDashboardData getDashboardData(String username) {
                // 1. Fetch User Profile
                var user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Faculty not found"));

                var profile = FacultyDashboardData.FacultyProfile.builder()
                                .name(user.getFullName() != null ? user.getFullName() : user.getUsername())
                                .designation("Faculty") // Default or add to User model
                                .department(user.getDepartment())
                                .build();

                // 2. Fetch Subjects linked to this Faculty
                var subjectsEntities = subjectRepository.findByFacultyUsername(username);

                // If no specific subjects assigned, falling back to department?
                // No, user requirement is specific assignment.
                if (subjectsEntities.isEmpty()) {
                        // Empty list or maybe fallback for existing data without faculty?
                        // For now let's stick to strict assignment to show only "their subject"
                }
                var subjects = subjectsEntities.stream().map(s -> {
                        // Count students in this semester/dept
                        int count = studentRepository.findByDepartmentAndSemester(s.getDepartment(), s.getSemester())
                                        .size();
                        return FacultyDashboardData.Subject.builder()
                                        .id(s.getId().intValue())
                                        .name(s.getName())
                                        .semester(s.getSemester())
                                        .studentCount(count)
                                        .build();
                }).collect(java.util.stream.Collectors.toList());

                // 3. Analytics (Simplified calculation)
                // For now, mocking analytics logic based on student count, to be expanded with
                // CIEMarkRepo
                int totalStudents = subjects.stream().mapToInt(FacultyDashboardData.Subject::getStudentCount).sum();

                var analytics = FacultyDashboardData.ClassAnalytics.builder()
                                .totalStudents(totalStudents)
                                .evaluated(0) // Pending implementation with CIEMarkRepository
                                .pending(totalStudents)
                                .avgScore(0)
                                .lowPerformers(0)
                                .topPerformers(0)
                                .build();

                // 4. Lab Schedule (Keep Mock or Empty for now as no entity exists)
                var schedule = Arrays.asList(
                                FacultyDashboardData.LabSchedule.builder().id(1).day("Mon").time("10:00 AM")
                                                .lab("Lab 1").batch("B1").build());

                return FacultyDashboardData.builder()
                                .profile(profile)
                                .subjects(subjects)
                                .analytics(analytics)
                                .labSchedule(schedule)
                                .build();
        }

        public java.util.List<com.ia.management.model.Student> getStudentsForFaculty(String username) {
                var user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Faculty not found"));

                // Fetch students in the same department
                return studentRepository.findByDepartment(user.getDepartment());
        }

        public java.util.List<com.ia.management.model.Subject> getSubjectsForFaculty(String username) {
                return subjectRepository.findByFacultyUsername(username);
        }
}
