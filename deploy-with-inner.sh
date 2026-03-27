#!/bin/bash

# 🚀 Tazav1 Deployment Helper with Generated SSH Key
# Auto-generated helper script for deployment with key: inner

SSH_KEY="/home/it/.ssh/inner"
SSH_USER="root"
SERVER_IP="116.118.48.208"

# Check if key exists
if [[ ! -f "$SSH_KEY" ]]; then
    echo "❌ SSH key not found: $SSH_KEY"
    exit 1
fi

# Run deployment with generated key
exec ./deploy-remote.sh --key "$SSH_KEY" --user "$SSH_USER" "$SERVER_IP" "$@"
