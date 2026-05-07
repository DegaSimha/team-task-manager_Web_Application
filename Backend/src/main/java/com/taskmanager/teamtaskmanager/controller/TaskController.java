package com.taskmanager.teamtaskmanager.controller;

import com.taskmanager.teamtaskmanager.dto.TaskDto;
import com.taskmanager.teamtaskmanager.entity.Project;
import com.taskmanager.teamtaskmanager.entity.Task;
import com.taskmanager.teamtaskmanager.entity.User;
import com.taskmanager.teamtaskmanager.repository.ProjectRepository;
import com.taskmanager.teamtaskmanager.repository.TaskRepository;
import com.taskmanager.teamtaskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

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

    @PostMapping
    @SuppressWarnings("null")
    public Task createTask(@RequestBody TaskDto taskDto) {
        Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User currentUser = currentUser();
        if (!"ADMIN".equals(currentUser.getRole()) && !Objects.equals(project.getCreatedBy().getId(), currentUser.getId())) {
            throw new RuntimeException("Access denied");
        }
        User assignedTo = userRepository.findById(taskDto.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate() != null ? taskDto.getDueDate() : LocalDate.now().plusDays(7));
        task.setPriority(taskDto.getPriority() != null ? taskDto.getPriority() : com.taskmanager.teamtaskmanager.entity.TaskPriority.MEDIUM);
        task.setStatus(taskDto.getStatus() != null ? taskDto.getStatus() : com.taskmanager.teamtaskmanager.entity.TaskStatus.TODO);
        task.setProject(project);
        task.setAssignedTo(assignedTo);
        return taskRepository.save(task);
    }

    @PutMapping("/{taskId}/status")
    public Task updateStatus(@PathVariable long taskId, @RequestParam String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User currentUser = currentUser();
        if (task.getAssignedTo() == null || (!Objects.equals(task.getAssignedTo().getId(), currentUser.getId()) && !"ADMIN".equals(currentUser.getRole()))) {
            throw new RuntimeException("Access denied");
        }
        task.setStatus(com.taskmanager.teamtaskmanager.entity.TaskStatus.valueOf(status));
        return taskRepository.save(task);
    }

    @PutMapping("/{taskId}/assign")
    public Task assignTask(@PathVariable long taskId, @RequestParam long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User currentUser = currentUser();
        if (!"ADMIN".equals(currentUser.getRole())) {
            throw new RuntimeException("Access denied");
        }
        User assignee = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setAssignedTo(assignee);
        return taskRepository.save(task);
    }

    @GetMapping("/my-tasks")
    public List<Task> getMyTasks() {
        return taskRepository.findByAssignedTo(currentUser());
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getProjectTasks(@PathVariable long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User currentUser = currentUser();
        boolean isMember = project.getMembers().stream()
                .anyMatch(member -> Objects.equals(member.getId(), currentUser.getId()));
        if (!isMember && !Objects.equals(project.getCreatedBy().getId(), currentUser.getId()) && !"ADMIN".equals(currentUser.getRole())) {
            throw new RuntimeException("Access denied");
        }
        return taskRepository.findByProject(project);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        User currentUser = currentUser();
        List<Task> tasks = "ADMIN".equals(currentUser.getRole()) ? taskRepository.findAll() : taskRepository.findByAssignedTo(currentUser());
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("TODO", tasks.stream().filter(t -> t.getStatus() == com.taskmanager.teamtaskmanager.entity.TaskStatus.TODO).count());
        statusCounts.put("IN_PROGRESS", tasks.stream().filter(t -> t.getStatus() == com.taskmanager.teamtaskmanager.entity.TaskStatus.IN_PROGRESS).count());
        statusCounts.put("DONE", tasks.stream().filter(t -> t.getStatus() == com.taskmanager.teamtaskmanager.entity.TaskStatus.DONE).count());
        long overdue = tasks.stream()
                .filter(t -> t.getDueDate() != null)
                .filter(t -> t.getDueDate().isBefore(LocalDate.now()))
                .count();

        Map<String, Long> tasksPerUser = new HashMap<>();
        if ("ADMIN".equals(currentUser.getRole())) {
            taskRepository.findAll().forEach(task -> {
                String email = task.getAssignedTo() != null ? task.getAssignedTo().getEmail() : "Unassigned";
                tasksPerUser.put(email, tasksPerUser.getOrDefault(email, 0L) + 1);
            });
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalTasks", tasks.size());
        result.put("statusCounts", statusCounts);
        result.put("overdueTasks", overdue);
        result.put("tasksPerUser", tasksPerUser);
        return result;
    }
}
