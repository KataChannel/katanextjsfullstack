# ✅ Deployment Checklist

## Pre-Deployment Checklist

### 🗄️ Database Setup
- [ ] Create 5 PostgreSQL databases
  - [ ] `tazagroupvn`
  - [ ] `tazaskinclinic`
  - [ ] `hderma`
  - [ ] `elasome`
  - [ ] (timona.edu.vn shares `tazagroupvn` database)
- [ ] Update DATABASE_URL in `.env` for each domain
- [ ] Run `npm run db:push` or `npm run db:migrate`
- [ ] Verify database connections
- [ ] Create admin user in each database
- [ ] Seed initial SEO settings

### 🔐 Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Set `DATABASE_URL` for main domain
- [ ] Set `NEXTAUTH_URL` (if auth implemented)
- [ ] Set `NEXTAUTH_SECRET` (if auth implemented)
- [ ] Set `NEXT_PUBLIC_API_URL`
- [ ] Set any API keys (Google Analytics, etc.)
- [ ] Review security variables

### 📦 Dependencies
- [ ] Run `npm install` to install all packages
- [ ] Run `npm audit` to check vulnerabilities
- [ ] Fix critical/high vulnerabilities if any
- [ ] Run `npx prisma generate` to generate Prisma Client
- [ ] Verify all package versions

### 🔧 Build & Test
- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No ESLint errors (except minor warnings)
- [ ] Test in development mode: `npm run dev`
- [ ] Test production build: `npm run start`
- [ ] Check console for errors
- [ ] Verify hot reload works

### 🌐 Domain Configuration
- [ ] DNS A records point to server IP
  - [ ] tazagroup.vn → Server IP
  - [ ] tazaskinclinic.com → Server IP
  - [ ] timona.edu.vn → Server IP
  - [ ] hderma.vn → Server IP
  - [ ] elasome.com → Server IP
