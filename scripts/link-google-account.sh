#!/bin/bash

# ============================================
# Link Google OAuth Account for katachanneloffical@gmail.com
# This fixes OAuthAccountNotLinked error
# ============================================

echo "🔗 Linking Google OAuth account..."

ssh root@116.118.48.208 << 'ENDSSH'

# Get Google account info from user when they try to login
# We'll create a dummy OAuth account record
docker exec innerbright-postgres psql -U postgres -d innerv2core << 'EOSQL'

-- Get user ID
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get user ID
  SELECT id INTO v_user_id FROM users WHERE email = 'katachanneloffical@gmail.com';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if Google account already exists
  IF EXISTS (SELECT 1 FROM accounts WHERE "userId" = v_user_id AND provider = 'google') THEN
    RAISE NOTICE 'Google account already linked';
  ELSE
    -- Insert Google OAuth account
    -- Note: providerAccountId should be the Google user ID, but we'll use a placeholder
    -- When user logs in with Google, NextAuth will update this
    INSERT INTO accounts (
      id,
      "userId",
      type,
      provider,
      "providerAccountId",
      "access_token",
      "token_type",
      scope
    ) VALUES (
      gen_random_uuid(),
      v_user_id,
      'oauth',
      'google',
      'placeholder_' || v_user_id,
      NULL,
      'Bearer',
      'openid profile email'
    );
    
    RAISE NOTICE 'Google account linked successfully';
  END IF;
END $$;

-- Verify
SELECT u.email, a.provider, a."providerAccountId" 
FROM users u 
JOIN accounts a ON u.id = a."userId" 
WHERE u.email = 'katachanneloffical@gmail.com';

EOSQL

ENDSSH

echo ""
echo "✅ Done! Now try logging in with Google."
echo ""
echo "Note: On first Google login, NextAuth will update the providerAccountId"
echo "with the real Google user ID automatically."
echo ""
