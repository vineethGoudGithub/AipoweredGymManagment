const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_0sL8AGfPIWyF@ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

const schemaSql = `
-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'member',
    fitness_goal TEXT,
    experience TEXT,
    username TEXT,
    age INTEGER,
    bio TEXT,
    timing TEXT,
    home_gym TEXT,
    weekly_schedule TEXT,
    photo_url TEXT,
    prs TEXT,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Gyms Table
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    address TEXT,
    rating DOUBLE PRECISION DEFAULT 4.5,
    open_now BOOLEAN DEFAULT true,
    trainer TEXT
);

-- 3. Gym Members Table
CREATE TABLE IF NOT EXISTS gym_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
    user_id UUID,
    name TEXT,
    goal TEXT,
    timing TEXT,
    specific_time TEXT,
    details TEXT
);

-- 4. Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    muscle_group VARCHAR(100),
    secondary_muscles VARCHAR(100),
    difficulty_level VARCHAR(50),
    instructions TEXT[],
    common_mistakes TEXT[],
    pro_tip TEXT,
    video_path VARCHAR(255)
);

-- 5. AI Workout Plans Table
CREATE TABLE IF NOT EXISTS ai_workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT,
    title TEXT NOT NULL,
    fitness_goal TEXT,
    days_per_week INTEGER,
    plan_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Gym Attendance Table
CREATE TABLE IF NOT EXISTS gym_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    user_name TEXT,
    gym_name TEXT,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_notes TEXT
);

-- Insert default user Vineeth Goud
INSERT INTO users (id, name, email, role, fitness_goal, experience, username, age, bio, timing, home_gym, weekly_schedule)
VALUES (
    gen_random_uuid(),
    'Vineeth Goud',
    'vineethgoudvgs789@gmail.com',
    'Athlete & Founder',
    'Hypertrophy & Strength',
    'Advanced',
    'vineeth_goud',
    24,
    'Fitness enthusiast & creator of AI-Powered Gym Management System.',
    'Morning (06:00 AM - 08:00 AM)',
    'Iron Paradise Gym',
    'Mon: Chest & Triceps | Tue: Back & Biceps | Wed: Legs | Thu: Shoulders | Fri: Core & HIIT'
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    fitness_goal = EXCLUDED.fitness_goal;
`;

async function main() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to Neon PostgreSQL...');
        await client.connect();
        console.log('Connected! Creating schema...');
        await client.query(schemaSql);
        console.log('Schema created successfully.');

        // Seed exercises if table is empty
        const exCount = await client.query('SELECT count(*) FROM exercises');
        if (parseInt(exCount.rows[0].count) === 0) {
            console.log('Seeding exercises...');
            const seedExercisesSql = fs.readFileSync(path.join(__dirname, '..', 'seed_exercises.sql'), 'utf8');
            await client.query(seedExercisesSql);
            console.log('Exercises seeded.');
        } else {
            console.log(`Exercises already exist (${exCount.rows[0].count} records).`);
        }

        // Seed gyms if table is empty
        const gymCount = await client.query('SELECT count(*) FROM gyms');
        if (parseInt(gymCount.rows[0].count) === 0) {
            console.log('Seeding gyms part 1...');
            const p1 = fs.readFileSync(path.join(__dirname, '..', 'seed_gyms_part1.sql'), 'utf8');
            await client.query(p1);
            console.log('Gyms seeded.');
        } else {
            console.log(`Gyms already exist (${gymCount.rows[0].count} records).`);
        }

        // Check user count
        const u = await client.query('SELECT name, email FROM users');
        console.log('Current users:', u.rows);

        console.log('Neon Database Initialization Complete!');
    } catch (err) {
        console.error('Error during database initialization:', err);
    } finally {
        await client.end();
    }
}

main();
