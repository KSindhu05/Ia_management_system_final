package com.ia.management.service;

import com.ia.management.model.FacultyDashboardData;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class FacultyService {

    public FacultyDashboardData getDashboardData() {
        var profile = FacultyDashboardData.FacultyProfile.builder()
                .name("Prof. Anjali Desai")
                .designation("Senior Lecturer")
                .department("Computer Science")
                .build();

        var subjects = Arrays.asList(
                FacultyDashboardData.Subject.builder().id(1).name("Data Structures").semester("3rd").studentCount(60).build(),
                FacultyDashboardData.Subject.builder().id(2).name("DBMS").semester("4th").studentCount(58).build(),
                FacultyDashboardData.Subject.builder().id(3).name("Java Programming").semester("5th").studentCount(62).build()
        );

        var analytics = FacultyDashboardData.ClassAnalytics.builder()
                .totalStudents(180)
                .evaluated(140)
                .pending(40)
                .avgScore(78)
                .lowPerformers(12)
                .topPerformers(45)
                .build();

        var schedule = Arrays.asList(
                FacultyDashboardData.LabSchedule.builder().id(1).day("Mon").time("10:00 AM").lab("Lab 1 (DS)").batch("B1").build(),
                FacultyDashboardData.LabSchedule.builder().id(2).day("Tue").time("02:00 PM").lab("Lab 2 (DBMS)").batch("B2").build(),
                FacultyDashboardData.LabSchedule.builder().id(3).day("Thu").time("11:00 AM").lab("Lab 3 (Java)").batch("B3").build()
        );

        return FacultyDashboardData.builder()
                .profile(profile)
                .subjects(subjects)
                .analytics(analytics)
                .labSchedule(schedule)
                .build();
    }
}
