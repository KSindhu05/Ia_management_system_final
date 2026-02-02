package com.ia.management.service;

import com.ia.management.model.StudentDashboardData;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class StudentService {

    public StudentDashboardData getDashboardData() {
        // Mock Data mimicking the React frontend hardcoded data

        var profile = StudentDashboardData.StudentProfile.builder()
                .name("Rahul Sharma")
                .rollNo("21CS045")
                .branch("Computer Science")
                .semester("5th")
                .attendance(78)
                .cgpa(8.2)
                .build();

        var marks = Arrays.asList(
                StudentDashboardData.IAMark.builder().id(1).subject("Data Structures").code("CS301").ia1(22).ia2(20).ia3(23).avg(22).status("Excellent").build(),
                StudentDashboardData.IAMark.builder().id(2).subject("DBMS").code("CS302").ia1(18).ia2(19).ia3(20).avg(19).status("Good").build(),
                StudentDashboardData.IAMark.builder().id(3).subject("Operating Systems").code("CS303").ia1(15).ia2(17).ia3(18).avg(17).status("Good").build(),
                StudentDashboardData.IAMark.builder().id(4).subject("Computer Networks").code("CS304").ia1(21).ia2(22).ia3(24).avg(22).status("Excellent").build(),
                StudentDashboardData.IAMark.builder().id(5).subject("Web Technologies").code("CS305").ia1(12).ia2(14).ia3(16).avg(14).status("Needs Focus").build()
        );

        var exams = Arrays.asList(
                StudentDashboardData.Exam.builder().id(1).exam("IA-5").subject("Software Engineering").date("15-Dec").time("10:00 AM").build(),
                StudentDashboardData.Exam.builder().id(2).exam("IA-6").subject("Java Programming").date("22-Dec").time("02:00 PM").build(),
                StudentDashboardData.Exam.builder().id(3).exam("IA-5").subject("Industrial Mgmt").date("24-Dec").time("10:00 AM").build()
        );

        var notifications = Arrays.asList(
                StudentDashboardData.Notification.builder().id(1).message("New IA-5 Marks Uploaded for CAD").time("2 hrs ago").type("info").build(),
                StudentDashboardData.Notification.builder().id(2).message("Parent Meeting Scheduled for 20th Dec").time("1 day ago").type("warning").build(),
                StudentDashboardData.Notification.builder().id(3).message("IA-6 Submission Deadline Tomorrow").time("2 days ago").type("alert").build()
        );

        var achievements = Arrays.asList(
                StudentDashboardData.Achievement.builder().id(1).title("Top Performer").desc("Ranked #3 in class").icon("🏆").build(),
                StudentDashboardData.Achievement.builder().id(2).title("Perfect Attendance").desc("This month").icon("⭐").build(),
                StudentDashboardData.Achievement.builder().id(3).title("Skill Badge").desc("Python Certified").icon("🎯").build()
        );

        return StudentDashboardData.builder()
                .profile(profile)
                .marks(marks)
                .upcomingExams(exams)
                .notifications(notifications)
                .achievements(achievements)
                .build();
    }
}
