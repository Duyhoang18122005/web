package com.example.backend.controller;

import com.example.backend.entity.PlayerImage;
import com.example.backend.service.PlayerImageService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.util.List;
import java.util.stream.Collectors;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/game-players/{playerId}/images")
public class PlayerImageController {
    private final PlayerImageService playerImageService;

    @Value("${player.image.upload-dir:uploads/player-images}")
    private String uploadDir;

    public PlayerImageController(PlayerImageService playerImageService) {
        this.playerImageService = playerImageService;
    }

    @Operation(summary = "Get all images of a player")
    @GetMapping
    public ResponseEntity<List<String>> getPlayerImages(@PathVariable Long playerId) {
        List<String> imageUrls = playerImageService.getImagesByPlayerId(playerId)
                .stream().map(PlayerImage::getImageUrl).collect(Collectors.toList());
        return ResponseEntity.ok(imageUrls);
    }

    @Operation(summary = "Upload image to player's gallery")
    @PostMapping
    public ResponseEntity<String> uploadPlayerImage(@PathVariable Long playerId, @RequestParam("file") MultipartFile file) throws IOException {
        // Lưu file vào thư mục uploads/player-images
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, fileName);
        file.transferTo(dest);
        // Tạo URL truy cập ảnh
        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/" + uploadDir + "/")
                .path(fileName)
                .toUriString();
        playerImageService.addImageToPlayer(playerId, fileUrl);
        return ResponseEntity.ok(fileUrl);
    }

    @Operation(summary = "Delete image from player's gallery")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deletePlayerImage(@PathVariable Long playerId, @PathVariable Long imageId) {
        playerImageService.deleteImage(imageId);
        return ResponseEntity.ok().build();
    }
} 