package com.ia.management.controller;

import com.ia.management.model.HODDashboardData;
import com.ia.management.service.HODService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hod")
public class HODController {

    @Autowired
    private HODService hodService;

    @GetMapping("/dashboard")
    public HODDashboardData getDashboardData() {
        return hodService.getDashboardData();
    }

    @GetMapping("/faculty")
    public org.springframework.http.ResponseEntity<java.util.List<com.ia.management.model.FacultyDTO>> getFacultyByDepartment(
            @org.springframework.web.bind.annotation.RequestParam String department) {
        return org.springframework.http.ResponseEntity.ok(hodService.getDepartmentFaculty(department));
    }

    @org.springframework.web.bind.annotation.PostMapping("/faculty")
    public org.springframework.http.ResponseEntity<?> addFaculty(
            @org.springframework.web.bind.annotation.RequestBody com.ia.management.model.CreateFacultyRequest request) {
        hodService.addFaculty(request);
        return org.springframework.http.ResponseEntity.ok("Faculty added successfully");
    }
}
