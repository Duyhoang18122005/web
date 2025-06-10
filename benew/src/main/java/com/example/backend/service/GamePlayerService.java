package com.example.backend.service;

import com.example.backend.dto.GamePlayerStatusResponse;
import com.example.backend.entity.GamePlayer;
import com.example.backend.entity.Game;
import com.example.backend.entity.User;
import com.example.backend.repository.GamePlayerRepository;
import com.example.backend.repository.GameRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class GamePlayerService {
    private final GamePlayerRepository gamePlayerRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;

    public GamePlayerService(GamePlayerRepository gamePlayerRepository,
                           GameRepository gameRepository,
                           UserRepository userRepository) {
        this.gamePlayerRepository = gamePlayerRepository;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    public GamePlayer createGamePlayer(Long userId, Long gameId, String username,
                                     String rank, String role, String server,
                                     BigDecimal pricePerHour, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game not found"));

        GamePlayer gamePlayer = new GamePlayer();
        gamePlayer.setUser(user);
        gamePlayer.setGame(game);
        gamePlayer.setUsername(username);
        gamePlayer.setRank(rank);
        gamePlayer.setRole(role);
        gamePlayer.setServer(server);
        gamePlayer.setPricePerHour(pricePerHour);
        gamePlayer.setDescription(description);
        gamePlayer.setStatus("AVAILABLE");
        gamePlayer.setTotalGames(0);
        gamePlayer.setWinRate(0);

        return gamePlayerRepository.save(gamePlayer);
    }

    public GamePlayer updateGamePlayer(Long id, Long userId, Long gameId, String username, String rank, String role, String server, BigDecimal pricePerHour, String description) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game player not found"));

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            gamePlayer.setUser(user);
        }
        if (gameId != null) {
            Game game = gameRepository.findById(gameId)
                    .orElseThrow(() -> new ResourceNotFoundException("Game not found"));
            gamePlayer.setGame(game);
        }
        if (username != null) gamePlayer.setUsername(username);
        if (rank != null) gamePlayer.setRank(rank);
        if (role != null) gamePlayer.setRole(role);
        if (server != null) gamePlayer.setServer(server);
        if (pricePerHour != null) gamePlayer.setPricePerHour(pricePerHour);
        if (description != null) gamePlayer.setDescription(description);

        return gamePlayerRepository.save(gamePlayer);
    }

    public void deleteGamePlayer(Long id) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game player not found"));

        gamePlayerRepository.delete(gamePlayer);
    }

    public List<GamePlayer> getGamePlayersByGame(Long gameId) {
        return gamePlayerRepository.findByGameId(gameId);
    }

    public List<GamePlayer> getGamePlayersByUser(Long userId) {
        return gamePlayerRepository.findByUserId(userId);
    }

    public List<GamePlayer> getGamePlayersByStatus(String status) {
        return gamePlayerRepository.findByStatus(status);
    }

    public List<GamePlayer> getGamePlayersByRank(String rank) {
        return gamePlayerRepository.findByRank(rank);
    }

    public List<GamePlayer> getGamePlayersByRole(String role) {
        return gamePlayerRepository.findByRole(role);
    }

    public List<GamePlayer> getGamePlayersByServer(String server) {
        return gamePlayerRepository.findByServer(server);
    }

    public List<GamePlayer> getAvailableGamePlayers() {
        return gamePlayerRepository.findByStatus("AVAILABLE");
    }

    public GamePlayer hireGamePlayer(Long id, Long userId, Integer hours) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game player not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!"AVAILABLE".equals(gamePlayer.getStatus())) {
            throw new IllegalStateException("Game player is not available");
        }

        gamePlayer.setHiredBy(user);
        gamePlayer.setStatus("HIRED");
        gamePlayer.setHireDate(LocalDate.now());
        gamePlayer.setHoursHired(hours);

        return gamePlayerRepository.save(gamePlayer);
    }

    public GamePlayer returnGamePlayer(Long id) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game player not found"));

        if (!"HIRED".equals(gamePlayer.getStatus())) {
            throw new IllegalStateException("Game player is not hired");
        }

        gamePlayer.setHiredBy(null);
        gamePlayer.setStatus("AVAILABLE");
        gamePlayer.setReturnDate(LocalDate.now());
        gamePlayer.setHoursHired(null);

        return gamePlayerRepository.save(gamePlayer);
    }

    public GamePlayer updateRating(Long id, Double rating) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game player not found"));

        gamePlayer.setRating(rating);
        return gamePlayerRepository.save(gamePlayer);
    }

    public GamePlayer updateStats(Long id, Integer totalGames, Integer winRate) {
        GamePlayer gamePlayer = gamePlayerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Game player not found"));

        gamePlayer.setTotalGames(totalGames);
        gamePlayer.setWinRate(winRate);
        return gamePlayerRepository.save(gamePlayer);
    }

    public List<GamePlayer> getAllGamePlayers() {
        return gamePlayerRepository.findAll();
    }

    public GamePlayer findById(Long id) {
        return gamePlayerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Game player not found with id: " + id));
    }

    public List<GamePlayer> findAll() {
        return gamePlayerRepository.findAll();
    }

    public List<GamePlayer> findByStatus(String status) {
        return gamePlayerRepository.findByStatus(status);
    }

    public List<GamePlayer> findByGameId(Long gameId) {
        return gamePlayerRepository.findByGameId(gameId);
    }

    public List<GamePlayer> findByUserId(Long userId) {
        return gamePlayerRepository.findByUserId(userId);
    }

    public GamePlayer save(GamePlayer gamePlayer) {
        return gamePlayerRepository.save(gamePlayer);
    }

    public void deleteById(Long id) {
        gamePlayerRepository.deleteById(id);
    }

    public GamePlayer hirePlayer(Long id, User user) {
        GamePlayer gamePlayer = findById(id);
        if (!"AVAILABLE".equals(gamePlayer.getStatus())) {
            throw new RuntimeException("Game player is not available for hire");
        }

        gamePlayer.setStatus("HIRED");
        gamePlayer.setHiredBy(user);
        gamePlayer.setHireDate(LocalDate.now());
        gamePlayer.setReturnDate(LocalDate.now().plusMonths(1)); // Default 1-month hire period

        return gamePlayerRepository.save(gamePlayer);
    }

    public GamePlayer returnPlayer(Long id) {
        GamePlayer gamePlayer = findById(id);
        gamePlayer.setStatus("AVAILABLE");
        gamePlayer.setHiredBy(null);
        gamePlayer.setHireDate(null);
        gamePlayer.setReturnDate(null);
        return gamePlayerRepository.save(gamePlayer);
    }

    public GamePlayerStatusResponse getPlayerStatus(Long playerId) {
        GamePlayer player = findById(playerId);
        if (player == null) {
            throw new ResourceNotFoundException("Player not found with id: " + playerId);
        }
        return new GamePlayerStatusResponse(player.getId(), player.getStatus());
    }
} 