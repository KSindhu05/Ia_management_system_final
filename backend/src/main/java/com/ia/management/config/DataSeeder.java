package com.ia.management.config;

import com.ia.management.model.IAMark;
import com.ia.management.model.Student;
import com.ia.management.model.Subject;
import com.ia.management.model.User;
import com.ia.management.repository.IAMarkRepository;
import com.ia.management.repository.StudentRepository;
import com.ia.management.repository.SubjectRepository;
import com.ia.management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final IAMarkRepository iaMarkRepository;

    public DataSeeder(StudentRepository studentRepository, SubjectRepository subjectRepository,
            IAMarkRepository iaMarkRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.iaMarkRepository = iaMarkRepository;
        this.userRepository = userRepository;
    }

    // ... existing ...

    private Student createStudentIfNotFound(String regNo, String name, String phone) {
        return studentRepository.findAll().stream()
                .filter(s -> s.getRegNo().equals(regNo))
                .findFirst()
                .orElseGet(() -> {
                    Student s = new Student();
                    s.setRegNo(regNo);
                    s.setName(name);
                    s.setDepartment("CS");
                    s.setSemester("2nd");
                    s.setSection("A");
                    s.setPhoneNo(phone);
                    s.setEmail(regNo.toLowerCase() + "@student.college.edu");

                    // Create User Account
                    User user = new User();
                    user.setUsername(regNo);
                    user.setPassword("password"); // Default password
                    user.setRole(User.Role.STUDENT);
                    user.setAssociatedId(regNo);

                    // Cascade save or save user first
                    // Since OneToOne cascade is ALL, saving student should save user if set
                    s.setUser(user);

                    return studentRepository.save(s);
                });
    }

    @Override
    public void run(String... args) throws Exception {
        // seedData has internal checks to avoid duplicates
        seedData();
    }

    private void seedData() {
        System.out.println("Seeding Database...");

        // 1. Create Subjects
        Subject maths = createSubjectIfNotFound("SC202T", "Engineering Maths-II", "CS", "2nd", 50);
        Subject english = createSubjectIfNotFound("HU201T", "English Communication", "CS", "2nd", 50);
        Subject caeg = createSubjectIfNotFound("ME201T", "CAEG", "CS", "2nd", 50);
        Subject python = createSubjectIfNotFound("CS201T", "Python", "CS", "2nd", 50);

        List<Subject> subjects = Arrays.asList(maths, english, caeg, python);

        // 2. Student Data (CSV format: SlNo,RegNo,Name,Phone,Maths,English,CAEG,Python)
        // Marks are TOTAL marks from the sheet (treated as CIE-1)
        String[] studentData = {
                "1,459CS23001,A KAVITHA,9071407865,30,30,30,20",
                "2,459CS23002,ABHISHEKA,8197870656,8,2,11,2",
                "3,459CS23003,ADARSH REDDY G,9182990109,8,10,12,11",
                "4,459CS23004,AGASARA KEERTHANA,9494061680,37,33,48,42",
                "5,459CS23005,AKHIL S,8861821741,49,40,44,42",
                "6,459CS23006,AKULA SHASHI KUMAR,7337820690,50,32,45,45",
                "7,459CS23007,ANAPA LEELA LASYA LAHARI,9392215458,46,48,39,48",
                "8,459CS23008,ANKITH C,9564641112,10,21,12,26",
                "9,459CS23009,ANUSHA,8105423714,47,36,41,49",
                "10,459CS23010,B GURU SAI CHARAN,9564658745,50,42,39,46",
                "11,459CS23011,B SREENATH,7411218677,16,24,8,4",
                "12,459CS23012,B VAMSHI,6361450899,40,21,22,30",
                "13,459CS23013,BASAVARAJA,8495012076,39,35,44,35",
                "14,459CS23014,BEBE KHUTEJA,8050887857,7,20,23,22",
                "15,459CS23015,BHUMIKA K,7619103210,39,47,37,47",
                "16,459CS23016,C ABHINAV,9380242695,41,46,37,43",
                "17,459CS23017,C D ANNAPOORNA,9742183010,20,26,42,38",
                "18,459CS23018,C JEEVAN KUMAR,7204372409,29,41,39,41",
                "19,459CS23019,D LIKHITA,9845865211,50,45,49,50",
                "20,459CS23020,D PREM KUMAR,9164717674,21,39,42,31"
        };

        for (String row : studentData) {
            String[] parts = row.split(",");
            if (parts.length < 8)
                continue;

            String regNo = parts[1].trim();
            String name = parts[2].trim();
            String phone = parts[3].trim();

            // Create Student
            Student student = createStudentIfNotFound(regNo, name, phone);

            // Add Marks
            createMarks(student, maths, parseDouble(parts[4]), 0.0);
            createMarks(student, english, parseDouble(parts[5]), 0.0);
            createMarks(student, caeg, parseDouble(parts[6]), 0.0);
            createMarks(student, python, parseDouble(parts[7]), 0.0);
        }

        System.out.println("Database Seeded Successfully with " + studentData.length + " students!");
    }

    private Subject createSubjectIfNotFound(String code, String name, String dept, String sem, Integer maxMarks) {
        // Simple check - in real app use findByCode
        // Assuming we start fresh or idempotent
        return subjectRepository.findAll().stream()
                .filter(s -> s.getCode().equals(code))
                .findFirst()
                .orElseGet(() -> subjectRepository.save(new Subject(null, code, name, dept, sem, maxMarks, "Theory")));
    }

    private Double parseDouble(String val) {
        try {
            return Double.parseDouble(val);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private void createMarks(Student student, Subject subject, Double co1, Double co2) {
        // Check if marks exist
        boolean exists = iaMarkRepository.findAll().stream()
                .anyMatch(m -> m.getStudent().getId().equals(student.getId()) &&
                        m.getSubject().getId().equals(subject.getId()) &&
                        m.getIaType() == IAMark.IAType.CIE1);

        if (!exists) {
            IAMark mark = new IAMark();
            mark.setStudent(student);
            mark.setSubject(subject);
            mark.setIaType(IAMark.IAType.CIE1);
            mark.setCo1Score(co1);
            mark.setCo2Score(co2);
            mark.setTotalScore(co1 + co2); // Using CO1 as total if CO2 is 0
            mark.setAttendancePercentage(85);
            mark.setRemarks("Imported");
            iaMarkRepository.save(mark);
        }
    }
}
