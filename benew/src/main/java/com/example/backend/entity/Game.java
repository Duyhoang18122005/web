package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;
import java.util.List;

@Data
@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String category; // MOBA, FPS, RPG, etc.

    @Column(nullable = false)
    private String platform; // PC, MOBILE, CONSOLE

    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE, MAINTENANCE

    @Column
    private String imageUrl;

    @Column
    private String websiteUrl;

    @Column
    private String requirements; // System requirements

    @Column(name = "has_roles")
    private Boolean hasRoles = false;

    @ElementCollection
    @CollectionTable(name = "game_roles", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "role")
    private List<String> availableRoles;

    @ElementCollection
    private List<String> availableRanks; // Danh sách rank cho từng game

    @ManyToMany(mappedBy = "applicableGames")
    private Set<Promotion> promotions;

    @OneToMany(mappedBy = "game")
    private Set<GamePlayer> gamePlayers;

    @OneToMany(mappedBy = "game")
    private Set<Schedule> schedules;
} 