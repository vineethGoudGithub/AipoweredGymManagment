const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.SPRING_DATASOURCE_URL || 'postgresql://neondb_owner:npg_0sL8AGfPIWyF@ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
});

async function checkColumns() {
    try {
        await client.connect();
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
        console.log('Columns in users table:', res.rows.map(r => r.column_name).join(', '));
        const gymsCount = await client.query("SELECT count(*) FROM gyms");
        console.log('Gyms count:', gymsCount.rows[0].count);
        const exCount = await client.query("SELECT count(*) FROM exercises");
        console.log('Exercises count:', exCount.rows[0].count);
    } catch (err) {
        console.error('Database connection error:', err.message);
    } finally {
        await client.end();
    }
}

checkColumns();
