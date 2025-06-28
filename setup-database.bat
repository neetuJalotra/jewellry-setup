@echo off
echo ========================================
echo   Jewellery Management System Setup
echo ========================================
echo.

echo Step 1: Creating database and tables...
echo Please enter your MySQL root password when prompted:
echo.

"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p < database-setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo.
    echo Step 2: Installing Node.js dependencies...
    npm install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Dependencies installed successfully!
        echo.
        echo ========================================
        echo   Setup Complete!
        echo ========================================
        echo.
        echo Next steps:
        echo 1. Edit server.js and add your MySQL password
        echo 2. Run: npm start
        echo 3. Open: http://localhost:3000
        echo.
    ) else (
        echo.
        echo ❌ Failed to install dependencies
        echo Please run: npm install
    )
) else (
    echo.
    echo ❌ Database setup failed
    echo Please check your MySQL installation and password
)

pause 