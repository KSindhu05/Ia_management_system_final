package com.ia.management;

import com.ia.management.model.User;
import com.ia.management.model.Subject;
import com.ia.management.repository.UserRepository;
import com.ia.management.repository.SubjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(UserRepository userRepository, SubjectRepository subjectRepository) {
        return args -> {
            // Seed HOD
            if (!userRepository.existsByUsername("MD Jaffar")) {
                User hod = new User();
                hod.setUsername("MD Jaffar");
                hod.setFullName("Dr. MD Jaffar");
                hod.setPassword("password"); // In real app, encode this
                hod.setRole(User.Role.HOD);
                hod.setDepartment("CS");
                hod.setEmail("hod.cs@college.edu");
                userRepository.save(hod);
            }

            // Seed Faculty 1
            if (!userRepository.existsByUsername("Dr. Smith")) {
                User fac1 = new User();
                fac1.setUsername("Dr. Smith");
                fac1.setFullName("Dr. John Smith");
                fac1.setPassword("password");
                fac1.setRole(User.Role.FACULTY);
                fac1.setDepartment("CS");
                fac1.setEmail("jsmith@college.edu");
                userRepository.save(fac1);
            }

            // Seed Faculty 2
            if (!userRepository.existsByUsername("Prof. Sarah")) {
                User fac2 = new User();
                fac2.setUsername("Prof. Sarah");
                fac2.setFullName("Prof. Sarah Jenkins");
                fac2.setPassword("password");
                fac2.setRole(User.Role.FACULTY);
                fac2.setDepartment("CS");
                fac2.setEmail("sjenkins@college.edu");
                userRepository.save(fac2);
            }

            // Seed Faculty 3 (Wahida Banu - from mock data)
            if (!userRepository.existsByUsername("Wahida Banu")) {
                User fac3 = new User();
                fac3.setUsername("Wahida Banu");
                fac3.setFullName("Prof. Wahida Banu");
                fac3.setPassword("password");
                fac3.setRole(User.Role.FACULTY);
                fac3.setDepartment("CS");
                fac3.setEmail("wbanu@college.edu");
                userRepository.save(fac3);
            }

            // Seed Subjects
            if (subjectRepository.findByDepartment("CS").isEmpty()) {
                Subject sub1 = new Subject();
                sub1.setName("Data Structures");
                sub1.setCode("CS201");
                sub1.setDepartment("CS");
                sub1.setSemester("2nd");
                sub1.setMaxMarks(100);
                subjectRepository.save(sub1);

                Subject sub2 = new Subject();
                sub2.setName("Database Management");
                sub2.setCode("CS202");
                sub2.setDepartment("CS");
                sub2.setSemester("4th");
                sub2.setMaxMarks(100);
                subjectRepository.save(sub2);

                Subject sub3 = new Subject();
                sub3.setName("Operating Systems");
                sub3.setCode("CS301");
                sub3.setDepartment("CS");
                sub3.setSemester("6th");
                sub3.setMaxMarks(100);
                subjectRepository.save(sub3);
            }

            // Update existing users if null department (optional safe update)
            userRepository.findAll().forEach(u -> {
                if (u.getRole() == User.Role.FACULTY && u.getDepartment() == null) {
                    u.setDepartment("CS"); // Default to CS for demo
                    u.setFullName(u.getUsername()); // Default full name
                    userRepository.save(u);
                }
            });
        };
    }
}
