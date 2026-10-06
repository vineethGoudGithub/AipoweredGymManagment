package com.gym.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiAssistantController {

    @PostMapping("/coach")
    public ResponseEntity<Map<String, Object>> chatWithCoach(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "").trim().toLowerCase();
        String userName = request.getOrDefault("userName", "Athlete");
        String goal = request.getOrDefault("goal", "Fitness");

        String reply;
        List<String> suggestedFollowUps = new ArrayList<>();

        if (message.contains("routine") || message.contains("split") || message.contains("workout plan")) {
            reply = "Here is an optimized AI workout split tailored for " + goal + ":\n\n"
                    + "• Day 1: Upper Body Power (Bench Press, Barbell Row, Overhead Press, Pull-ups)\n"
                    + "• Day 2: Lower Body Hypertrophy (Back Squat, Romanian Deadlift, Leg Press, Calf Raises)\n"
                    + "• Day 3: Active Recovery & Mobility (Light Core, Dynamic Stretching, 30m Zone 2 cardio)\n"
                    + "• Day 4: Push Focus (Incline Dumbbell Press, Dips, Lateral Raises, Tricep Pushdowns)\n"
                    + "• Day 5: Pull & Legs Focus (Deadlift, Cable Rows, Hamstring Curls, Bicep Curls)\n\n"
                    + "Keep rest between compound sets around 2-3 minutes, and 60-90s for isolation exercises. Aim for RPE 8.";
            suggestedFollowUps.add("Calculate my macros for this split");
            suggestedFollowUps.add("Suggest pre-workout nutrition");
            suggestedFollowUps.add("Show form tips for Squat");
        } else if (message.contains("diet") || message.contains("macro") || message.contains("protein") || message.contains("calorie")) {
            reply = "Nutrition is 70% of results, " + userName + "! For " + goal + ", follow this AI nutritional blueprint:\n\n"
                    + "• Protein: 1.8g - 2.2g per kg of bodyweight (e.g. eggs, chicken breast, paneer/tofu, whey isolate)\n"
                    + "• Carbohydrates: 3g - 4.5g per kg for high-energy training fuel (oats, brown rice, sweet potatoes, quinoa)\n"
                    + "• Healthy Fats: 0.8g - 1g per kg for endocrine health (avocado, almonds, olive oil, chia seeds)\n"
                    + "• Hydration: 3.5 - 4 Liters of water daily with electrolytes around workout window.";
            suggestedFollowUps.add("Generate sample high-protein meal plan");
            suggestedFollowUps.add("Best supplements to take");
            suggestedFollowUps.add("How to track daily calories");
        } else if (message.contains("squat") || message.contains("bench") || message.contains("deadlift") || message.contains("form")) {
            reply = "Form Check Protocol by ApexFit AI:\n\n"
                    + "1. Barbell Squat: Brace core with diaphragmatic breathing. Maintain mid-foot balance. Break at hips and knees simultaneously. Keep chest proud and track knees over toes.\n"
                    + "2. Bench Press: Retract scapulae, maintain 5 points of contact, tuck elbows at 45-75 degrees. Lower with control to lower chest, explode up.\n"
                    + "3. Deadlift: Bar over mid-foot, engage lats (think bending the bar), push floor away with legs, lock out hips without over-extending lumbar spine.";
            suggestedFollowUps.add("How to avoid lower back pain?");
            suggestedFollowUps.add("Best warm-up before heavy lifts?");
        } else if (message.contains("fat loss") || message.contains("cut") || message.contains("cutting")) {
            reply = "Cutting Strategy for Maximum Muscle Retention:\n\n"
                    + "• Caloric Deficit: Moderate 350-500 kcal deficit below maintenance.\n"
                    + "• Protein Priority: Bump to 2.2g/kg to prevent catabolism during deficit.\n"
                    + "• Cardio: 8,000-10,000 daily steps + two 20-min HIIT or incline walk sessions.\n"
                    + "• Strength: Maintain heavy loads to signal muscle retention to the body.";
            suggestedFollowUps.add("Show cutting meal ideas");
            suggestedFollowUps.add("Best cardio for fat loss");
        } else {
            reply = "Welcome " + userName + "! I am your ApexFit AI Performance Coach. "
                    + "I can design custom workout splits, calculate macro ratios, analyze form cues, "
                    + "suggest recovery protocols, and help you hit your " + goal + " goals faster. What are you looking to optimize today?";
            suggestedFollowUps.add("Generate a 4-day workout split");
            suggestedFollowUps.add("Calculate my daily calorie & protein target");
            suggestedFollowUps.add("Form tips for Barbell Deadlift");
            suggestedFollowUps.add("Pre-workout meal recommendations");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("reply", reply);
        res.put("timestamp", new Date());
        res.put("suggestedFollowUps", suggestedFollowUps);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/generate-workout")
    public ResponseEntity<Map<String, Object>> generateWorkout(@RequestBody Map<String, Object> params) {
        String goal = (String) params.getOrDefault("goal", "Hypertrophy");
        String level = (String) params.getOrDefault("level", "Intermediate");
        int days = Integer.parseInt(params.getOrDefault("days", 4).toString());
        String equipment = (String) params.getOrDefault("equipment", "Commercial Gym");

        List<Map<String, Object>> workoutDays = new ArrayList<>();

        if (days == 3) {
            workoutDays.add(createDay("Day 1: Full Body A", "Chest, Back, Quads, Calves", List.of(
                    createEx("Barbell Bench Press", "4 sets", "8-10 reps", "2 min rest"),
                    createEx("Barbell Front Squat", "4 sets", "6-8 reps", "2.5 min rest"),
                    createEx("Cable Seated Row", "3 sets", "10-12 reps", "90s rest"),
                    createEx("Lever Standing Calf Raise", "4 sets", "12-15 reps", "60s rest")
            )));
            workoutDays.add(createDay("Day 2: Full Body B", "Hamstrings, Shoulders, Lats, Arms", List.of(
                    createEx("Dumbbell Romanian Deadlift", "4 sets", "8-10 reps", "2 min rest"),
                    createEx("Dumbbell Standing Overhead Press", "4 sets", "8-10 reps", "2 min rest"),
                    createEx("Wide Grip Pull Up", "3 sets", "Max reps", "90s rest"),
                    createEx("EZ Barbell Seated Curls", "3 sets", "10-12 reps", "60s rest"),
                    createEx("Triceps Dip", "3 sets", "12 reps", "60s rest")
            )));
            workoutDays.add(createDay("Day 3: Full Body C & Core", "Chest, Back, Legs, Core", List.of(
                    createEx("Lever Incline Chest Press", "4 sets", "10-12 reps", "90s rest"),
                    createEx("Sled 45° Leg Press", "4 sets", "10-12 reps", "2 min rest"),
                    createEx("Cable Bar Lateral Pulldown", "3 sets", "10-12 reps", "90s rest"),
                    createEx("Hanging Straight Leg Raise", "3 sets", "15 reps", "60s rest")
            )));
        } else {
            workoutDays.add(createDay("Day 1: Push (Chest, Shoulders, Triceps)", "Chest & Deltoids", List.of(
                    createEx("Barbell Close Grip Bench Press", "4 sets", "8-10 reps", "2 min rest"),
                    createEx("Lever Incline Chest Press", "3 sets", "10-12 reps", "90s rest"),
                    createEx("Dumbbell Standing Overhead Press", "3 sets", "8-10 reps", "90s rest"),
                    createEx("Dumbbell Front Raise", "3 sets", "12 reps", "60s rest"),
                    createEx("Triceps Dip", "3 sets", "10-12 reps", "60s rest")
            )));
            workoutDays.add(createDay("Day 2: Pull (Back, Rear Delts, Biceps)", "Back & Biceps", List.of(
                    createEx("Wide Grip Pull Up", "4 sets", "8-10 reps", "2 min rest"),
                    createEx("Lever Lying T Bar Row", "4 sets", "10 reps", "90s rest"),
                    createEx("Cable Bar Lateral Pulldown", "3 sets", "10-12 reps", "90s rest"),
                    createEx("Dumbbell Rear Lateral Raise", "3 sets", "12-15 reps", "60s rest"),
                    createEx("EZ Barbell Seated Curls", "3 sets", "10-12 reps", "60s rest")
            )));
            workoutDays.add(createDay("Day 3: Legs & Core Power", "Quads, Hamstrings, Core", List.of(
                    createEx("Barbell Front Squat", "4 sets", "6-8 reps", "2.5 min rest"),
                    createEx("Sled 45° Leg Press", "4 sets", "10 reps", "2 min rest"),
                    createEx("Lever Lying Leg Curl", "3 sets", "12 reps", "90s rest"),
                    createEx("Hanging Straight Leg Raise", "3 sets", "15 reps", "60s rest")
            )));
            workoutDays.add(createDay("Day 4: Upper Hypertrophy & Arms", "Full Upper Pump", List.of(
                    createEx("Dumbbell Incline Bench Press", "4 sets", "10-12 reps", "90s rest"),
                    createEx("Inverted Row", "3 sets", "12 reps", "60s rest"),
                    createEx("Cable Pushdown with Rope", "3 sets", "12-15 reps", "60s rest"),
                    createEx("Cable Curl", "3 sets", "12-15 reps", "60s rest"),
                    createEx("Russian Twist", "3 sets", "20 reps", "45s rest")
            )));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("title", days + "-Day AI " + goal + " Split (" + level + ")");
        result.put("equipment", equipment);
        result.put("goal", goal);
        result.put("level", level);
        result.put("days", workoutDays);

        return ResponseEntity.ok(result);
    }

    private Map<String, Object> createDay(String name, String focus, List<Map<String, String>> exercises) {
        Map<String, Object> day = new HashMap<>();
        day.put("name", name);
        day.put("focus", focus);
        day.put("exercises", exercises);
        return day;
    }

    private Map<String, String> createEx(String name, String sets, String reps, String rest) {
        Map<String, String> ex = new HashMap<>();
        ex.put("name", name);
        ex.put("sets", sets);
        ex.put("reps", reps);
        ex.put("rest", rest);
        return ex;
    }
}
