#!/bin/bash

# MCNepal.fun Deployment Script for Vercel

echo "🚀 Starting deployment process for MCNepal.fun..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please login to Vercel:"
    vercel login
fi

# Deploy to preview first
echo "📦 Deploying preview version..."
vercel

echo "✅ Preview deployment complete!"
echo ""
echo "🎯 Ready to deploy to production? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to production..."
    vercel --prod --alias www.mcnepal.fun
    
    echo "✅ Production deployment complete!"
    echo "🌐 Your website is now live at: https://www.mcnepal.fun"
    echo ""
    echo "📊 Next steps:"
    echo "1. Test all functionality on the live site"
    echo "2. Configure DNS records if using custom domain"
    echo "3. Set up monitoring and analytics"
    echo "4. Update any API endpoints for production"
else
    echo "🔄 Deployment paused. Run 'vercel --prod' when ready for production."
fi

echo ""
echo "🎉 Deployment process complete!"