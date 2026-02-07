package com.ia.management.service;

import com.ia.management.model.IAMark;
import com.ia.management.model.Student;
import com.ia.management.repository.IAMarkRepository;
import com.ia.management.repository.AttendanceRepository;
import com.ia.management.model.Attendance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

        @Autowired
        private IAMarkRepository markRepo;

        @Autowired
        private AttendanceRepository attendanceRepo;

        public Map<String, Object> getDepartmentStats(String dept) {
                List<IAMark> marks = markRepo.findBySubject_Department(dept);

                // Compute Average Mark
                double avg = marks.stream()
                                .mapToDouble(m -> m.getTotalScore() != null ? m.getTotalScore() : 0.0)
                                .average()
                                .orElse(0.0);

                // Compute Pass Percentage
                long passed = marks.stream()
                                .filter(m -> (m.getTotalScore() != null ? m.getTotalScore() : 0) >= 20)
                                .count();

                double passPct = marks.isEmpty() ? 0 : (double) passed / marks.size() * 100;

                // Group by Student
                Map<Student, Double> studentAvg = marks.stream()
                                .filter(m -> m.getStudent() != null)
                                .collect(Collectors.groupingBy(
                                                IAMark::getStudent,
                                                Collectors.averagingDouble(
                                                                m -> m.getTotalScore() != null ? m.getTotalScore()
                                                                                : 0.0)));

                // Top 5 Students
                List<Map<String, Object>> top = studentAvg.entrySet().stream()
                                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                                .limit(5)
                                .map(this::mapStudentScore)
                                .collect(Collectors.toList());

                // Low 5 Students
                List<Map<String, Object>> low = studentAvg.entrySet().stream()
                                .sorted((a, b) -> a.getValue().compareTo(b.getValue()))
                                .limit(5)
                                .map(this::mapStudentScore)
                                .collect(Collectors.toList());

                // Identifying "At Risk"
                Set<Long> riskIds = new HashSet<>();

                // Mark Risk
                studentAvg.forEach((s, avgScore) -> {
                        if (avgScore < 20)
                                riskIds.add(s.getId());
                });

                // Attendance Risk
                List<Attendance> attList = attendanceRepo.findBySubject_Department(dept);
                if (!attList.isEmpty()) {
                        Map<Long, Long> totalMap = attList.stream().collect(
                                        Collectors.groupingBy(a -> a.getStudent().getId(), Collectors.counting()));
                        Map<Long, Long> presentMap = attList.stream()
                                        .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                                        .collect(Collectors.groupingBy(a -> a.getStudent().getId(),
                                                        Collectors.counting()));

                        totalMap.forEach((sid, tot) -> {
                                long pres = presentMap.getOrDefault(sid, 0L);
                                if (tot > 0 && ((double) pres / tot) < 0.75) {
                                        riskIds.add(sid);
                                }
                        });
                }

                long atRiskCount = riskIds.size();

                Map<String, Object> result = new HashMap<>();
                result.put("average", Math.round(avg * 10.0) / 10.0);
                result.put("passPercentage", Math.round(passPct * 10.0) / 10.0);
                result.put("topPerformers", top);
                result.put("lowPerformers", low);
                result.put("totalEvaluations", marks.size());
                result.put("atRiskCount", atRiskCount);

                return result;
        }

        private Map<String, Object> mapStudentScore(Map.Entry<Student, Double> e) {
                Map<String, Object> map = new HashMap<>();
                map.put("name", e.getKey().getName());
                map.put("score", Math.round(e.getValue() * 10.0) / 10.0);
                map.put("regNo", e.getKey().getRegNo());
                return map;
        }
}
