package com.ia.management.repository;

import com.ia.management.model.IAMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IAMarkRepository extends JpaRepository<IAMark, Long> {
    List<IAMark> findByStudentIdAndSubjectId(Long studentId, Long subjectId);

    Optional<IAMark> findByStudentIdAndSubjectIdAndIaType(Long studentId, Long subjectId, IAMark.IAType iaType);

    List<IAMark> findByStudentId(Long studentId);

    List<IAMark> findBySubject_Department(String department);

    List<IAMark> findBySubjectIdAndIaType(Long subjectId, IAMark.IAType iaType);

    List<IAMark> findByStatusAndSubject_Department(IAMark.MarkStatus status, String department);
}
