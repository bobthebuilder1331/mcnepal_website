# MCNepal.fun - Vercel Deployment Guide

This guide will help you deploy your MCNepal.fun website to Vercel with your custom domain.

## 🚀 Quick Deployment Steps

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the website**
   ```bash
   cd /path/to/mcnepal_website
   vercel
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub, GitLab, or Bitbucket

2. **Import Project**
   - Click "New Project"
   - Import from Git repository or upload folder
   - Select your mcnepal_website folder

3. **Configure Settings**
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as default)
   - Build Command: (leave empty - static site)
   - Output Directory: `./` (leave as default)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## 🌐 Custom Domain Configuration

### Step 1: Add Domain to Vercel

1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Domains" in the sidebar
4. Add your domain: `www.mcnepal.fun`
5. Also add: `mcnepal.fun` (will redirect to www)

### Step 2: Configure DNS Records

Add these DNS records in your domain registrar:

**For www.mcnepal.fun:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For mcnepal.fun (root domain):**
```
Type: A
Name: @
Value: 76.76.19.61

Type: AAAA  
Name: @
Value: 2606:4700:90:0:76.76.19.61
```

**Alternative for root domain (if CNAME is supported):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### Step 3: SSL Certificate

- SSL certificates are automatically provisioned by Vercel
- This may take a few minutes after DNS propagation
- Check the "Domains" section for SSL status

## ⚙️ Environment Variables (Optional)

If you need to add environment variables:

1. Go to Project Settings → Environment Variables
2. Add any required variables:
   - `ESEWA_MERCHANT_ID` - Your eSewa merchant ID
   - `DISCORD_WEBHOOK_URL` - For notifications
   - `ANALYTICS_ID` - For tracking

## 🔧 Project Configuration

### Vercel Configuration (vercel.json)

The project includes a `vercel.json` file with:
- Static file caching
- Security headers
- Redirect rules
- Content Security Policy

### Key Features Configured:

- **Caching**: Static assets cached for 1 year
- **Security**: CSP, XSS protection, frame options
- **Performance**: Optimized headers and compression
- **Redirects**: SEO-friendly URL structure

## 📊 Performance Optimization

### Automatic Optimizations by Vercel:

- **Image Optimization**: Automatic WebP conversion
- **Compression**: Gzip/Brotli compression
- **CDN**: Global edge network
- **HTTP/2**: Enabled by default

### Manual Optimizations Included:

- Service Worker for caching
- Lazy loading for images
- Minified CSS and JavaScript
- Optimized font loading

## 🚨 Common Issues & Solutions

### Issue: Domain not working after 24 hours

**Solution:**
1. Check DNS propagation: `dig www.mcnepal.fun`
2. Verify DNS records are correct
3. Try clearing DNS cache: `ipconfig /flushdns` (Windows)

### Issue: SSL certificate not issued

**Solution:**
1. Wait for DNS propagation (up to 48 hours)
2. Remove and re-add the domain
3. Check domain ownership verification

### Issue: Assets not loading

**Solution:**
1. Check file paths are relative
2. Verify all files are in the repository
3. Check browser console for errors

### Issue: Form submissions not working

**Solution:**
1. Add Vercel Forms integration
2. Configure webhook endpoints
3. Set up proper CORS headers

## 📈 Monitoring & Analytics

### Vercel Analytics (Built-in)

- Automatic performance monitoring
- Core Web Vitals tracking
- Real User Monitoring

### Enable Analytics:

1. Go to Project Settings
2. Enable "Analytics"
3. View insights in dashboard

### Google Analytics Integration:

Add to `<head>` section:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 Continuous Deployment

### Auto-deploy from Git:

1. Connect GitHub repository
2. Enable auto-deploy on push
3. Set production branch (usually `main`)

### Manual Deployments:

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod

# Deploy with alias
vercel --prod --alias www.mcnepal.fun
```

## 🌍 Global CDN & Performance

### Vercel Edge Network:

- 40+ global edge locations
- Automatic geo-routing
- Sub-100ms response times globally

### Performance Metrics to Monitor:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

## 🛡️ Security Configuration

### Headers Configured:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Content Security Policy (CSP)

### Additional Security:

1. Enable "DDoS Protection" in project settings
2. Configure rate limiting if needed
3. Set up monitoring alerts

## 📞 Support & Troubleshooting

### Vercel Support:

- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- Status: [vercel-status.com](https://vercel-status.com)

### Deployment Checklist:

- [ ] All files uploaded
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Custom domain working
- [ ] All assets loading correctly
- [ ] Service Worker functioning
- [ ] Store payments working
- [ ] Server status API connected

## 🎯 Post-Deployment Steps

1. **Test Everything:**
   - Navigate through all pages
   - Test store functionality
   - Verify server status updates
   - Check mobile responsiveness

2. **SEO Setup:**
   - Submit sitemap to Google Search Console
   - Verify domain ownership
   - Set up Google Analytics

3. **Performance Testing:**
   - Run Lighthouse audit
   - Test on different devices
   - Monitor Core Web Vitals

4. **Security Check:**
   - Scan for vulnerabilities
   - Verify SSL certificate
   - Test CSP headers

---

Your MCNepal.fun website is now ready for deployment on Vercel! 🚀

For additional help, contact the development team or check the Vercel documentation.