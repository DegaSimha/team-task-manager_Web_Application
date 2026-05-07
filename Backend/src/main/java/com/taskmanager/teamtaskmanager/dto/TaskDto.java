package com.taskmanager.teamtaskmanager.dto;

import com.taskmanager.teamtaskmanager.entity.TaskPriority;
import com.taskmanager.teamtaskmanager.entity.TaskStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskDto {
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskPriority priority;
    private TaskStatus status;
    private Long projectId;
    private Long assignedToId;
}
