package com.ia.management.config;

import com.ia.management.model.Student;
import com.ia.management.model.Subject;
import com.ia.management.model.User;
import com.ia.management.model.CIEMark;
import com.ia.management.repository.StudentRepository;
import com.ia.management.repository.SubjectRepository;
import com.ia.management.repository.UserRepository;
import com.ia.management.repository.CIEMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

// @Component // DISABLED - Using DataSeeder.java instead which has real CSV data
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CIEMarkRepository cieMarkRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (subjectRepository.count() == 0) {
            System.out.println("Seeding Subjects...");
            // User: "All CIE's maximum marks is 50"
            Subject maths = new Subject(null, "25SC01T", "Engineering Maths-II", "CS", "2nd", 50, "Theory");
            Subject english = new Subject(null, "25EG01T", "English Communication", "CS", "2nd", 50, "Theory");
            Subject caeg = new Subject(null, "25ME02P", "CAEG", "CS", "2nd", 50, "Lab");
            Subject python = new Subject(null, "25CS21P", "Python", "CS", "2nd", 50, "Lab");
            subjectRepository.saveAll(Arrays.asList(maths, english, caeg, python));
        }

        if (userRepository.findByUsername("principal").isEmpty()) {
            System.out.println("Seeding Users...");

            // Admin/Principal
            User principal = new User();
            principal.setUsername("principal");
            principal.setPassword(encoder.encode("password"));
            principal.setRole(User.Role.PRINCIPAL);

            // HOD
            User hod = new User();
            hod.setUsername("hod_cs");
            hod.setPassword(encoder.encode("password"));
            hod.setRole(User.Role.HOD);
            hod.setDepartment("CS");

            // Faculty
            User faculty1 = new User();
            faculty1.setUsername("faculty_maths");
            faculty1.setPassword(encoder.encode("password"));
            faculty1.setRole(User.Role.FACULTY);
            faculty1.setDepartment("MathsDept");

            User faculty2 = new User();
            faculty2.setUsername("faculty_cs");
            faculty2.setPassword(encoder.encode("password"));
            faculty2.setRole(User.Role.FACULTY);
            faculty2.setDepartment("CSDept");

            userRepository.saveAll(Arrays.asList(principal, hod, faculty1, faculty2));

            // 4. Create Students (Real List)
            String[] studentNames = {
                    "A KAVITHA", "ABHISHEKA", "ADARSH REDDY G", "AGASARA KEERTHANA", "AKHIL S",
                    "AKULA SHASHI KUMAR", "ANAPA LEELA LASYA LAHA", "ANKITH C", "ANUSHA", "B GURU SAI CHARAN",
                    "B SREENATH", "B VAMSHI", "BASAVARAJA", "BEBE KHUTEJA", "BHUMIKA K",
                    "C ABHINAV", "C D ANNAPOORNA", "C JEEVAN KUMAR", "D LIKHITA", "D PREM KUMAR",
                    "D S YASHODA", "DARSHANI", "DARUR KAVYA", "DASHAVANTH", "DHANESHWARI",
                    "FIRDOUS D", "G ANUSRI", "G M VISHWANATH", "GAGANA PATIL", "GANHALA KUSHAL SAI",
                    "GOUTHAM HEGADE K S", "GOUTHAMI", "GULAM MUSTAFA KHAN", "H D NANDISH NAIK", "H VINAYA PATIL",
                    "HALLI SIDDANA GOUDA", "HANUMANTHA REDDY", "HARI CHARAN K", "HEMANT DWIVEDI", "J SHIVASHANKAR",
                    "K ABHILASH", "K ANANDA", "K HARI PRASAD REDDY", "K JASHWANTH GOWDA", "K JEETHENDRA REDDY",
                    "K KAVYA", "K MEGHANA", "K MOUNIKA", "K PRAVEEN KUMAR", "K THARUN",
                    "K VINAY", "KEERTHANA M", "KYADHARI KAVYASRI", "LAKSHAR", "LAKSHMI S",
                    "M AAMIR HAMZA", "M MAHESHA", "M S MOHAMMAD ISMAIL", "M S POORVI", "MAHADEVI V",
                    "MANEESHA V M", "MARESHA Y", "MARUTHI H"
            };

            List<Student> students = new ArrayList<>();
            int count = 1;
            for (String name : studentNames) {
                try {
                    // Generate RegNo: 459CS23001
                    String regNo = String.format("459CS23%03d", count++);

                    // Create User if not exists
                    if (userRepository.findByUsername(regNo).isPresent()) {
                        continue;
                    }

                    User studentUser = new User();
                    studentUser.setUsername(regNo);
                    studentUser.setPassword(encoder.encode("123"));
                    studentUser.setRole(User.Role.STUDENT);
                    studentUser.setAssociatedId(regNo);

                    // Check if Student Exists
                    Student student = studentRepository.findByRegNo(regNo).orElse(null);

                    if (student == null) {
                        student = new Student();
                        student.setName(name);
                        student.setRegNo(regNo);
                        student.setDepartment("CS");
                        student.setSemester("2nd"); // Defaulting to 2nd semester as per subjects
                        student.setSection("A");
                    }

                    student.setUser(studentUser);
                    studentRepository.save(student);
                    students.add(student);
                } catch (Exception e) {
                    System.err.println("Error creating student: " + name);
                }
            }
            System.out.println("Seeded " + students.size() + " real students.");

            // 5. Seed Marks
            List<Subject> subjects = subjectRepository.findAll();
            for (Student student : students) {
                for (Subject subject : subjects) {
                    // Seed CIE-1 from Image (Real Data)
                    if (student.getName().equals("A KAVITHA")) {
                        // Maths (25SC01T) - Image: CO1=19, CO2=1, Total=20
                        if (subject.getCode().equals("25SC01T")) {
                            createSpecificMark(student, subject, CIEMark.CIEType.CIE1, 20.0);
                        }
                        // English (25EG01T) - Image: CO1=15, CO2=NaN/0, Total=15.
                        else if (subject.getCode().equals("25EG01T")) {
                            createSpecificMark(student, subject, CIEMark.CIEType.CIE1, 15.0);
                        }
                        // CAEG (25ME02P) - Image: CO1=8, CO2=22, Total=30.
                        else if (subject.getCode().equals("25ME02P")) {
                            createSpecificMark(student, subject, CIEMark.CIEType.CIE1, 30.0);
                        }
                        // Python (25CS21P) - Image: CO1=10, CO2=0, Total=10.
                        else if (subject.getCode().equals("25CS21P")) {
                            createSpecificMark(student, subject, CIEMark.CIEType.CIE1, 10.0);
                        } else {
                            // Default random for other subjects
                            createRandomMark(student, subject, CIEMark.CIEType.CIE1);
                        }
                    } else {
                        // Random marks for others - ONLY CIE-1 as per request
                        createRandomMark(student, subject, CIEMark.CIEType.CIE1);
                    }
                }
            }
        }
    }

    private void createSpecificMark(Student student, Subject subject, CIEMark.CIEType type,
            Double totalScore) {
        CIEMark mark = new CIEMark();
        mark.setStudent(student);
        mark.setSubject(subject);
        mark.setCieType(type);
        mark.setTotalScore(totalScore); // Only Total Score
        mark.setAttendancePercentage(85);
        cieMarkRepository.save(mark);
    }

    private void createRandomMark(Student student, Subject subject, CIEMark.CIEType type) {
        Double maxMarks = subject.getMaxMarks() != null ? subject.getMaxMarks().doubleValue() : 50.0;

        CIEMark mark = new CIEMark();
        mark.setStudent(student);
        mark.setSubject(subject);
        mark.setCieType(type);

        // Generate random score
        double score = Math.round((Math.random() * maxMarks * 0.6 + maxMarks * 0.35) * 2) / 2.0;
        if (score > maxMarks)
            score = maxMarks;

        mark.setTotalScore(score);
        mark.setAttendancePercentage(75 + (int) (Math.random() * 25));

        cieMarkRepository.save(mark);
    }
}
