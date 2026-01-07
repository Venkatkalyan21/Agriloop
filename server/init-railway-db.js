/**
 * Railway Database Initialization Script
 * This script connects to your Railway PostgreSQL database and creates all tables
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Your Railway database credentials
const connectionString = 'postgresql://postgres:BKMeiajpTMXXVIBNvRFXKXfrElEziMoX@postgres.railway.internal:5432/railway';

// For external connection, Railway provides a public host
// You'll need to get this from Railway's "Connect" button
// It looks like: postgres.railway.app or similar

console.log('🚀 AgriLoop Database Initialization\n');
console.log('📋 This script will create all database tables for AgriLoop\n');

async function initializeDatabase() {
    // Create client
    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false // Railway requires SSL
        }
    });

    try {
        console.log('🔌 Connecting to Railway PostgreSQL...');
        await client.connect();
        console.log('✅ Connected successfully!\n');

        // Read the SQL schema file
        const schemaPath = path.join(__dirname, 'railway_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('📝 Executing SQL schema...');
        await client.query(schema);
        console.log('✅ Schema executed successfully!\n');

        // Verify tables were created
        console.log('🔍 Verifying tables...');
        const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('\n✅ Tables created:');
        result.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        // Verify sample data
        console.log('\n🔍 Checking material categories...');
        const categories = await client.query('SELECT * FROM material_categories');
        console.log(`✅ Found ${categories.rows.length} categories:`);
        categories.rows.forEach(cat => {
            console.log(`   - ${cat.category_name}`);
        });

        console.log('\n🎉 Database initialization complete!');
        console.log('✅ Your AgriLoop database is ready to use!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Make sure you have the correct database credentials');
        console.error('   2. Check if you need to use the public host instead of internal');
        console.error('   3. Get the public connection string from Railway "Connect" button');
        console.error('\nFull error:', error);
    } finally {
        await client.end();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the initialization
initializeDatabase();
