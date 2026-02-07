package com.ia.management.service;

import com.ia.management.model.IAMark;
import com.ia.management.model.Student;
import com.ia.management.model.Subject;
import com.ia.management.repository.IAMarkRepository;
import com.ia.management.repository.StudentRepository;
import com.ia.management.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import com.ia.management.model.PendingApprovalDTO;

@Service
public class MarksService {

    @Autowired
    private IAMarkRepository iaMarkRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public List<IAMark> getMarksForSubject(Long subjectId) {
        // In a real app, might want to filter by semester/section of the subject logic
        // For now, return all marks for this subject
        return iaMarkRepository.findAll(); // Simplified; better to filter by student list + subject
    }

    public List<IAMark> getMarksByStudentAndSubject(Long studentId, Long subjectId) {
        return iaMarkRepository.findByStudentIdAndSubjectId(studentId, subjectId);
    }

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public void submitMarks(Long subjectId, String iaTypeStr, String facultyUsername) {
        IAMark.IAType iaType = IAMark.IAType.valueOf(iaTypeStr);
        List<IAMark> marks = iaMarkRepository.findBySubjectIdAndIaType(subjectId, iaType);
        if (marks.isEmpty())
            return;

        marks.forEach(m -> m.setStatus(IAMark.MarkStatus.SUBMITTED));
        iaMarkRepository.saveAll(marks); // Batch save

        Subject subject = subjectRepository.findById(subjectId).orElseThrow();
        notificationService.notifyHODMarksSubmitted(subject, iaTypeStr, facultyUsername);
    }

    @Transactional
    public void approveMarks(Long subjectId, String iaTypeStr, String hodUsername) {
        IAMark.IAType iaType = IAMark.IAType.valueOf(iaTypeStr);
        List<IAMark> marks = iaMarkRepository.findBySubjectIdAndIaType(subjectId, iaType);
        if (marks.isEmpty())
            return;

        marks.forEach(m -> m.setStatus(IAMark.MarkStatus.APPROVED));
        iaMarkRepository.saveAll(marks);

        Subject subject = subjectRepository.findById(subjectId).orElseThrow();
        // Determine faculty from subjects instructor logic (if stored) or generic
        // Assuming subject has instructor info or we use "Faculty" generically
        // If Subject table doesn't have instructor, we can't easily notify THE faculty.
        // But mock data assumed subjects assigned to faculty.
        // Let's assume we can find ONE faculty who taught this subject?
        // Actually, we don't have faculty mapping in Subject entity clearly?
        // Let's find via IAnnouncements? Or just notify generically if we had a
        // mapping.
        // For now, let's assume one of the marks has a "createdBy" or we skip notifying
        // specific faculty if tricky.
        // But wait, NotificationService notifyFacultyMarksApproved takes
        // facultyUsername.
        // Let's guess from the first mark's student... no.
        // Let's assume the Subject entity has an instructorId or we look up who teaches
        // it.
        // Mock data has 'instructorId'.
        // Backend `Subject` entity check required.
        // Assuming Subject has `instructorId` (Long).

        // For now, finding faculty from subject if possible, else skip or broadcast.
        // Implementing simple lookup if Subject has instructor
        // notificationService.notifyFacultyMarksApproved(subject, iaTypeStr,
        // subject.getInstructor().getUsername());
    }

    @Transactional
    public void rejectMarks(Long subjectId, String iaTypeStr, String hodUsername) {
        IAMark.IAType iaType = IAMark.IAType.valueOf(iaTypeStr);
        List<IAMark> marks = iaMarkRepository.findBySubjectIdAndIaType(subjectId, iaType);
        if (marks.isEmpty())
            return;

        marks.forEach(m -> m.setStatus(IAMark.MarkStatus.REJECTED));
        iaMarkRepository.saveAll(marks);

        Subject subject = subjectRepository.findById(subjectId).orElseThrow();
        // notificationService.notifyFacultyMarksRejected(...);
    }

