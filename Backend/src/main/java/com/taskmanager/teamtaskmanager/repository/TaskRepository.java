package com.taskmanager.teamtaskmanager.repository;

import com.taskmanager.teamtaskmanager.entity.Project;
import com.taskmanager.teamtaskmanager.entity.Task;
import com.taskmanager.teamtaskmanager.entity.TaskStatus;
import com.taskmanager.teamtaskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByProject(Project project);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);
}
