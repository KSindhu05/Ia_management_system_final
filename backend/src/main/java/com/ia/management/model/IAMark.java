package com.ia.management.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "ia_marks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IAMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Enumerated(EnumType.STRING)
    private IAType iaType; // IA1, IA2, IA3

    private Double co1Score;
    private Double co2Score;
    private Double totalScore;

    private Integer attendancePercentage;
    private String remarks;

    @Enumerated(EnumType.STRING)
    private MarkStatus status = MarkStatus.PENDING;

    public enum IAType {
        CIE1, CIE2, CIE3, CIE4, CIE5
    }

    public enum MarkStatus {
        PENDING, SUBMITTED, APPROVED, REJECTED
    }
}
