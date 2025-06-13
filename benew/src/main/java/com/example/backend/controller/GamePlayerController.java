package com.example.backend.controller.game;

import com.example.backend.dto.GamePlayerStatusResponse;
import com.example.backend.entity.GamePlayer;
import com.example.backend.service.GamePlayerService;
import com.example.backend.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

import com.example.backend.entity.Game;
import com.example.backend.repository.GameRepository;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.service.UserService;
import com.example.backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import com.example.backend.entity.Payment;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.service.NotificationService;
import org.springframework.security.core.Authentication;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/game-players")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Game Player", description = "Game player management APIs")
public class GamePlayerController {
    private final GamePlayerService gamePlayerService;
    private final GameRepository gameRepository;
    private final UserService userService;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;
    private static final Logger log = LoggerFactory.getLogger(GamePlayerController.class);

    public GamePlayerController(GamePlayerService gamePlayerService, GameRepository gameRepository, UserService userService, PaymentRepository paymentRepository, NotificationService notificationService) {
        this.gamePlayerService = gamePlayerService;
        this.gameRepository = gameRepository;
        this.userService = userService;
        this.paymentRepository = paymentRepository;
        this.notificationService = notificationService;
    }

    @Data
    public static class GamePlayerRequest {
        @NotNull(message = "User ID is required")
        private Long userId;

        @NotNull(message = "Game ID is required")
        private Long gameId;

        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Rank is required")
        private String rank;

        private String role;

        @NotBlank(message = "Server is required")
        private String server;

        @NotNull(message = "Price per hour is required")
        @DecimalMin(value = "0.0", message = "Price must be greater than 0")
        private BigDecimal pricePerHour;

        @Size(max = 500, message = "Description must be less than 500 characters")
        private String description;
    }

    @Data
    public static class HireRequest {
        @NotNull(message = "User ID is required")
        private Long userId;

        @NotNull(message = "Hours is required")
        @Min(value = 1, message = "Hours must be at least 1")
        private Integer hours;

        @NotNull(message = "Coin is required")
        @Positive(message = "Coin must be positive")
        private Long coin;

        @NotNull(message = "Start time is required")
        private LocalDateTime startTime;

        @NotNull(message = "End time is required")
        private LocalDateTime endTime;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PLAYER')")
    @Operation(summary = "Create a new game player")
    public ResponseEntity<ApiResponse<GamePlayer>> createGamePlayer(
            @Valid @RequestBody GamePlayerRequest request) {
        log.info("Creating game player with request: {}", request);
        log.info("Game ID from request: {}", request.getGameId());
        
        // Kiểm tra user đã có player chưa
        if (!gamePlayerService.getGamePlayersByUser(request.getUserId()).isEmpty()) {
            log.warn("User {} already has a player registered", request.getUserId());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "User đã đăng ký làm player rồi!", null));
        }

        User user = userService.findById(request.getUserId());
        // Kiểm tra thông tin bắt buộc
        if (user.getFullName() == null || user.getDateOfBirth() == null ||
            user.getPhoneNumber() == null || user.getAddress() == null) {
            log.warn("User {} has incomplete profile information", request.getUserId());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Bạn cần cập nhật đầy đủ thông tin cá nhân trước khi đăng ký làm player!", null));
        }

        try {
            Game game = gameRepository.findById(request.getGameId())
                    .orElseThrow(() -> new ResourceNotFoundException("Game not found"));
            log.info("Found game: {}", game);

            if (game.getHasRoles()) {
                if (request.getRole() == null || request.getRole().trim().isEmpty()) {
                    log.warn("Role is required for game {} but not provided", game.getName());
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(false, "Role is required for this game", null));
                }
                // Normalize role by trimming and converting to uppercase
                String normalizedRole = request.getRole().trim().toUpperCase();
                if (game.getAvailableRoles() != null) {
                    boolean isValidRole = game.getAvailableRoles().stream()
                        .map(String::trim)
                        .map(String::toUpperCase)
                        .anyMatch(role -> role.equals(normalizedRole));
                    if (!isValidRole) {
                        log.warn("Invalid role {} for game {}", normalizedRole, game.getName());
                        return ResponseEntity.badRequest()
                            .body(new ApiResponse<>(false, "Invalid role for this game. Available roles: " + 
                                String.join(", ", game.getAvailableRoles()), null));
                    }
                    // Use normalized role for saving
                    request.setRole(normalizedRole);
                }
            }

