package com.example.backend.service;

import com.example.backend.dto.PlayerStatsDTO;
import com.example.backend.dto.ReviewDTO;
import com.example.backend.dto.HireStatsDTO;
import com.example.backend.entity.Payment;
import com.example.backend.entity.PlayerReview;
import com.example.backend.entity.User;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.repository.PlayerReviewRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlayerStatsService {
    private final PaymentRepository paymentRepository;
    private final PlayerReviewRepository playerReviewRepository;
    private final UserRepository userRepository;

    public PlayerStatsService(PaymentRepository paymentRepository,
                            PlayerReviewRepository playerReviewRepository,
                            UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.playerReviewRepository = playerReviewRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PlayerStatsDTO getPlayerStats(Long playerId) {
        User player = userRepository.findById(playerId)
            .orElseThrow(() -> new RuntimeException("Player not found"));

        // Lấy tất cả các lượt thuê của player
        List<Payment> hires = paymentRepository.findByPlayerIdAndTypeOrderByCreatedAtDesc(playerId, Payment.PaymentType.HIRE);
        
        // Lấy tất cả đánh giá của player
        List<PlayerReview> reviews = playerReviewRepository.findByPlayerId(playerId);

        PlayerStatsDTO stats = new PlayerStatsDTO();
        stats.setPlayerId(playerId);
        stats.setPlayerName(player.getUsername());

        // Tính toán thống kê cơ bản
        stats.setTotalHires(hires.size());
        stats.setCompletedHires((int) hires.stream()
            .filter(h -> Payment.HireStatus.COMPLETED.equals(h.getHireStatus()))
            .count());
        stats.setTotalHireHours(calculateTotalHours(hires));
        stats.setCompletionRate(calculateCompletionRate(hires));
        stats.setTotalEarnings(calculateTotalEarnings(hires));

        // Tính toán rating
        Double averageRating = playerReviewRepository.getAverageRatingByPlayerId(playerId);
        stats.setAverageRating(averageRating != null ? averageRating : 0.0);
        stats.setTotalReviews(reviews.size());

        // Lấy 5 đánh giá gần nhất
        stats.setRecentReviews(getRecentReviews(reviews));

        // Tính toán thống kê theo thời gian
        stats.setHireStats(getHireStatsByPeriod(hires));

        return stats;
    }

    private Integer calculateTotalHours(List<Payment> hires) {
        return hires.stream()
            .filter(h -> h.getStartTime() != null && h.getEndTime() != null)
            .mapToInt(h -> {
                long hours = java.time.Duration.between(h.getStartTime(), h.getEndTime()).toHours();
                return (int) hours;
            })
            .sum();
    }

    private Double calculateCompletionRate(List<Payment> hires) {
        if (hires.isEmpty()) return 0.0;
        long completed = hires.stream()
            .filter(h -> Payment.HireStatus.COMPLETED.equals(h.getHireStatus()))
            .count();
        return (double) completed / hires.size() * 100;
    }

    private Long calculateTotalEarnings(List<Payment> hires) {
        return hires.stream()
            .filter(h -> Payment.HireStatus.COMPLETED.equals(h.getHireStatus()))
            .mapToLong(Payment::getCoin)
            .sum();
    }

    private List<ReviewDTO> getRecentReviews(List<PlayerReview> reviews) {
        return reviews.stream()
            .sorted(Comparator.comparing(PlayerReview::getCreatedAt).reversed())
            .limit(5)
            .map(review -> {
                ReviewDTO dto = new ReviewDTO();
                dto.setReviewId(review.getId());
                dto.setRating(review.getRating());
                dto.setComment(review.getComment());
                dto.setReviewerName(review.getReviewer().getUsername());
                dto.setCreatedAt(review.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                return dto;
            })
            .collect(Collectors.toList());
    }

    private List<HireStatsDTO> getHireStatsByPeriod(List<Payment> hires) {
        Map<String, HireStatsDTO> statsMap = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Payment hire : hires) {
            String period = hire.getCreatedAt().format(formatter);
            HireStatsDTO stats = statsMap.computeIfAbsent(period, k -> {
                HireStatsDTO dto = new HireStatsDTO();
                dto.setPeriod(k);
                dto.setTotalHires(0);
                dto.setCompletedHires(0);
                dto.setTotalHours(0);
                dto.setEarnings(0L);
                return dto;
            });

            stats.setTotalHires(stats.getTotalHires() + 1);
            if (Payment.HireStatus.COMPLETED.equals(hire.getHireStatus())) {
                stats.setCompletedHires(stats.getCompletedHires() + 1);
                if (hire.getStartTime() != null && hire.getEndTime() != null) {
                    long hours = java.time.Duration.between(hire.getStartTime(), hire.getEndTime()).toHours();
                    stats.setTotalHours(stats.getTotalHours() + (int) hours);
                }
                stats.setEarnings(stats.getEarnings() + hire.getCoin());
            }
        }

        return new ArrayList<>(statsMap.values());
    }
} 