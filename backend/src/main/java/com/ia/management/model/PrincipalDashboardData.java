package com.ia.management.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PrincipalDashboardData {
    private InstituteStats stats;
    private List<String> branches;
    private List<Integer> passFailData;
    private List<Double> branchPerformance;
    private List<BroadcastMessage> broadcasts;
    private List<ScheduleItem> schedule;

    @Data
    @Builder
    public static class InstituteStats {
        private int totalStudents;
        private int placementRate;
        private String feeCollection;
        private int avgAttendance;
    }

    @Data
    @Builder
    public static class BroadcastMessage {
        private int id;
        private String message;
        private String target;
        private String date;
    }

    @Data
    @Builder
    public static class ScheduleItem {
        private int id;
        private String time;
        private String title;
        private String type; // Urgent, Routine
    }
}
