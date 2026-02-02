package com.ia.management.controller;

import com.ia.management.model.PrincipalDashboardData;
import com.ia.management.service.PrincipalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/principal")
public class PrincipalController {

    @Autowired
    private PrincipalService principalService;

    @GetMapping("/dashboard")
    public PrincipalDashboardData getDashboardData() {
        return principalService.getDashboardData();
    }
}
