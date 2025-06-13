package com.example.backend.service;

import com.example.backend.entity.PasswordResetToken;
import com.example.backend.entity.User;
import com.example.backend.repository.PasswordResetTokenRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository, UserRepository userRepository, JavaMailSender mailSender, PasswordEncoder passwordEncoder) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public boolean createAndSendResetToken(String username, String email) {
        System.out.println("[PasswordResetService] Bắt đầu tạo và gửi token reset cho username: " + username + ", email: " + email);
        
        // Tìm user theo cả username và email
        User user = userRepository.findByUsernameAndEmail(username, email).orElse(null);
        if (user == null) {
            System.out.println("[PasswordResetService] Không tìm thấy user với username: " + username + " và email: " + email);
            return false;
        }

        // Xóa token cũ nếu có
        tokenRepository.deleteByUser(user);
        
        // Tạo token mới
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(resetToken);
        System.out.println("[PasswordResetService] Đã lưu token mới (token: " + token + ") cho user: " + user.getUsername());

        // Gửi mail với nội dung HTML đẹp hơn
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String subject = "Đặt lại mật khẩu tài khoản";
        String content = "Xin chào " + user.getUsername() + ",\n\n" +
                "Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào liên kết dưới đây để đặt lại mật khẩu mới (liên kết có hiệu lực 15 phút):\n" +
                resetLink +
                "\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(content);
        try {
            mailSender.send(message);
            System.out.println("[PasswordResetService] Đã gửi email thành công cho email: " + email);
        } catch (Exception e) {
            System.out.println("[PasswordResetService] Lỗi khi gửi email cho email: " + email + " – Lỗi: " + e.getMessage());
        }
        return true;
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) return false;
        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            return false;
        }
        User user = resetToken.getUser();
        // Mã hóa mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);
        return true;
    }
} 