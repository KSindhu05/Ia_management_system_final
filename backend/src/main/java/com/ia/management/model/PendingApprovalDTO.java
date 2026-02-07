package com.ia.management.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for aggregating pending mark submissions for HOD approval
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingApprovalDTO {
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private String iaType;
    private String facultyName;
    private int studentCount;
    private String submittedDate;
    private List<StudentMarkDTO> marks;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentMarkDTO {
        private Long studentId;
        private String regNo;
        private String studentName;
        private Double totalScore;
    }
}
