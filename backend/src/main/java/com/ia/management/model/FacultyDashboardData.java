package com.ia.management.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class FacultyDashboardData {
    private FacultyProfile profile;
    private List<Subject> subjects;
    private ClassAnalytics analytics;
    private List<LabSchedule> labSchedule;

    @Data
    @Builder
    public static class FacultyProfile {
        private String name;
        private String designation;
        private String department;
    }

    @Data
    @Builder
    public static class Subject {
        private int id;
        private String name;
        private String semester;
        private int studentCount;
    }

    @Data
    @Builder
    public static class ClassAnalytics {
        private int totalStudents;
        private int evaluated;
        private int pending;
        private int avgScore;
        private int lowPerformers;
        private int topPerformers;
    }

    @Data
    @Builder
    public static class LabSchedule {
        private int id;
        private String day;
        private String time;
        private String lab;
        private String batch;
    }
}