            // Tạo player từ thông tin user
            GamePlayer gamePlayer = gamePlayerService.createGamePlayer(
                user.getId(),
                request.getGameId(),
                request.getUsername(),
                request.getRank(),
                request.getRole(),
                request.getServer(),
                request.getPricePerHour(),
                request.getDescription()
            );
            log.info("Successfully created game player: {}", gamePlayer);
            return ResponseEntity.ok(new ApiResponse<>(true, "Game player created successfully", gamePlayer));
        } catch (ResourceNotFoundException e) {
            log.error("Error creating game player: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error creating game player", e);
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error creating game player: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PLAYER')")
    @Operation(summary = "Update a game player")
    public ResponseEntity<ApiResponse<GamePlayer>> updateGamePlayer(
            @PathVariable Long id,
            @Valid @RequestBody GamePlayerRequest request) {
        GamePlayer gamePlayer = gamePlayerService.updateGamePlayer(
            id,
            request.getUserId(),
            request.getGameId(),
            request.getUsername(),
            request.getRank(),
            request.getRole(),
            request.getServer(),
            request.getPricePerHour(),
            request.getDescription()
        );
        return ResponseEntity.ok(new ApiResponse<>(true, "Game player updated successfully", gamePlayer));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a game player")
    public ResponseEntity<ApiResponse<Void>> deleteGamePlayer(@PathVariable Long id) {
        gamePlayerService.deleteGamePlayer(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game player deleted successfully", null));
    }

    @GetMapping("/game/{gameId}")
    @Operation(summary = "Get game players by game")
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getGamePlayersByGame(@PathVariable Long gameId) {
        List<GamePlayer> gamePlayers = gamePlayerService.getGamePlayersByGame(gameId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game players retrieved successfully", gamePlayers));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get game players by user")
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getGamePlayersByUser(@PathVariable Long userId) {
        List<GamePlayer> gamePlayers = gamePlayerService.getGamePlayersByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game players retrieved successfully", gamePlayers));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get game players by status")
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getGamePlayersByStatus(@PathVariable String status) {
        List<GamePlayer> gamePlayers = gamePlayerService.getGamePlayersByStatus(status);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game players retrieved successfully", gamePlayers));
    }

    @GetMapping("/rank/{rank}")
    @Operation(summary = "Get game players by rank")
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getGamePlayersByRank(@PathVariable String rank) {
        List<GamePlayer> gamePlayers = gamePlayerService.getGamePlayersByRank(rank);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game players retrieved successfully", gamePlayers));
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "Get game players by role")
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getGamePlayersByRole(@PathVariable String role) {
        List<GamePlayer> gamePlayers = gamePlayerService.getGamePlayersByRole(role);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game players retrieved successfully", gamePlayers));
    }

    @GetMapping("/server/{server}")
    @Operation(summary = "Get game players by server")
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getGamePlayersByServer(@PathVariable String server) {
        List<GamePlayer> gamePlayers = gamePlayerService.getGamePlayersByServer(server);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game players retrieved successfully", gamePlayers));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available game players")
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getAvailableGamePlayers() {
        List<GamePlayer> gamePlayers = gamePlayerService.getAvailableGamePlayers();
        return ResponseEntity.ok(new ApiResponse<>(true, "Available game players retrieved successfully", gamePlayers));
    }

    @PostMapping("/{id}/hire")
    @PreAuthorize("hasRole('USER')")
    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Operation(summary = "Hire a game player")
    public ResponseEntity<ApiResponse<?>> hireGamePlayer(
            @PathVariable Long id,
            @Valid @RequestBody HireRequest request) {
        try {
            // Validate time
            if (request.getStartTime().isAfter(request.getEndTime())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Thời gian bắt đầu phải trước thời gian kết thúc", null));
            }
            if (request.getStartTime().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Thời gian bắt đầu phải sau thời gian hiện tại", null));
            }

            // Check if player is available
            GamePlayer gamePlayer = gamePlayerService.findById(id);
            if (!"AVAILABLE".equals(gamePlayer.getStatus())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Game player is not available", null));
            }

            // Check if player is already hired in the requested time period
            List<Payment> activeHires = paymentRepository.findByPlayerIdAndHireStatusAndEndTimeAfter(
                gamePlayer.getUser().getId(), Payment.HireStatus.ACTIVE, LocalDateTime.now());
            if (!activeHires.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Player đang được thuê trong khoảng thời gian này", null));
            }

            // Check user's coin balance
            User user = userService.findById(request.getUserId());
            if (user.getCoin() < request.getCoin()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Số coin không đủ", null));
            }

            // Update player status and create payment record
            GamePlayer updatedPlayer = gamePlayerService.hireGamePlayer(id, request.getUserId(), request.getHours());
            
            // Create payment record
            Payment payment = new Payment();
            payment.setUser(user);
            payment.setPlayer(gamePlayer.getUser());
            payment.setGamePlayer(gamePlayer);
            payment.setCoin(request.getCoin());
            payment.setCurrency("COIN");
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setPaymentMethod(Payment.PaymentMethod.HIRE);
            payment.setType(Payment.PaymentType.HIRE);
            payment.setCreatedAt(LocalDateTime.now());
            payment.setStartTime(request.getStartTime());
            payment.setEndTime(request.getEndTime());
            payment.setHireStatus(Payment.HireStatus.ACTIVE);
            payment = paymentRepository.save(payment);

            // Update coin balance
            user.setCoin(user.getCoin() - request.getCoin());
            gamePlayer.getUser().setCoin(gamePlayer.getUser().getCoin() + request.getCoin());
            userService.save(user);
            userService.save(gamePlayer.getUser());

            // Send notifications
            if (user.getDeviceToken() != null) {
                notificationService.sendPushNotification(
                    user.getDeviceToken(),
                    "Thuê player thành công!",
                    "Bạn đã thuê " + gamePlayer.getUsername() + " thành công với " + request.getCoin() + " coin.",
                    null
                );
            }
            if (gamePlayer.getUser().getDeviceToken() != null) {
                notificationService.sendPushNotification(
                    gamePlayer.getUser().getDeviceToken(),
                    "Có người thuê bạn!",
                    "Bạn đã được " + user.getUsername() + " thuê với " + request.getCoin() + " coin.",
                    null
                );
            }

            Map<String, Object> response = new HashMap<>();
            response.put("gamePlayer", updatedPlayer);
            response.put("payment", payment);
            response.put("coin", request.getCoin());
            response.put("startTime", request.getStartTime());
            response.put("endTime", request.getEndTime());

            return ResponseEntity.ok(new ApiResponse<>(true, "Game player hired successfully", response));
        } catch (Exception e) {
            log.error("Error hiring game player: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error hiring game player: " + e.getMessage(), null));
        }
    }

    @PostMapping("/{id}/return")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Return a game player")
    public ResponseEntity<ApiResponse<GamePlayer>> returnGamePlayer(@PathVariable Long id) {
        GamePlayer gamePlayer = gamePlayerService.returnGamePlayer(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game player returned successfully", gamePlayer));
    }

    @PutMapping("/{id}/rating")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Update game player rating")
    public ResponseEntity<ApiResponse<GamePlayer>> updateRating(
            @PathVariable Long id,
            @RequestParam @Min(0) @Max(5) Double rating) {
        GamePlayer gamePlayer = gamePlayerService.updateRating(id, rating);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game player rating updated successfully", gamePlayer));
    }

    @PutMapping("/{id}/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PLAYER')")
    @Operation(summary = "Update game player stats")
    public ResponseEntity<ApiResponse<GamePlayer>> updateStats(
            @PathVariable Long id,
            @RequestParam @Min(0) Integer totalGames,
            @RequestParam @Min(0) @Max(100) Integer winRate) {
        GamePlayer gamePlayer = gamePlayerService.updateStats(id, totalGames, winRate);
        return ResponseEntity.ok(new ApiResponse<>(true, "Game player stats updated successfully", gamePlayer));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GamePlayer>>> getAllGamePlayers() {
        List<GamePlayer> gamePlayers = gamePlayerService.getAllGamePlayers();
        return ResponseEntity.ok(new ApiResponse<>(true, "All game players retrieved successfully", gamePlayers));
    }

    @GetMapping("/{playerId}/status")
    public ResponseEntity<GamePlayerStatusResponse> getPlayerStatus(@PathVariable Long playerId) {
        try {
            GamePlayerStatusResponse status = gamePlayerService.getPlayerStatus(playerId);
            return ResponseEntity.ok(status);
        } catch (ResourceNotFoundException e) {
            log.error("Player not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (RuntimeException e) {
            log.error("Error getting player status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/cancel-hire")
    @PreAuthorize("hasRole('USER')")
    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Operation(summary = "Cancel a game player hire")
    public ResponseEntity<ApiResponse<?>> cancelHire(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            GamePlayer gamePlayer = gamePlayerService.findById(id);

            // Find active payment for this player
            List<Payment> activeHires = paymentRepository.findByPlayerIdAndHireStatusAndEndTimeAfter(
                gamePlayer.getUser().getId(), Payment.HireStatus.ACTIVE, LocalDateTime.now());
            
            if (activeHires.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Không tìm thấy hợp đồng thuê đang hoạt động", null));
            }

            Payment payment = activeHires.get(0);
            
            // Check if the user is the one who hired
            if (!payment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403)
                    .body(new ApiResponse<>(false, "Không có quyền hủy hợp đồng này", null));
            }

            // Check if the hire has started
            if (payment.getStartTime().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Không thể hủy hợp đồng đã bắt đầu", null));
            }

            // Update payment status
            payment.setHireStatus(Payment.HireStatus.CANCELED);
            paymentRepository.save(payment);

            // Return player status to AVAILABLE
            gamePlayer.setStatus("AVAILABLE");
            gamePlayer.setHiredBy(null);
            gamePlayer.setHireDate(null);
            gamePlayer.setReturnDate(null);
            gamePlayer.setHoursHired(null);
            gamePlayerService.save(gamePlayer);

            // Refund coins
            user.setCoin(user.getCoin() + payment.getCoin());
            gamePlayer.getUser().setCoin(gamePlayer.getUser().getCoin() - payment.getCoin());
            userService.save(user);
            userService.save(gamePlayer.getUser());

            // Send notifications
            if (user.getDeviceToken() != null) {
                notificationService.sendPushNotification(
                    user.getDeviceToken(),
                    "Hủy hợp đồng thành công",
                    "Bạn đã được hoàn lại " + payment.getCoin() + " coin.",
                    null
                );
            }
            if (gamePlayer.getUser().getDeviceToken() != null) {
                notificationService.sendPushNotification(
                    gamePlayer.getUser().getDeviceToken(),
                    "Hợp đồng bị hủy",
                    "Hợp đồng với " + user.getUsername() + " đã bị hủy.",
                    null
                );
            }

            Map<String, Object> response = new HashMap<>();
            response.put("gamePlayer", gamePlayer);
            response.put("payment", payment);
            response.put("refundedCoin", payment.getCoin());

            return ResponseEntity.ok(new ApiResponse<>(true, "Hủy hợp đồng thành công", response));
        } catch (Exception e) {
            log.error("Error canceling hire: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error canceling hire: " + e.getMessage(), null));
        }
    }

    @GetMapping("/hired")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get list of currently hired players")
    public ResponseEntity<ApiResponse<?>> getHiredPlayers(Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            
            // Get all active payments for the user
            List<Payment> activeHires = paymentRepository.findByUserIdAndHireStatusAndEndTimeAfter(
                user.getId(), Payment.HireStatus.ACTIVE, LocalDateTime.now());

            List<Map<String, Object>> hiredPlayers = activeHires.stream()
                .map(payment -> {
                    Map<String, Object> playerInfo = new HashMap<>();
                    GamePlayer gamePlayer = payment.getGamePlayer();
                    playerInfo.put("gamePlayer", gamePlayer);
                    playerInfo.put("payment", payment);
                    playerInfo.put("startTime", payment.getStartTime());
                    playerInfo.put("endTime", payment.getEndTime());
                    playerInfo.put("coin", payment.getCoin());
                    return playerInfo;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully retrieved hired players", hiredPlayers));
        } catch (Exception e) {
            log.error("Error getting hired players: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error getting hired players: " + e.getMessage(), null));
        }
    }

    @GetMapping("/hired-by-me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get list of players hired by the current user")
    public ResponseEntity<ApiResponse<?>> getPlayersHiredByMe(Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            
            // Get all active payments where the user is the hirer
            List<Payment> activeHires = paymentRepository.findByUserIdAndHireStatusAndEndTimeAfter(
                user.getId(), Payment.HireStatus.ACTIVE, LocalDateTime.now());

            List<Map<String, Object>> hiredPlayers = activeHires.stream()
                .map(payment -> {
                    Map<String, Object> playerInfo = new HashMap<>();
                    GamePlayer gamePlayer = payment.getGamePlayer();
                    playerInfo.put("gamePlayer", gamePlayer);
                    playerInfo.put("payment", payment);
                    playerInfo.put("startTime", payment.getStartTime());
                    playerInfo.put("endTime", payment.getEndTime());
                    playerInfo.put("coin", payment.getCoin());
                    return playerInfo;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully retrieved players hired by you", hiredPlayers));
        } catch (Exception e) {
            log.error("Error getting players hired by user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error getting players hired by you: " + e.getMessage(), null));
        }
    }

    @GetMapping("/hired-by-others")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get list of players that are currently hired by others")
    public ResponseEntity<ApiResponse<?>> getPlayersHiredByOthers(Authentication authentication) {
        try {
            User user = userService.findByUsername(authentication.getName());
            
            // Get all active payments where the user is the player
            List<Payment> activeHires = paymentRepository.findByPlayerIdAndHireStatusAndEndTimeAfter(
                user.getId(), Payment.HireStatus.ACTIVE, LocalDateTime.now());

            List<Map<String, Object>> hiredPlayers = activeHires.stream()
                .map(payment -> {
                    Map<String, Object> playerInfo = new HashMap<>();
                    GamePlayer gamePlayer = payment.getGamePlayer();
                    playerInfo.put("gamePlayer", gamePlayer);
                    playerInfo.put("payment", payment);
                    playerInfo.put("startTime", payment.getStartTime());
                    playerInfo.put("endTime", payment.getEndTime());
                    playerInfo.put("coin", payment.getCoin());
                    playerInfo.put("hirer", payment.getUser());
                    return playerInfo;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully retrieved players hired by others", hiredPlayers));
        } catch (Exception e) {
            log.error("Error getting players hired by others: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error getting players hired by others: " + e.getMessage(), null));
        }
    }

    @GetMapping("/game/{gameId}/roles")
    @Operation(summary = "Get game roles")
    public ResponseEntity<ApiResponse<List<String>>> getGameRoles(@PathVariable Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));
        
        List<String> roles = new ArrayList<>();
        if (game.getHasRoles() && game.getAvailableRoles() != null) {
            roles.addAll(game.getAvailableRoles());
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Roles found", roles));
    }

    @GetMapping("/games")
    @Operation(summary = "Get all games")
    public ResponseEntity<ApiResponse<List<Game>>> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Games found", games));
    }

    @GetMapping("/debug/games")
    @Operation(summary = "Debug endpoint to check game data")
    public ResponseEntity<ApiResponse<?>> debugGames() {
        List<Game> games = gameRepository.findAll();
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("totalGames", games.size());
        debugInfo.put("games", games.stream().map(game -> {
            Map<String, Object> gameInfo = new HashMap<>();
            gameInfo.put("id", game.getId());
            gameInfo.put("name", game.getName());
            gameInfo.put("hasRoles", game.getHasRoles());
            gameInfo.put("availableRoles", game.getAvailableRoles());
            gameInfo.put("availableRanks", game.getAvailableRanks());
            return gameInfo;
        }).collect(Collectors.toList()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Debug info", debugInfo));
    }
} 