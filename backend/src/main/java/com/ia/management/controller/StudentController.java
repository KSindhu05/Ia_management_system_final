package com.ia.management.controller;

import com.ia.management.model.StudentDashboardData;
import com.ia.management.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/dashboard")
    public StudentDashboardData getDashboardData() {
        return studentService.getDashboardData();
    }
}
