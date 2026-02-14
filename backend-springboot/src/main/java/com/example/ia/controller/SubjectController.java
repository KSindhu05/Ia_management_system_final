package com.example.ia.controller;

import com.example.ia.entity.Subject;
import com.example.ia.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    SubjectRepository subjectRepository;

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('HOD') or hasRole('PRINCIPAL') or hasRole('FACULTY')")
    public List<Subject> getSubjectsByDepartment(@PathVariable String department) {
        return subjectRepository.findByDepartment(department);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('HOD') or hasRole('PRINCIPAL')")
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }
}
