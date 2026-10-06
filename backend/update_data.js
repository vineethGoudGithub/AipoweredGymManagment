
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.SPRING_DATASOURCE_URL || 'postgresql://neondb_owner:npg_0sL8AGfPIWyF@ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
    try {
        await client.connect();
        
        // Update Pardha
        await client.query("UPDATE gym_members SET goal = 'Strength', timing = 'Morning', details = 'Focusing on compound lifts' WHERE name ILIKE 'pardha'");
        
        // Update Punervesh
        await client.query("UPDATE gym_members SET goal = 'Bulking', timing = 'Evening', details = 'Hypertrophy training' WHERE name ILIKE 'PUNERVESH'");

        console.log("Updated member details for Pardha and Punervesh");

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
