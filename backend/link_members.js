
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.SPRING_DATASOURCE_URL || 'postgresql://neondb_owner:npg_0sL8AGfPIWyF@ep-cool-sound-b5l933b4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require'
});

async function run() {
    try {
        await client.connect();
        
        // Find users
        const usersRes = await client.query("SELECT id, name FROM users");
        console.log("Users:", usersRes.rows);

        // Find members
        const membersRes = await client.query("SELECT id, name FROM gym_members");
        console.log("Members:", membersRes.rows);

        // Try to link pardha specifically as he is the current user
        const pardhaUser = usersRes.rows.find(u => u.name?.toLowerCase().includes('pardha'));
        const pardhaMember = membersRes.rows.find(m => m.name?.toLowerCase().includes('pardha'));

        if (pardhaUser && pardhaMember) {
            await client.query("UPDATE gym_members SET user_id = $1 WHERE id = $2", [pardhaUser.id, pardhaMember.id]);
            console.log(`Linked member ${pardhaMember.name} to user ${pardhaUser.name}`);
        }

        // Link others if possible
        for (const m of membersRes.rows) {
            if (m.name.toLowerCase().includes('pardha')) continue;
            const match = usersRes.rows.find(u => u.name?.toLowerCase() === m.name?.toLowerCase());
            if (match) {
                await client.query("UPDATE gym_members SET user_id = $1 WHERE id = $2", [match.id, m.id]);
                console.log(`Linked member ${m.name} to user ${match.name}`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.end();
    }
}

run();
