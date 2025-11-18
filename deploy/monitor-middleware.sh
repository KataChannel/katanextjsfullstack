#!/bin/bash
# Monitor middleware logs in real-time

echo "Monitoring middleware logs..."
echo "Press Ctrl+C to stop"
echo "---"

ssh root@116.118.48.208 "docker logs -f innerbright-web 2>&1 | grep --line-buffered -E '\[Middleware\]|\[Auth\]'"
