package com.ia.management.repository;

import com.ia.management.model.Notification;
import com.ia.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// Forced update to trigger recompile
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    Long countByUserAndIsReadFalse(User user);
}
