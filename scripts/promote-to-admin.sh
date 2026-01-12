#!/bin/bash

# ============================================
# Monitor and Auto-Promote katachanneloffical@gmail.com to Admin
# Run this after first Google login
# ============================================

echo "🔍 Checking if user logged in with Google..."

ssh root@116.118.48.208 << 'ENDSSH'

docker exec innerbright-postgres psql -U postgres -d innerv2core << 'EOSQL'

DO $$
DECLARE
  v_user_id uuid;
  v_role text;
BEGIN
  -- Check if user exists
  SELECT id, role INTO v_user_id, v_role 
  FROM users 
  WHERE email = 'katachanneloffical@gmail.com';
  
  IF v_user_id IS NULL THEN
    RAISE NOTICE '❌ User not found. Please login with Google first.';
  ELSIF v_role = 'admin' THEN
    RAISE NOTICE '✅ User already has admin role';
  ELSE
    -- Promote to admin
    UPDATE users 
    SET role = 'admin', "updatedAt" = NOW()
    WHERE id = v_user_id;
    
    RAISE NOTICE '✅ User promoted to admin successfully!';
  END IF;
  
  -- Show current status
  RAISE NOTICE '';
  RAISE NOTICE '📊 Current user status:';
END $$;

-- Display user info
SELECT 
  u.email, 
  u.role, 
  u."emailVerified",
  a.provider,
  CASE 
    WHEN a.provider IS NOT NULL THEN '✅ Linked'
    ELSE '❌ Not linked'
  END as oauth_status
FROM users u
LEFT JOIN accounts a ON u.id = a."userId" AND a.provider = 'google'
WHERE u.email = 'katachanneloffical@gmail.com';

EOSQL

ENDSSH

echo ""
echo "Done! Check the output above."
echo ""
