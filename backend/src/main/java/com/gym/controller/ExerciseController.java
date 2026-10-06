package com.gym.controller;

import com.gym.model.Exercise;
import com.gym.service.ExerciseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*") // Allow all origins like Vercel and localhost
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping
    public List<Exercise> getAllExercises() {
        return exerciseService.getAllExercises();
    }

    @GetMapping("/{id}")
    public Exercise getExerciseById(@PathVariable UUID id) {
        return exerciseService.getExerciseById(id);
    }

    @PostMapping
    public Exercise createExercise(@RequestBody Exercise exercise) {
        return exerciseService.saveExercise(exercise);
    }
}
