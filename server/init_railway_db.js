const { Client } = require('pg');
require('dotenv').config();

// Use the DATABASE_PUBLIC_URL from Railway
// You'll need to set this in your .env file temporarily
const connectionString = process.env.RAILWAY_DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDatabase() {
    try {
        console.log('Connecting to Railway PostgreSQL...');
        await client.connect();
        console.log('✅ Connected successfully!');

        // Read the schema file
        const fs = require('fs');
        const path = require('path');
        const schemaSQL = fs.readFileSync(path.join(__dirname, 'railway_schema.sql'), 'utf8');

        console.log('Executing schema...');
        await client.query(schemaSQL);
        console.log('✅ Database schema created successfully!');

        // Verify tables were created
        const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('\n📊 Created tables:');
        result.rows.forEach(row => console.log(`  - ${row.table_name}`));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
        console.log('\nDisconnected from database.');
    }
}

initializeDatabase();
