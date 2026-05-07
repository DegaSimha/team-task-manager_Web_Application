package com.taskmanager.teamtaskmanager.controller;

import com.taskmanager.teamtaskmanager.entity.User;
import com.taskmanager.teamtaskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    public List<User> getAllUsers() {
        User currentUser = currentUser();
        if (!"ADMIN".equals(currentUser.getRole())) {
            throw new RuntimeException("Access denied");
        }
        return userRepository.findAll();
    }
}