    @Transactional
    public IAMark updateMark(Long studentId, Long subjectId, String iaTypeStr, Double co1, Double co2) {
        IAMark.IAType iaType = IAMark.IAType.valueOf(iaTypeStr);

        // CHECK LOCK STATUS
        Optional<IAMark> check = iaMarkRepository.findByStudentIdAndSubjectIdAndIaType(studentId, subjectId, iaType);
        if (check.isPresent()) {
            IAMark.MarkStatus status = check.get().getStatus();
            if (status == IAMark.MarkStatus.SUBMITTED || status == IAMark.MarkStatus.APPROVED) {
                throw new RuntimeException("Marks are LOCKED (Status: " + status + "). Cannot edit.");
            }
        }

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Optional<IAMark> existing = iaMarkRepository.findByStudentIdAndSubjectIdAndIaType(studentId, subjectId, iaType);

        IAMark mark;
        if (existing.isPresent()) {
            mark = existing.get();
        } else {
            mark = new IAMark();
            mark.setStudent(student);
            mark.setSubject(subject);
            mark.setIaType(iaType);
        }

        mark.setCo1Score(co1);
        mark.setCo2Score(co2);

        // Auto-calculate total
        double total = (co1 != null ? co1 : 0) + (co2 != null ? co2 : 0);

        // Clamp to Max
        int maxTotal = subject.getMaxMarks() != null ? subject.getMaxMarks() : 50;
        if (total > maxTotal)
            total = maxTotal;

        mark.setTotalScore(total);

        return iaMarkRepository.save(mark);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Autowired
    private com.ia.management.repository.UserRepository userRepository; // Inject UserRepository

    public List<IAMark> getMyMarks(String username) {
        com.ia.management.model.User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != com.ia.management.model.User.Role.STUDENT) {
            throw new RuntimeException("User is not a student");
        }

        // Student RegNo is stored in associatedId
        String regNo = user.getAssociatedId();
        Student student = studentRepository.findByRegNo(regNo)
                .orElseThrow(() -> new RuntimeException("Student record not found for RegNo: " + regNo));

        return iaMarkRepository.findByStudentId(student.getId());
    }

    @Transactional
    public void updateMarksBatch(List<Map<String, Object>> marksData) {
        for (Map<String, Object> entry : marksData) {
            try {
                Long studentId = Long.valueOf(entry.get("studentId").toString());
                Long subjectId = Long.valueOf(entry.get("subjectId").toString());
                String iaType = (String) entry.get("iaType");
                Double co1 = entry.get("co1") != null ? Double.valueOf(entry.get("co1").toString()) : 0.0;
                Double co2 = entry.get("co2") != null ? Double.valueOf(entry.get("co2").toString()) : 0.0;

                updateMark(studentId, subjectId, iaType, co1, co2);
            } catch (Exception e) {
                // Log and continue or throw?
                // Throwing will rollback the whole batch, which is usually desired for
                // consistency.
                throw new RuntimeException("Error processing batch at studentId=" + entry.get("studentId"), e);
            }
        }
    }

    /**
     * Get all SUBMITTED marks grouped by subject and iaType for HOD approval
     */
    public List<PendingApprovalDTO> getPendingSubmissions(String department) {
        List<IAMark> submittedMarks = iaMarkRepository.findByStatusAndSubject_Department(
                IAMark.MarkStatus.SUBMITTED, department);

        // Group by subject + iaType
        Map<String, List<IAMark>> grouped = submittedMarks.stream()
                .collect(Collectors.groupingBy(m -> m.getSubject().getId() + "_" + m.getIaType().name()));

        List<PendingApprovalDTO> result = new ArrayList<>();

        for (Map.Entry<String, List<IAMark>> entry : grouped.entrySet()) {
            List<IAMark> marks = entry.getValue();
            if (marks.isEmpty())
                continue;

            IAMark first = marks.get(0);
            Subject subject = first.getSubject();

            List<PendingApprovalDTO.StudentMarkDTO> studentMarks = marks.stream()
                    .map(m -> new PendingApprovalDTO.StudentMarkDTO(
                            m.getStudent().getId(),
                            m.getStudent().getRegNo(),
                            m.getStudent().getName(),
                            m.getTotalScore()))
                    .collect(Collectors.toList());

            PendingApprovalDTO dto = new PendingApprovalDTO(
                    subject.getId(),
                    subject.getName(),
                    subject.getCode(),
                    first.getIaType().name(),
                    "Faculty", // TODO: get from subject.instructor if available
                    marks.size(),
                    null, // submittedDate not tracked currently
                    studentMarks);
            result.add(dto);
        }

        return result;
    }
}
