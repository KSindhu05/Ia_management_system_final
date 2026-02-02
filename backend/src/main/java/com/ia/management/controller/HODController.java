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
}
