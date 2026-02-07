package com.ia.management.controller;

import com.ia.management.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/marks/{department}/pdf")
    public ResponseEntity<byte[]> downloadMarksPdf(@PathVariable String department) {
        try {
            byte[] pdfBytes = reportService.generateDepartmentMarksPdf(department);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "Marks_Report_" + department + ".pdf";
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/attendance/{subjectId}/csv")
    public ResponseEntity<byte[]> downloadAttendanceCsv(@PathVariable Long subjectId) {
        try {
            byte[] csvBytes = reportService.generateSubjectAttendanceCsv(subjectId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN); // Or text/csv
            String filename = "Attendance_Report_" + subjectId + ".csv";
            headers.setContentDispositionFormData("attachment", filename);
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
