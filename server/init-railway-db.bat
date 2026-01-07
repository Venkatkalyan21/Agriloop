@echo off
echo ========================================
echo AgriLoop Database Initialization
echo ========================================
echo.
echo This script will initialize your Railway PostgreSQL database
echo.
echo Prerequisites:
echo 1. Railway CLI installed (npm install -g @railway/cli)
echo 2. Logged in to Railway (railway login)
echo.
pause

echo.
echo Connecting to Railway and running schema...
echo.

railway run --service postgres psql -f railway_schema.sql

echo.
echo ========================================
echo Database initialization complete!
echo ========================================
pause
