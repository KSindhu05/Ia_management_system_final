package com.ia.management.repository;

import com.ia.management.model.IAnnouncement;
import com.ia.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
// Forced update to trigger recompile
public interface IAnnouncementRepository extends JpaRepository<IAnnouncement, Long> {
        List<IAnnouncement> findByFaculty(User faculty);

        List<IAnnouncement> findBySubject_IdInAndScheduledDateAfterOrderByScheduledDateAsc(List<Long> subjectIds,
                        LocalDate date);

        List<IAnnouncement> findBySubject_DepartmentAndScheduledDateAfterOrderByScheduledDateAsc(String department,
                        LocalDate date);

        java.util.Optional<IAnnouncement> findBySubjectIdAndCieNumber(Long subjectId, Integer cieNumber);

        // For HOD checks (department agnostic query, filtering done in service or by
        // department field if added to subject/user entities properly)
        // As per current structure, subjects might not have direct department link in
        // DB entity if not added.
        // Assuming Subject entity has department field or we join User(Faculty)
        // department.
        // Let's assume Subject has 'department' string field based on context, or use
        // faculty's department.
}
