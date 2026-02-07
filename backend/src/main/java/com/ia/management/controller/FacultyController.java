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
    public FacultyDashboardData getDashboardData(java.security.Principal principal) {
        return facultyService.getDashboardData(principal.getName());
    }

    @GetMapping("/students")
    public java.util.List<com.ia.management.model.Student> getStudents(java.security.Principal principal) {
        return facultyService.getStudentsForFaculty(principal.getName());
    }

    @GetMapping("/my-subjects")
    public java.util.List<com.ia.management.model.Subject> getMySubjects(java.security.Principal principal) {
        return facultyService.getSubjectsForFaculty(principal.getName());
    }
}
