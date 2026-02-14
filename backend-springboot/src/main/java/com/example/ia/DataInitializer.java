package com.example.ia;

import com.example.ia.entity.User;
import com.example.ia.entity.Student;
import com.example.ia.repository.UserRepository;
import com.example.ia.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, StudentRepository studentRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            String defaultPassword = "password";

            // 1. Principal
            if (!userRepository.existsByUsername("PRINCIPAL")) {
                User principal = new User();
                principal.setUsername("PRINCIPAL");
                principal.setPassword(passwordEncoder.encode(defaultPassword));
                principal.setEmail("principal@example.com");
                principal.setRole("PRINCIPAL");
                principal.setFullName("Principal Admin");
                principal.setDesignation("Principal");
                principal.setDepartment("ADMIN");
                userRepository.save(principal);
                System.out.println("✅ Principal user created: PRINCIPAL / " + defaultPassword);
            }

            // 2. HOD
            if (!userRepository.existsByUsername("HOD001")) {
                User hod = new User();
                hod.setUsername("HOD001");
                hod.setPassword(passwordEncoder.encode(defaultPassword));
                hod.setEmail("hod.cs@example.com");
                hod.setRole("HOD");
                hod.setFullName("Dr. HOD CSE");
                hod.setDesignation("Head of Department");
                hod.setDepartment("CSE");
                userRepository.save(hod);
                System.out.println("✅ HOD user created: HOD001 / " + defaultPassword);
            }

            // 3. Faculty
            if (!userRepository.existsByUsername("FAC001")) {
                User faculty = new User();
                faculty.setUsername("FAC001");
                faculty.setPassword(passwordEncoder.encode(defaultPassword));
                faculty.setEmail("faculty.cs@example.com");
                faculty.setRole("FACULTY");
                faculty.setFullName("Prof. Faculty One");
                faculty.setDesignation("Assistant Professor");
                faculty.setDepartment("CSE");
                // Assigning subjects for testing (comma separated)
                faculty.setSubjects("Advanced Java,Database Management Systems");
                userRepository.save(faculty);
                System.out.println("✅ Faculty user created: FAC001 / " + defaultPassword);
            }

            // 4. Real Student Seeding (459CS25001 - A KAVITHA)
            if (!userRepository.existsByUsername("459CS25001")) {
                User studentUser = new User();
                studentUser.setUsername("459CS25001");
                studentUser.setPassword(passwordEncoder.encode(defaultPassword));
                studentUser.setEmail("459CS25001@student.college.edu");
                studentUser.setRole("STUDENT");
                studentUser.setFullName("A KAVITHA");
                studentUser.setDepartment("CSE");
                studentUser.setSemester("2"); // From CSV: Sem 2
                studentUser.setSection("A");
                userRepository.save(studentUser);

                Student studentEntity = new Student();
                studentEntity.setRegNo("459CS25001");
                studentEntity.setName("A KAVITHA");
                studentEntity.setDepartment("CSE");
                studentEntity.setSemester(2);
                studentEntity.setSection("A");
                studentEntity.setEmail("459CS25001@student.college.edu");
                studentEntity.setPhone("9071407865"); // From CSV
                studentRepository.save(studentEntity);

                System.out.println("✅ Student user created: 459CS25001 / " + defaultPassword);
            }

            // 5. Real Student Seeding (459CS25002 - ABHISHEKA)
            if (!userRepository.existsByUsername("459CS25002")) {
                User studentUser = new User();
                studentUser.setUsername("459CS25002");
                studentUser.setPassword(passwordEncoder.encode(defaultPassword));
                studentUser.setEmail("459CS25002@student.college.edu");
                studentUser.setRole("STUDENT");
                studentUser.setFullName("ABHISHEKA");
                studentUser.setDepartment("CSE");
                studentUser.setSemester("2");
                studentUser.setSection("A");
                userRepository.save(studentUser);

                Student studentEntity = new Student();
                studentEntity.setRegNo("459CS25002");
                studentEntity.setName("ABHISHEKA");
                studentEntity.setDepartment("CSE");
                studentEntity.setSemester(2);
                studentEntity.setSection("A");
                studentEntity.setEmail("459CS25002@student.college.edu");
                studentEntity.setPhone("8197870656"); // From CSV
                studentRepository.save(studentEntity);

                System.out.println("✅ Student user created: 459CS25002 / " + defaultPassword);
            }
        };
    }
}
