@echo off
REM Git Setup Script for MCNepal.fun Website

echo ================================
echo 🚀 MCNepal.fun Git Setup Script
echo ================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
git --version
echo.

REM Check if already a git repository
if exist ".git" (
    echo ℹ️  This directory is already a Git repository
    echo Current status:
    git status --porcelain
    echo.
) else (
    echo 📁 Initializing Git repository...
    git init
    if errorlevel 1 (
        echo ❌ Failed to initialize Git repository
        pause
        exit /b 1
    )
    echo ✅ Git repository initialized
    echo.
)

REM Check Git configuration
echo 🔧 Checking Git configuration...
git config user.name >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Git user name not set
    set /p username=Enter your name: 
    git config --global user.name "%username%"
    echo ✅ User name set to: %username%
)

git config user.email >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Git user email not set
    set /p email=Enter your email: 
    git config --global user.email "%email%"
    echo ✅ User email set to: %email%
)

echo.
echo Current Git config:
echo Name: 
git config user.name
echo Email: 
git config user.email
echo.

REM Add files to Git
echo 📦 Adding files to Git...
git add .
if errorlevel 1 (
    echo ❌ Failed to add files to Git
    pause
    exit /b 1
)

echo ✅ Files added to Git
echo.

REM Show status
echo 📊 Current Git status:
git status --short
echo.

REM Create initial commit
git diff --cached --quiet
if errorlevel 1 (
    echo 💾 Creating initial commit...
    git commit -m "🎉 Initial commit: MCNepal.fun website with Vercel deployment"
    if errorlevel 1 (
        echo ❌ Failed to create initial commit
        pause
        exit /b 1
    )
    echo ✅ Initial commit created
) else (
    echo ℹ️  No changes to commit
)

echo.

REM Check for remote repository
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🌐 No remote repository configured
    echo.
    echo Please create a GitHub repository first:
    echo 1. Go to https://github.com
    echo 2. Click "+" → "New repository"
    echo 3. Name: mcnepal-website
    echo 4. Description: Official website for MCNepal.fun Minecraft server
    echo 5. Make it PUBLIC for free hosting
    echo 6. DON'T initialize with README
    echo 7. Copy the repository URL
    echo.
    set /p repo_url=Enter your GitHub repository URL: 
    
    git remote add origin "%repo_url%"
    if errorlevel 1 (
        echo ❌ Failed to add remote repository
        pause
        exit /b 1
    )
    echo ✅ Remote repository added: %repo_url%
    echo.
    
    REM Push to GitHub
    echo 🚀 Pushing to GitHub...
    git push -u origin main
    if errorlevel 1 (
        echo ❌ Failed to push to GitHub
        echo This might be due to:
        echo - Authentication issues
        echo - Repository doesn't exist
        echo - Network connectivity
        echo.
        echo Try manually: git push -u origin main
        pause
        exit /b 1
    )
    echo ✅ Successfully pushed to GitHub!
) else (
    echo ✅ Remote repository already configured:
    git remote get-url origin
    echo.
    
    REM Push any new changes
    echo 🚀 Pushing changes to GitHub...
    git push
    if errorlevel 1 (
        echo ⚠️  Push failed - you may need to pull first or resolve conflicts
        echo Try: git pull origin main
    ) else (
        echo ✅ Successfully pushed to GitHub!
    )
)

echo.
echo ================================
echo 🎉 Git Setup Complete!
echo ================================
echo.
echo 📋 Next Steps:
echo 1. Go to https://vercel.com
echo 2. Sign in with GitHub
echo 3. Import your repository
echo 4. Deploy to www.mcnepal.fun
echo.
echo 📚 For detailed instructions, see:
echo - GIT_SETUP.md
echo - DEPLOYMENT.md
echo.
echo 🌐 Your repository: 
git remote get-url origin 2>nul || echo "No remote repository configured"
echo.

pause