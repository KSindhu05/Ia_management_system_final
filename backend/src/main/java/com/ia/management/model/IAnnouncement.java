package com.ia.management.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ia_announcements")
public class IAnnouncement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private User faculty;

    @Column(nullable = false)
    private Integer cieNumber; // 1-5

    @Column(nullable = false)
    private LocalDate scheduledDate;

    private Integer durationMinutes = 60; // Default 60 mins

    @Column(length = 50)
    private String examRoom;

    @Column(name = "start_time")
    private java.time.LocalTime startTime;

    @Column(columnDefinition = "TEXT")
    private String syllabusCoverage;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Enumerated(EnumType.STRING)
    private AnnouncementStatus status = AnnouncementStatus.SCHEDULED;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AnnouncementStatus {
        SCHEDULED, COMPLETED, CANCELLED
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public User getFaculty() {
        return faculty;
    }

    public void setFaculty(User faculty) {
        this.faculty = faculty;
    }

    public Integer getCieNumber() {
        return cieNumber;
    }

    public void setCieNumber(Integer cieNumber) {
        this.cieNumber = cieNumber;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getExamRoom() {
        return examRoom;
    }

    public void setExamRoom(String examRoom) {
        this.examRoom = examRoom;
    }

    public java.time.LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(java.time.LocalTime startTime) {
        this.startTime = startTime;
    }

    public String getSyllabusCoverage() {
        return syllabusCoverage;
    }

    public void setSyllabusCoverage(String syllabusCoverage) {
        this.syllabusCoverage = syllabusCoverage;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public AnnouncementStatus getStatus() {
        return status;
    }

    public void setStatus(AnnouncementStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
