package com.ia.management.controller;

import com.ia.management.model.FacultyDashboardData;
import com.ia.management.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping("/dashboard")
    public FacultyDashboardData getDashboardData() {
        return facultyService.getDashboardData();
    }
}