- [ ] SSL certificates installed (Let's Encrypt)
- [ ] HTTPS redirect configured
- [ ] WWW redirect (if needed)

### 🚀 Server Setup
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Nginx/Apache configured as reverse proxy
- [ ] PM2 or similar process manager
- [ ] Firewall configured (ports 80, 443)
- [ ] Server hardening completed

---

## Deployment Steps

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd kataseo
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment
```bash
cp .env.example .env
nano .env  # Edit with your values
```

### Step 4: Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npm run db:push

# Or create migration
npm run db:migrate -- --name init
```

### Step 5: Build Application
```bash
npm run build
```

### Step 6: Start Production
```bash
# Using PM2
pm2 start npm --name "kataseo" -- start

# Or using systemd
npm run start
```

### Step 7: Verify Deployment
- [ ] Access main domain (tazagroup.vn)
- [ ] Check homepage loads
- [ ] Test admin dashboard (/admin)
- [ ] Test API endpoints
- [ ] Verify multi-domain routing
- [ ] Check sitemap.xml
- [ ] Check robots.txt
- [ ] Test page builder
- [ ] Upload test media
- [ ] Create test post

---

## Post-Deployment Checklist

### 🔍 Testing
- [ ] Smoke tests on production
- [ ] Test all major user flows
- [ ] Mobile responsiveness check
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance test (Lighthouse)
- [ ] SEO audit (check meta tags, structured data)
- [ ] Accessibility audit (WAVE, axe)
- [ ] Load testing (if high traffic expected)

### 📊 Monitoring Setup
- [ ] Setup error tracking (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Setup Google Analytics (if not done)
- [ ] Configure Search Console for all domains
- [ ] Setup performance monitoring
- [ ] Configure log aggregation

### 🔒 Security
- [ ] Review security headers (CSP, HSTS, etc.)
- [ ] Check for exposed secrets
- [ ] Verify HTTPS is enforced
- [ ] Test rate limiting (if implemented)
- [ ] Review file upload security
- [ ] Check SQL injection protection
- [ ] Test XSS protection
- [ ] Run security audit: `npm audit`

### 📈 SEO
- [ ] Submit sitemaps to Google Search Console
- [ ] Submit sitemaps to Bing Webmaster Tools
- [ ] Verify robots.txt is accessible
- [ ] Check canonical URLs
- [ ] Verify structured data (use Rich Results Test)
- [ ] Test social media previews (Open Graph)
- [ ] Check mobile-friendliness (Google Mobile-Friendly Test)
- [ ] Verify page speed (PageSpeed Insights)

### 📧 Communication
- [ ] Setup email service (SendGrid, Resend)
- [ ] Configure SMTP settings
- [ ] Test email sending
- [ ] Create email templates
- [ ] Setup notification system

### 💾 Backup
- [ ] Configure automated database backups
- [ ] Test backup restoration
- [ ] Setup media file backups
- [ ] Document backup procedures
- [ ] Configure backup retention policy

### 📝 Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Create admin user guide
- [ ] Write troubleshooting guide

---

## Maintenance Checklist

### Daily
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Check performance metrics

### Weekly
- [ ] Review analytics data
- [ ] Check for npm package updates
- [ ] Backup verification
- [ ] Security scan

### Monthly
- [ ] Update dependencies
- [ ] Performance optimization review
- [ ] SEO audit
- [ ] Content audit
- [ ] User feedback review

### Quarterly
- [ ] Major dependency updates
- [ ] Security audit
- [ ] Performance benchmark
- [ ] Feature planning
- [ ] Technical debt review

---

## Rollback Plan

### If Deployment Fails

#### Step 1: Identify Issue
```bash
# Check logs
pm2 logs kataseo

# Check build errors
npm run build
```

#### Step 2: Quick Fix or Rollback
```bash
# Rollback to previous version
git checkout <previous-commit>
npm install
npm run build
pm2 restart kataseo
```

#### Step 3: Investigate
- Check error messages
- Review recent changes
- Test in staging environment
- Fix issues locally

#### Step 4: Re-deploy
```bash
# After fixing
git pull
npm install
npm run build
pm2 restart kataseo
```

---

## Performance Optimization Checklist

### Frontend
- [ ] Enable Next.js optimizations
- [ ] Optimize images (use next/image)
- [ ] Lazy load components
- [ ] Code splitting
- [ ] Minification enabled
- [ ] Compression enabled (gzip/brotli)

### Backend
- [ ] Database indexes created
- [ ] Query optimization
- [ ] Connection pooling
- [ ] Caching strategy (Redis)
- [ ] CDN for static assets

### Infrastructure
- [ ] Use PM2 cluster mode
- [ ] Configure Nginx caching
- [ ] Enable HTTP/2
- [ ] Setup CDN (Cloudflare)
- [ ] Load balancer (if multiple servers)

---

## Emergency Contacts

### Technical Support
- **Lead Developer**: [Email/Phone]
- **DevOps**: [Email/Phone]
- **Database Admin**: [Email/Phone]

### Service Providers
- **Hosting Provider**: [Contact]
- **DNS Provider**: [Contact]
- **Email Service**: [Contact]

---

## Success Criteria

### ✅ Deployment is successful when:
1. All 5 domains accessible via HTTPS
2. Admin dashboard functional
3. API endpoints responding correctly
4. Database connections working
5. No critical errors in logs
6. Performance metrics acceptable (< 3s load time)
7. SEO metadata present on all pages
8. Mobile responsive on all devices
9. Uptime monitoring active
10. Backup system operational

---

## Common Issues & Solutions

### Issue: DATABASE_URL not found
**Solution**: Ensure `.env` file exists and contains `DATABASE_URL`
```bash
echo 'DATABASE_URL="postgresql://..."' > .env
```

### Issue: Prisma Client errors
**Solution**: Regenerate Prisma Client
```bash
npx prisma generate
```

### Issue: Build fails
**Solution**: Check for TypeScript errors
```bash
npx tsc --noEmit
```

### Issue: Port already in use
**Solution**: Kill process or use different port
```bash
lsof -ti:3000 | xargs kill -9
# or
PORT=3001 npm run start
```

### Issue: Database connection timeout
**Solution**: Check database server, firewall, credentials
```bash
# Test connection
psql $DATABASE_URL
```

---

## Final Verification

### Before Going Live
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security hardened
- [ ] Monitoring active
- [ ] Backup configured
- [ ] Documentation complete
- [ ] Team trained
- [ ] Stakeholders informed

### After Going Live
- [ ] Monitor closely for first 24 hours
- [ ] Be ready for quick fixes
- [ ] Collect user feedback
- [ ] Track key metrics
- [ ] Document any issues

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Completed  

---

**Good luck with your deployment! 🚀**

_For issues, refer to QUICK_START.md troubleshooting section or contact support._
