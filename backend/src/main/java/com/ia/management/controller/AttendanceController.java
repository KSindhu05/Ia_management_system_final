package com.ia.management.controller;

import com.ia.management.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/update")
    public ResponseEntity<?> updateAttendance(@RequestBody Map<String, Object> payload) {
        try {
            Long subjectId = Long.valueOf(payload.get("subjectId").toString());
            String dateStr = (String) payload.get("date");
            LocalDate date = LocalDate.parse(dateStr);
            List<Map<String, Object>> records = (List<Map<String, Object>>) payload.get("records");

            attendanceService.saveAttendanceBatch(subjectId, date, records);
            return ResponseEntity.ok("Attendance Saved Successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving attendance: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAttendance(
            @RequestParam Long subjectId,
            @RequestParam String date) {
        try {
            LocalDate d = LocalDate.parse(date);
            return ResponseEntity.ok(attendanceService.getAttendanceForDate(subjectId, d));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching attendance: " + e.getMessage());
        }
    }
}
