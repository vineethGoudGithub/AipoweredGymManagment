# ApexFit AI - AI-Powered Gym Management & Smart Fitness Platform

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black.svg)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-blue.svg)](https://neon.tech/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Author](https://img.shields.io/badge/Author-Vineeth%20Goud-red.svg)](https://github.com/vineethGoudGithub)

ApexFit AI is an enterprise-grade, full-stack AI-powered Gym Management and Smart Fitness platform engineered by **Vineeth Goud**. The platform combines real-time geographic partner matching, automated workout split generation, precision macro calculators, and an interactive AI fitness coach—all backed by a serverless **Neon Cloud PostgreSQL** database.

---

## Key Features

### 1. AI Workout Routine Generator
- **Scientific Volume Allocation**: Generates customized 3 to 6-day hypertrophy, strength, or cutting splits based on training experience and equipment availability.
- **Detailed Exercise Prescriptions**: Displays target muscle groups, sets, rep ranges, and rest intervals.
- **Interactive Completion Tracker**: Real-time checklist to log completed training days.

### 2. AI Nutrition & Macro Planner
- **Mifflin-St Jeor Energy Expenditure**: Calculates exact BMR and TDEE based on weight, height, age, gender, and activity multiplier.
- **Dynamic Macronutrient Partitions**: Precision protein, carbohydrate, and fat allocations tailored to lean bulking, maintenance, or aggressive cutting.
- **Meal Timing Blueprint**: Hourly meal scheduling (Breakfast, Lunch, Pre-workout, Dinner) with macro breakdowns and plant-based/omnivore options.

### 3. Interactive ApexFit AI Coach
- **Real-Time Performance Consultation**: Answers athlete inquiries regarding exercise biomechanics, warm-up protocols, injury prevention, and recovery.
- **Contextual Suggestions**: Follow-up prompt recommendations tailored to active fitness goals.
- **Neon DB Sync**: Conversation context tied to registered athlete profiles.

### 4. Smart Gym & Travel Mode Partner Matching
- **Interactive Geospatial Gym Discovery**: Explore verified gym facilities with live member counts, ratings, and trainer rosters.
- **Travel Mode**: Automatically locates nearby partner gyms and compatible training partners when away from home.
- **Community Hub**: Join gym communities and coordinate workout sessions.

### 5. Gym Attendance & Check-In System
- **Streak Tracker**: Tracks consecutive workout check-ins and member attendance logs.
- **Digital Pass**: Real-time check-in syncing directly with PostgreSQL database.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Leaflet Maps |
| **Backend** | Spring Boot 3.4.3, Java 21 LTS, Spring Data JPA, Hibernate, HikariCP |
| **Database** | Neon Cloud Serverless PostgreSQL (AWS us-east-2) |
| **DevOps** | Docker, Docker Compose, Multi-stage builds |

---

## Database Architecture (Neon PostgreSQL)

Connected to Neon Serverless PostgreSQL with SSL:
```
postgresql://neondb_owner:***@ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Core Schema:
- `users`: Athlete profiles, fitness goals, experience, bios, and weekly schedules.
- `gyms`: Commercial and private fitness centres with geolocation coordinates and ratings.
- `gym_members`: Association mapping athletes to gym communities.
- `exercises`: Comprehensive video exercise library with execution cues and difficulty tiers.
- `ai_workout_plans`: User-specific generated routines and training schedules.
- `gym_attendance`: Timestamped check-in logs and training streaks.

---

## Quick Start with Docker Compose

Ensure [Docker](https://www.docker.com/) is installed and running on your system:

```bash
# Clone the repository
git clone https://github.com/vineethGoudGithub/AipoweredGymManagment.git
cd AipoweredGymManagment

# Launch all services via Docker Compose
docker compose up --build
```

- **Frontend**: Accessible at `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:8080`

---

## Local Development Setup

### 1. Spring Boot Backend

**Requirements:** Java 21 LTS, Maven 3.9+

```bash
cd backend

# Compile and package
mvn clean package -DskipTests

# Run the application
mvn spring-boot:run
```
The backend starts on `http://localhost:8080`.

### 2. Next.js Frontend

**Requirements:** Node.js 20+, npm 10+

```bash
cd frontend

# Install dependencies
npm install

# Start local dev server
npm run dev
```
The frontend starts on `http://localhost:3000`.

---

## REST API Endpoints

### AI Services
- `POST /api/ai/coach` — Chat with the ApexFit AI performance coach
- `POST /api/ai/generate-workout` — Generate customized workout routine
- `POST /api/ai/diet-plan` — Generate personalized macro & meal plan

### Gyms & Community
- `GET /api/gyms` — List all gyms (supports `?search=` filter)
- `GET /api/gyms/{id}` — Get gym details by ID
- `POST /api/gyms` — Register a new gym
- `GET /api/gyms/{id}/members` — List athletes joined to gym
- `POST /api/gyms/{id}/members` — Join gym community
- `DELETE /api/gyms/{id}/members/{userId}` — Leave gym community

### Attendance
- `GET /api/attendance/user/{email}` — Retrieve member attendance history & streak
- `POST /api/attendance/check-in` — Log gym check-in

### Users
- `GET /api/users/email/{email}` — Find user by email
- `POST /api/users/login-or-register` — Authenticate / register athlete profile

### Health & Diagnostics
- `GET /api/health` — Retrieve system health & Neon PostgreSQL live connectivity status
- `GET /api/keep-alive` — Wake up serverless connection pool

```bash
# Verify system health
curl http://localhost:8080/api/health
```

---

## Neon PostgreSQL Troubleshooting & FAQ

### 1. SSL Handshake in Containers
The Neon connection string requires `sslmode=require`. Ensure your environment has standard root CA certificates installed (included by default in the Alpine Temurin base image).

### 2. PgBouncer Session Connection
The provided JDBC URL targets port `5432` with pooled connections:
```
jdbc:postgresql://ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech:5432/neondb?sslmode=require
```
HikariCP is configured with a 30s keepalive query (`SELECT 1`) to keep the serverless database warm during idle periods.

---

## Author & Maintainer

**Vineeth Goud**  
- GitHub: [@vineethGoudGithub](https://github.com/vineethGoudGithub)  
- Email: [vineethgoudvgs789@gmail.com](mailto:vineethgoudvgs789@gmail.com)  
- Project Repository: [AipoweredGymManagment](https://github.com/vineethGoudGithub/AipoweredGymManagment.git)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
