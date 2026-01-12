#!/bin/bash

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         🚀 INNERBRIGHT.VN DEPLOYMENT QUICK START            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📋 DEPLOYMENT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  FULL DEPLOY (Recommended)
   ✅ Automatic database backup
   ✅ Full build & health checks
   ✅ Rollback support
   ⏱️  Time: 5-10 minutes
   
   $ ./scripts/deploy-innerbright.sh


2️⃣  QUICK DEPLOY (Fast)
   ⚡ No backup
   ⚡ Direct build & restart
   ⚠️  Use only for minor changes
   ⏱️  Time: 2-3 minutes
   
   $ ./scripts/deploy-innerbright-quick.sh


3️⃣  ROLLBACK
   🔄 Restore previous version
   💾 Restore database from backup
   ⏱️  Time: 3-5 minutes
   
   $ ./scripts/rollback-innerbright.sh


4️⃣  STATUS CHECK
   📊 Server & container health
   🔍 Endpoint tests
   💻 Resource usage
   
   $ ./scripts/status-innerbright.sh


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUICK WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Make changes & test locally
        $ bun run dev
        $ bun run build

Step 2: Deploy to production
        $ ./scripts/deploy-innerbright.sh

Step 3: Verify deployment
        $ ./scripts/status-innerbright.sh

Step 4: Monitor logs (optional)
        $ ssh root@116.118.48.208 'docker logs -f innerbright-web'


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 DECISION TREE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q: What changed?

├─ Database schema changed
│  └─ ✅ Use: ./scripts/deploy-innerbright.sh

├─ Dependencies changed (package.json)
│  └─ ✅ Use: ./scripts/deploy-innerbright.sh

├─ Only CSS/text/minor fixes
│  └─ ⚡ Use: ./scripts/deploy-innerbright-quick.sh

└─ Not sure / Important changes
   └─ ✅ Use: ./scripts/deploy-innerbright.sh (safe choice)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 APPLICATION URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Production:  https://innerbright.vn
Admin:       https://innerbright.vn/admin
API Health:  https://innerbright.vn/api/health
Direct:      http://116.118.48.208:3005


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 COMMON COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

View logs:
  $ ssh root@116.118.48.208 'docker logs -f innerbright-web'

Restart container:
  $ ssh root@116.118.48.208 'cd /var/www/innerbright && docker compose restart innerbright-web'

Check container status:
  $ ssh root@116.118.48.208 'docker ps | grep innerbright'

SSH to server:
  $ ssh root@116.118.48.208

Container shell:
  $ ssh root@116.118.48.208 'docker exec -it innerbright-web sh'

List backups:
  $ ssh root@116.118.48.208 'ls -lh /var/www/innerbright/backups/'


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆘 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Deployment failed
   → Check logs: docker logs innerbright-web
   → Rollback: ./scripts/rollback-innerbright.sh

❌ Site is down
   → Rollback immediately: ./scripts/rollback-innerbright.sh
   → Check status: ./scripts/status-innerbright.sh

❌ Container unhealthy
   → Check logs: docker logs innerbright-web
   → Restart: docker compose restart innerbright-web

❌ Database issues
   → Check: docker exec innerbright-postgres pg_isready
   → Restore: ./scripts/rollback-innerbright.sh


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full Guide:     docs/DEPLOY_GUIDE.md
Checklist:      docs/DEPLOY_CHECKLIST.md
HTTPS Fix:      docs/35-HTTPS_PERFORMANCE_FIX.md
Remote Restore: docs/34-REMOTE_RESTORE.md


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Always test locally first (bun run build)
✅ Use full deploy for production
✅ Monitor logs after deployment
✅ Keep backups for 30 days
✅ Notify team before deploying


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to deploy? Run:

  $ ./scripts/deploy-innerbright.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF
