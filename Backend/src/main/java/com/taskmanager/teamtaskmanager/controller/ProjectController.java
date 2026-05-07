package com.taskmanager.teamtaskmanager.controller;

import com.taskmanager.teamtaskmanager.entity.Project;
import com.taskmanager.teamtaskmanager.entity.User;
import com.taskmanager.teamtaskmanager.repository.ProjectRepository;
import com.taskmanager.teamtaskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin("*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    private User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping("/me")
    public List<Project> getMyProjects() {
        User user = currentUser();
        return projectRepository.findByCreatedByOrMembersContains(user, user);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        User owner = currentUser();
        project.setCreatedBy(owner);
        project.getMembers().add(owner);
        return projectRepository.save(project);
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<Project> addMember(@PathVariable long projectId, @RequestParam String email) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User requester = currentUser();
        if (!project.getCreatedBy().getId().equals(requester.getId())) {
            return ResponseEntity.status(403).build();
        }
        User member = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        project.getMembers().add(member);
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @DeleteMapping("/{projectId}/members/{memberId}")
    public ResponseEntity<Project> removeMember(@PathVariable long projectId, @PathVariable long memberId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User requester = currentUser();
        if (!Objects.equals(project.getCreatedBy().getId(), requester.getId())) {
            return ResponseEntity.status(403).build();
        }
        project.getMembers().removeIf(user -> Objects.equals(user.getId(), memberId));
        return ResponseEntity.ok(projectRepository.save(project));
    }
}
