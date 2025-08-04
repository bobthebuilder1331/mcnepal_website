@echo off
REM MCNepal.fun Deployment Script for Vercel (Windows)

echo 🚀 Starting deployment process for MCNepal.fun...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Failed to install Vercel CLI. Please run as administrator.
        pause
        exit /b 1
    )
)

REM Check if user is logged in
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔑 Please login to Vercel:
    vercel login
    if errorlevel 1 (
        echo ❌ Login failed. Please try again.
        pause
        exit /b 1
    )
)

REM Deploy to preview first
echo 📦 Deploying preview version...
vercel
if errorlevel 1 (
    echo ❌ Preview deployment failed.
    pause
    exit /b 1
)

echo ✅ Preview deployment complete!
echo.

REM Ask for production deployment
set /p response=🎯 Ready to deploy to production? (y/n): 

if /i "%response%"=="y" (
    echo 🚀 Deploying to production...
    vercel --prod --alias www.mcnepal.fun
    
    if errorlevel 1 (
        echo ❌ Production deployment failed.
        pause
        exit /b 1
    )
    
    echo ✅ Production deployment complete!
    echo 🌐 Your website is now live at: https://www.mcnepal.fun
    echo.
    echo 📊 Next steps:
    echo 1. Test all functionality on the live site
    echo 2. Configure DNS records if using custom domain
    echo 3. Set up monitoring and analytics
    echo 4. Update any API endpoints for production
) else (
    echo 🔄 Deployment paused. Run 'vercel --prod' when ready for production.
)

echo.
echo 🎉 Deployment process complete!
pause