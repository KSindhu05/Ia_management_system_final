package com.ia.management.controller;

import com.ia.management.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/department/{dept}/stats")
    public ResponseEntity<Map<String, Object>> getDepartmentStats(@PathVariable String dept) {
        return ResponseEntity.ok(analyticsService.getDepartmentStats(dept));
    }
}
