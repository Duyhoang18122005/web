package com.example.backend.controller;

import com.example.backend.entity.Notification;
import com.example.backend.entity.User;
import com.example.backend.service.NotificationService;
import com.example.backend.service.UserService;
import com.example.backend.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Notification", description = "Notification management APIs")
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @Operation(summary = "Create a new notification")
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Notification> createNotification(
            @Valid @RequestBody NotificationRequest request) {
        try {
            Notification notification = notificationService.createNotification(
                    request.getUserId(),
                    request.getTitle(),
                    request.getMessage(),
                    request.getType(),
                    request.getActionUrl()
            );
            return ResponseEntity.ok(notification);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Mark notification as read")
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Notification> markAsRead(
            @Parameter(description = "Notification ID") @PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete a notification")
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(
            @Parameter(description = "Notification ID") @PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Get user notifications")
    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getUserNotifications(
                Long.parseLong(authentication.getName())));
    }

    @Operation(summary = "Get unread notifications")
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(
                Long.parseLong(authentication.getName())));
    }

    @Operation(summary = "Get notifications by type")
    @GetMapping("/type/{type}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getNotificationsByType(
            @Parameter(description = "Notification type") @PathVariable String type,
            Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotificationsByType(
                Long.parseLong(authentication.getName()),
                type));
    }

    @Operation(summary = "Get recent notifications")
    @GetMapping("/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getRecentNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getRecentNotifications(
                Long.parseLong(authentication.getName())));
    }

    @Operation(summary = "Update device token for push notifications")
    @PostMapping("/device-token")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateDeviceToken(
            @Valid @RequestBody DeviceTokenRequest request,
            Authentication authentication) {
        System.out.println("[NotificationController] ====== START updateDeviceToken ======");
        System.out.println("[NotificationController] Request body: " + request);
        System.out.println("[NotificationController] Authentication: " + authentication);
        System.out.println("[NotificationController] Authentication name: " + authentication.getName());
        System.out.println("[NotificationController] Authentication authorities: " + authentication.getAuthorities());
        
        try {
            String username = authentication.getName();
            System.out.println("[NotificationController] username từ authentication: " + username);
            User user = userService.findByUsername(username);
            System.out.println("[NotificationController] Found user: " + user);
            System.out.println("[NotificationController] Current device token: " + user.getDeviceToken());
            System.out.println("[NotificationController] New device token: " + request.getDeviceToken());
            
            Long userId = user.getId();
            System.out.println("[NotificationController] userId từ userService: " + userId);
            notificationService.updateDeviceToken(userId, request.getDeviceToken());
            System.out.println("[NotificationController] Đã gọi service cập nhật device token thành công");
            System.out.println("[NotificationController] ====== END updateDeviceToken ======");
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            System.out.println("[NotificationController] ResourceNotFoundException: " + e.getMessage());
            e.printStackTrace();
            System.out.println("[NotificationController] ====== END updateDeviceToken with error ======");
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("[NotificationController] Exception: " + e.getMessage());
            e.printStackTrace();
            System.out.println("[NotificationController] ====== END updateDeviceToken with error ======");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred: " + e.getMessage());
        }
    }
}

@Data
class NotificationRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Type is required")
    private String type;

    private String actionUrl;
}

@Data
class DeviceTokenRequest {
    @NotBlank(message = "Device token is required")
    private String deviceToken;
} 