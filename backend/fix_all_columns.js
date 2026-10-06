
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.SPRING_DATASOURCE_URL || 'postgresql://neondb_owner:npg_0sL8AGfPIWyF@ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function runFix() {
    try {
        await client.connect();
        console.log("Connected to database. Converting ALL string columns to TEXT...");

        // Fix all string columns in users
        await client.query(`
            ALTER TABLE users 
            ALTER COLUMN name TYPE TEXT,
            ALTER COLUMN username TYPE TEXT,
            ALTER COLUMN role TYPE TEXT,
            ALTER COLUMN timing TYPE TEXT,
            ALTER COLUMN fitness_goal TYPE TEXT,
            ALTER COLUMN experience TYPE TEXT,
            ALTER COLUMN home_gym TYPE TEXT,
            ALTER COLUMN bio TYPE TEXT,
            ALTER COLUMN photo_url TYPE TEXT,
            ALTER COLUMN weekly_schedule TYPE TEXT,
            ALTER COLUMN prs TYPE TEXT;
        `);

        // Fix all string columns in gym_members
        await client.query(`
            ALTER TABLE gym_members 
            ALTER COLUMN name TYPE TEXT,
            ALTER COLUMN goal TYPE TEXT,
            ALTER COLUMN timing TYPE TEXT,
            ALTER COLUMN specific_time TYPE TEXT,
            ALTER COLUMN details TYPE TEXT;
        `);

        console.log("All columns successfully converted to TEXT.");
    } catch (err) {
        console.error("Database fix failed:", err.message);
    } finally {
        await client.end();
    }
}

runFix();
