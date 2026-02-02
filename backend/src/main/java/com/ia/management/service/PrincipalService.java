package com.ia.management.service;

import com.ia.management.model.PrincipalDashboardData;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class PrincipalService {

    public PrincipalDashboardData getDashboardData() {
        var stats = PrincipalDashboardData.InstituteStats.builder()
                .totalStudents(2400)
                .placementRate(85)
                .feeCollection("85%")
                .avgAttendance(76)
                .build();

        var broadcasts = Arrays.asList(
                PrincipalDashboardData.BroadcastMessage.builder().id(1).message("Holiday declared tomorrow due to rain").target("All").date("10 mins ago").build(),
                PrincipalDashboardData.BroadcastMessage.builder().id(2).message("HOD Meeting in Conference Hall").target("HODs").date("1 hr ago").build()
        );

        var schedule = Arrays.asList(
                PrincipalDashboardData.ScheduleItem.builder().id(1).time("09:00 AM").title("Morning Assembly").type("Routine").build(),
                PrincipalDashboardData.ScheduleItem.builder().id(2).time("11:30 AM").title("Meeting with Trustees").type("Urgent").build()
        );

        return PrincipalDashboardData.builder()
                .stats(stats)
                .branches(Arrays.asList("CSE", "ECE", "ME", "CE"))
                .passFailData(Arrays.asList(850, 150)) // P/F count
                .branchPerformance(Arrays.asList(82.5, 78.0, 75.5, 80.0))
                .broadcasts(broadcasts)
                .schedule(schedule)
                .build();
    }
}
