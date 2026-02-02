package com.ia.management.service;

import com.ia.management.model.HODDashboardData;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class HODService {

    public HODDashboardData getDashboardData() {
        var profile = HODDashboardData.HODProfile.builder()
                .name("Dr. V. K. Singh")
                .department("Computer Science Department")
                .build();

        var stats = HODDashboardData.DepartmentStats.builder()
                .totalStudents(450)
                .facultyCount(24)
                .passPercentage(88)
                .pendingIssues(3)
                .build();

        var branchComparison = HODDashboardData.BranchComparison.builder()
                .labels(Arrays.asList("Year 1", "Year 2", "Year 3"))
                .passPercentage(Arrays.asList(85, 92, 88))
                .attendance(Arrays.asList(78, 82, 85))
                .build();

        var requests = Arrays.asList(
                HODDashboardData.ResourceRequest.builder().id(1).request("Projector Repair - Lab 2").requester("Mr. Amit").status("Pending").build(),
                HODDashboardData.ResourceRequest.builder().id(2).request("New Textbooks for Library").requester("Mrs. Sharma").status("Approved").build()
        );

        var alerts = Arrays.asList(
                HODDashboardData.DepartmentAlert.builder().id(1).message("Low attendance in 2nd Year B").date("2 hrs ago").type("warning").build(),
                HODDashboardData.DepartmentAlert.builder().id(2).message("Syllabus completion deadline approaching").date("1 day ago").type("info").build()
        );

        var roster = Arrays.asList(
                HODDashboardData.FacultyStatus.builder().name("Dr. A. Verma").status("In Class (Lab 2)").initials("AV").build(),
                HODDashboardData.FacultyStatus.builder().name("Mrs. S. Gupta").status("Free").initials("SG").build()
        );

        return HODDashboardData.builder()
                .profile(profile)
                .stats(stats)
                .branchComparison(branchComparison)
                .resourceRequests(requests)
                .alerts(alerts)
                .facultyRoster(roster)
                .build();
    }
}
