package com.ia.management.controller;

import com.ia.management.model.Subject;
import com.ia.management.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for development
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Subject>> getSubjectsByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(subjectRepository.findByDepartment(department));
    }
}
