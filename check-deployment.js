#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script helps verify your Railway deployment is configured correctly
 */

const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkUrl(url, description) {
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;

        log(`\n🔍 Checking ${description}...`, 'cyan');
        log(`   URL: ${url}`, 'blue');

        const request = protocol.get(url, (res) => {
            const { statusCode } = res;
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (statusCode === 200) {
                    log(`   ✅ Status: ${statusCode} OK`, 'green');
                    try {
                        const json = JSON.parse(data);
                        log(`   📦 Response: ${JSON.stringify(json, null, 2)}`, 'green');
                    } catch (e) {
                        log(`   📦 Response: ${data.substring(0, 100)}...`, 'green');
                    }
                    resolve({ success: true, statusCode, data });
                } else {
                    log(`   ⚠️  Status: ${statusCode}`, 'yellow');
                    log(`   📦 Response: ${data.substring(0, 200)}`, 'yellow');
                    resolve({ success: false, statusCode, data });
                }
            });
        });

        request.on('error', (error) => {
            log(`   ❌ Error: ${error.message}`, 'red');
            resolve({ success: false, error: error.message });
        });

        request.setTimeout(10000, () => {
            request.destroy();
            log(`   ⏱️  Timeout: Request took too long`, 'yellow');
            resolve({ success: false, error: 'Timeout' });
        });
    });
}

async function main() {
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║        AgriLoop Deployment Verification Script            ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

    // Get URLs from command line arguments or use defaults
    const backendUrl = process.argv[2] || 'http://localhost:4000';
    const frontendUrl = process.argv[3] || 'http://localhost:5173';

    log('📋 Configuration:', 'blue');
    log(`   Backend URL:  ${backendUrl}`, 'blue');
    log(`   Frontend URL: ${frontendUrl}`, 'blue');

    // Check backend health
    const healthCheck = await checkUrl(
        `${backendUrl}/api/health`,
        'Backend Health Endpoint'
    );

    // Check backend API root
    const apiRoot = await checkUrl(
        `${backendUrl}/api`,
        'Backend API Root'
    );

    // Check material categories endpoint
    const categories = await checkUrl(
        `${backendUrl}/api/materials/categories`,
        'Material Categories Endpoint'
    );

    // Summary
    log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
    log('║                    Verification Summary                    ║', 'cyan');
    log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

    const results = [
        { name: 'Backend Health Check', result: healthCheck },
        { name: 'Backend API Root', result: apiRoot },
        { name: 'Material Categories', result: categories }
    ];

    let allPassed = true;
    results.forEach(({ name, result }) => {
        if (result.success) {
            log(`✅ ${name}`, 'green');
        } else {
            log(`❌ ${name}`, 'red');
            allPassed = false;
        }
    });

    if (allPassed) {
        log('\n🎉 All checks passed! Your deployment is ready!', 'green');
        log('\n📝 Next Steps:', 'cyan');
        log('   1. Test user registration and login', 'blue');
        log('   2. Create a material listing', 'blue');
        log('   3. Browse the marketplace', 'blue');
        log('   4. Verify data is being saved to the database', 'blue');
    } else {
        log('\n⚠️  Some checks failed. Please review the errors above.', 'yellow');
        log('\n🔧 Troubleshooting:', 'cyan');
        log('   1. Check that your backend server is running', 'blue');
        log('   2. Verify database connection in Railway', 'blue');
        log('   3. Check environment variables are set correctly', 'blue');
        log('   4. Review Railway logs for errors', 'blue');
    }

    log('\n💡 Usage:', 'cyan');
    log('   Local:      node check-deployment.js', 'blue');
    log('   Production: node check-deployment.js https://your-app.up.railway.app https://your-app.vercel.app', 'blue');
    log('');
}

main().catch(console.error);
