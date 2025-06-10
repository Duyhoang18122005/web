package com.example.backend.repository;

import com.example.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserId(Long userId);
    List<Payment> findByGamePlayerId(Long gamePlayerId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    List<Payment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Payment> findByUserIdAndStatus(Long userId, Payment.PaymentStatus status);
    List<Payment> findByUserIdAndTypeOrderByCreatedAtDesc(Long userId, Payment.PaymentType type);
    List<Payment> findByPlayerIdAndTypeOrderByCreatedAtDesc(Long playerId, Payment.PaymentType type);
    List<Payment> findByPlayerIdAndHireStatusAndEndTimeAfter(Long playerId, Payment.HireStatus hireStatus, LocalDateTime endTime);
    List<Payment> findByUserIdAndHireStatusAndEndTimeAfter(Long userId, Payment.HireStatus hireStatus, LocalDateTime endTime);
} 