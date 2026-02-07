package com.ia.management.repository;

import com.ia.management.model.Attendance;
import com.ia.management.model.Attendance.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findBySubjectIdAndDate(Long subjectId, LocalDate date);

    List<Attendance> findByStudentId(Long studentId);

    // For counting attendance
    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    // For specific subject stats
    long countByStudentIdAndSubjectIdAndStatus(Long studentId, Long subjectId, AttendanceStatus status);

    long countBySubjectId(Long subjectId);

    List<Attendance> findBySubjectId(Long subjectId);

    // Query by Subject Department
    List<Attendance> findBySubject_Department(String department);
}
