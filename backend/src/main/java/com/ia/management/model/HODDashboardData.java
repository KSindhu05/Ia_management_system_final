package com.ia.management.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class HODDashboardData {
    private HODProfile profile;
    private DepartmentStats stats;
    private BranchComparison branchComparison;
    private List<ResourceRequest> resourceRequests;
    private List<DepartmentAlert> alerts;
    private List<FacultyStatus> facultyRoster;

    @Data
    @Builder
    public static class HODProfile {
        private String name;
        private String department;
    }

    @Data
    @Builder
    public static class DepartmentStats {
        private int totalStudents;
        private int facultyCount;
        private int passPercentage;
        private int pendingIssues;
    }

    @Data
    @Builder
    public static class BranchComparison {
        private List<String> labels;
        private List<Integer> passPercentage;
        private List<Integer> attendance;
    }

    @Data
    @Builder
    public static class ResourceRequest {
        private int id;
        private String request;
        private String requester;
        private String status;
    }

    @Data
    @Builder
    public static class DepartmentAlert {
        private int id;
        private String message;
        private String date;
        private String type; // critical, warning, etc.
    }

    @Data
    @Builder
    public static class FacultyStatus {
        private String name;
        private String status;
        private String initials;
    }
}
