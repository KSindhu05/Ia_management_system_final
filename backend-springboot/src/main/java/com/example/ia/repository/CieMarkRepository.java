package com.example.ia.repository;

import com.example.ia.entity.CieMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CieMarkRepository extends JpaRepository<CieMark, Long> {
    List<CieMark> findByStudent_Id(Long studentId);

    List<CieMark> findBySubject_Id(Long subjectId);

    Optional<CieMark> findByStudent_IdAndSubject_IdAndCieType(Long studentId, Long subjectId, String cieType);

    List<CieMark> findByStatus(String status);

    // For HOD pending approvals
    List<CieMark> findByStatusAndSubject_Department(String status, String department);
}
