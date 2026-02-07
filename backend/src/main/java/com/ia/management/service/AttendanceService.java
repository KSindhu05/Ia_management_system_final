package com.ia.management.service;

import com.ia.management.model.Attendance;
import com.ia.management.model.Attendance.AttendanceStatus;
import com.ia.management.model.Student;
import com.ia.management.model.Subject;
import com.ia.management.repository.AttendanceRepository;
import com.ia.management.repository.StudentRepository;
import com.ia.management.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Transactional
    public void saveAttendanceBatch(Long subjectId, LocalDate date, List<Map<String, Object>> records) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        // Fetch existing records for this date/subject to optimize updates
        List<Attendance> existingDaily = attendanceRepository.findBySubjectIdAndDate(subjectId, date);
        Map<Long, Attendance> existingMap = existingDaily.stream()
                .collect(Collectors.toMap(a -> a.getStudent().getId(), a -> a));

        List<Attendance> toSave = new ArrayList<>();

        for (Map<String, Object> record : records) {
            Long studentId = Long.valueOf(record.get("studentId").toString());
            String statusStr = (String) record.get("status"); // "PRESENT", "ABSENT"
            if (statusStr == null)
                continue;

            Attendance.AttendanceStatus status;
            try {
                status = AttendanceStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                continue; // Skip invalid status
            }

            Attendance att = existingMap.get(studentId);
            if (att == null) {
                att = new Attendance();
                // Fetch student efficiently? Or assume loop is okay (studentRepo caching helps)
                Student student = studentRepository.getReferenceById(studentId);
                att.setStudent(student);
                att.setSubject(subject);
                att.setDate(date);
            }
            att.setStatus(status);
            toSave.add(att);
        }

        attendanceRepository.saveAll(toSave);
    }

    public List<Map<String, Object>> getAttendanceForDate(Long subjectId, LocalDate date) {
        List<Attendance> list = attendanceRepository.findBySubjectIdAndDate(subjectId, date);
        return list.stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("studentId", a.getStudent().getId());
            map.put("status", a.getStatus().name());
            return map;
        }).collect(Collectors.toList());
    }
}
