# Git Repository Setup Guide for MCNepal.fun

This guide will help you push your MCNepal.fun website to a Git repository and set up automatic deployment.

## 🚀 Quick Setup (Step by Step)

### Step 1: Install Git (if not already installed)

**Windows:**
- Download from [git-scm.com](https://git-scm.com/)
- Or install via Chocolatey: `choco install git`

**Mac:**
- Install via Homebrew: `brew install git`
- Or download from [git-scm.com](https://git-scm.com/)

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

### Step 2: Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Git Repository

Open terminal/command prompt in your project folder:

```bash
cd E:\mcnepal_website
git init
```

### Step 4: Create GitHub Repository

1. **Go to GitHub:**
   - Visit [github.com](https://github.com)
   - Sign in to your account

2. **Create New Repository:**
   - Click the "+" icon → "New repository"
   - Repository name: `mcnepal-website`
   - Description: `Official website for MCNepal.fun Minecraft server`
   - Make it **Public** (for free hosting)
   - **Don't** initialize with README (we already have files)

3. **Copy Repository URL:**
   - Copy the HTTPS URL (e.g., `https://github.com/yourusername/mcnepal-website.git`)

### Step 5: Add Files and Push to GitHub

```bash
# Add all files to git
git add .

# Create initial commit
git commit -m "🎉 Initial commit: MCNepal.fun website with Vercel deployment"

# Add GitHub as remote origin (replace with your actual URL)
git remote add origin https://github.com/yourusername/mcnepal-website.git

# Push to GitHub
git push -u origin main
```

## 🔧 Alternative: Using GitHub Desktop (GUI Method)

### Step 1: Install GitHub Desktop
- Download from [desktop.github.com](https://desktop.github.com/)

### Step 2: Create Repository
1. Open GitHub Desktop
2. File → "Add Local Repository"
3. Choose your `mcnepal_website` folder
4. Click "create a repository"
5. Fill in details and click "Create Repository"

### Step 3: Push to GitHub
1. Click "Publish repository"
2. Uncheck "Keep this code private" for free hosting
3. Click "Publish Repository"

## ⚡ Automatic Deployment Setup

### Option 1: Vercel + GitHub Integration (Recommended)

1. **Connect GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository

2. **Configure Auto-Deployment:**
   - Select your `mcnepal-website` repository
   - Framework: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: `./`
   - Click "Deploy"

3. **Set Up Custom Domain:**
   - Go to Project Settings → Domains
   - Add `www.mcnepal.fun`
   - Configure DNS records as shown in DEPLOYMENT.md

### Option 2: GitHub Actions (Advanced)

I'll create a GitHub Actions workflow for you:

**File: `.github/workflows/deploy.yml`**

## 📁 Repository Structure

After pushing, your repository will contain:

```
mcnepal-website/
├── .github/workflows/         # GitHub Actions (if using)
├── .gitignore                # Git ignore rules
├── assets/                   # Website assets
├── index.html               # Main website
├── package.json             # Project configuration
├── vercel.json              # Vercel configuration
├── README.md                # Project documentation
├── DEPLOYMENT.md            # Deployment guide
├── GIT_SETUP.md            # This file
└── sw.js                   # Service worker
```

## 🔄 Making Updates

### After making changes to your website:

```bash
# Check what files changed
git status

# Add changed files
git add .

# Commit changes
git commit -m "✨ Add new feature: description of changes"

# Push to GitHub
git push
```

### With Vercel integration, changes will automatically deploy!

## 🌐 Custom Domain Setup

### Step 1: In Vercel Dashboard
1. Go to your project
2. Settings → Domains
3. Add your domain: `www.mcnepal.fun`

### Step 2: DNS Configuration
Add these records in your domain registrar:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A  
Name: @
Value: 76.76.19.61
```

## 🚨 Common Issues & Solutions

### Issue: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/yourusername/mcnepal-website.git
```

### Issue: Authentication failed
```bash
# Use personal access token instead of password
# Generate token at: GitHub → Settings → Developer settings → Personal access tokens
```

### Issue: Permission denied
```bash
# Check if you're the repository owner
# Or ask for collaboration access
```

### Issue: Files not showing on GitHub
```bash
# Make sure you added and committed files
git add .
git commit -m "Add missing files"
git push
```

## 📊 Branch Strategy (Optional)

### For team development:

```bash
# Create development branch
git checkout -b development

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push development branch
git push -u origin development

# Create pull request on GitHub
# Merge to main when ready
```

## 🔒 Security Best Practices

### 1. Never commit sensitive data:
- API keys
- Database passwords
- Private certificates

### 2. Use environment variables:
- Set in Vercel dashboard
- Access via `process.env.VARIABLE_NAME`

### 3. Review .gitignore:
- Ensure sensitive files are ignored
- Check before each commit

## 📈 Next Steps After Setup

1. **Test Auto-Deployment:**
   - Make a small change
   - Commit and push
   - Check if Vercel auto-deploys

2. **Set Up Monitoring:**
   - Enable Vercel Analytics
   - Add Google Analytics
   - Set up uptime monitoring

3. **Configure Backups:**
   - GitHub automatically backs up your code
   - Consider database backups if needed

4. **Team Collaboration:**
   - Add collaborators to repository
   - Set up branch protection rules
   - Configure pull request reviews

## 🆘 Need Help?

- **Git Documentation:** [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Docs:** [docs.github.com](https://docs.github.com)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)

---

Your MCNepal.fun website will be live and automatically deployed! 🚀