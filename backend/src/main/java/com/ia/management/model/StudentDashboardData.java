package com.ia.management.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class StudentDashboardData {
    private StudentProfile profile;
    private List<IAMark> marks;
    private List<Exam> upcomingExams;
    private List<Notification> notifications;
    private List<Achievement> achievements;

    @Data
    @Builder
    public static class StudentProfile {
        private String name;
        private String rollNo;
        private String branch;
        private String semester;
        private int attendance;
        private double cgpa;
    }

    @Data
    @Builder
    public static class IAMark {
        private int id;
        private String subject;
        private String code;
        private int ia1;
        private int ia2;
        private int ia3;
        private int avg;
        private String status;
    }

    @Data
    @Builder
    public static class Exam {
        private int id;
        private String exam;
        private String subject;
        private String date;
        private String time;
    }

    @Data
    @Builder
    public static class Notification {
        private int id;
        private String message;
        private String time;
        private String type; // info, warning, alert
    }

    @Data
    @Builder
    public static class Achievement {
        private int id;
        private String title;
        private String desc;
        private String icon; // Icon name strings
    }
}
