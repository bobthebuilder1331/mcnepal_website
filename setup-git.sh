#!/bin/bash

# Git Setup Script for MCNepal.fun Website

echo "================================"
echo "🚀 MCNepal.fun Git Setup Script"
echo "================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    echo "Please install Git:"
    echo "  macOS: brew install git"
    echo "  Ubuntu/Debian: sudo apt install git"
    echo "  CentOS/RHEL: sudo yum install git"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"
git --version
echo

# Check if already a git repository
if [ -d ".git" ]; then
    echo -e "${BLUE}ℹ️  This directory is already a Git repository${NC}"
    echo "Current status:"
    git status --porcelain
    echo
else
    echo "📁 Initializing Git repository..."
    git init
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to initialize Git repository${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Git repository initialized${NC}"
    echo
fi

# Check Git configuration
echo "🔧 Checking Git configuration..."

if ! git config user.name &> /dev/null; then
    echo -e "${YELLOW}⚠️  Git user name not set${NC}"
    read -p "Enter your name: " username
    git config --global user.name "$username"
    echo -e "${GREEN}✅ User name set to: $username${NC}"
fi

if ! git config user.email &> /dev/null; then
    echo -e "${YELLOW}⚠️  Git user email not set${NC}"
    read -p "Enter your email: " email
    git config --global user.email "$email"
    echo -e "${GREEN}✅ User email set to: $email${NC}"
fi

echo
echo "Current Git config:"
echo "Name: $(git config user.name)"
echo "Email: $(git config user.email)"
echo

# Add files to Git
echo "📦 Adding files to Git..."
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to add files to Git${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Files added to Git${NC}"
echo

# Show status
echo "📊 Current Git status:"
git status --short
echo

# Create initial commit
if ! git diff --cached --quiet; then
    echo "💾 Creating initial commit..."
    git commit -m "🎉 Initial commit: MCNepal.fun website with Vercel deployment"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to create initial commit${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Initial commit created${NC}"
else
    echo -e "${BLUE}ℹ️  No changes to commit${NC}"
fi

echo

# Check for remote repository
if ! git remote get-url origin &> /dev/null; then
    echo -e "${BLUE}🌐 No remote repository configured${NC}"
    echo
    echo "Please create a GitHub repository first:"
    echo "1. Go to https://github.com"
    echo "2. Click '+' → 'New repository'"
    echo "3. Name: mcnepal-website"
    echo "4. Description: Official website for MCNepal.fun Minecraft server"
    echo "5. Make it PUBLIC for free hosting"
    echo "6. DON'T initialize with README"
    echo "7. Copy the repository URL"
    echo
    read -p "Enter your GitHub repository URL: " repo_url
    
    git remote add origin "$repo_url"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to add remote repository${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Remote repository added: $repo_url${NC}"
    echo
    
    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    git push -u origin main
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to push to GitHub${NC}"
        echo "This might be due to:"
        echo "- Authentication issues"
        echo "- Repository doesn't exist"
        echo "- Network connectivity"
        echo
        echo "Try manually: git push -u origin main"
        exit 1
    fi
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
else
    echo -e "${GREEN}✅ Remote repository already configured:${NC}"
    git remote get-url origin
    echo
    
    # Push any new changes
    echo "🚀 Pushing changes to GitHub..."
    git push
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Push failed - you may need to pull first or resolve conflicts${NC}"
        echo "Try: git pull origin main"
    else
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    fi
fi

echo
echo "================================"
echo "🎉 Git Setup Complete!"
echo "================================"
echo
echo "📋 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Import your repository"
echo "4. Deploy to www.mcnepal.fun"
echo
echo "📚 For detailed instructions, see:"
echo "- GIT_SETUP.md"
echo "- DEPLOYMENT.md"
echo
echo -n "🌐 Your repository: "
git remote get-url origin 2>/dev/null || echo "No remote repository configured"
echo