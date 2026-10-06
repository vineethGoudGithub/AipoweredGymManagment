const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.SPRING_DATASOURCE_URL || 'postgresql://neondb_owner:npg_0sL8AGfPIWyF@ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'users' AND table_schema = 'public' 
            AND column_name IN ('fitness_goal', 'experience');
        `);
        console.log("Columns:", res.rows);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
