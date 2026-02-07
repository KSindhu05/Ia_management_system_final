package com.ia.management.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Optional: Link to specific profiles
    private String associatedId; // e.g., Student RegNo or Faculty ID

    private String department; // "CS", "EC", etc.
    private String fullName;
    private String email;

    public enum Role {
        STUDENT,
        FACULTY,
        HOD,
        PRINCIPAL
    }
}
