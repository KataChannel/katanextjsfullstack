#!/bin/bash
lsof -ti:$1 | xargs kill -9 2>/dev/null && echo "✅ Đã kill port $1" || echo "Port $1 đã sạch"
