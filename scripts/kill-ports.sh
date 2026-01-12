#!/bin/bash

# Kill Ports Script - Triệt để
# Kill tất cả processes đang chạy trên các dev ports
# Updated: Aggressive mode để kill triệt để port 3000

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_color() {
    color=$1
    shift
    echo -e "${color}$@${NC}"
}

# Function to kill port thoroughly - AGGRESSIVE MODE
kill_port_thorough() {
    local port=$1
    local name=$2
    local retries=3
    
    print_color $YELLOW "🔍 Checking port $port ($name)..."
    
    for attempt in $(seq 1 $retries); do
        local killed=false
        
        # Method 1: fuser (SIGKILL)
        if command -v fuser &> /dev/null; then
            fuser -k ${port}/tcp 2>/dev/null && killed=true
            sleep 0.2
            fuser -k -9 ${port}/tcp 2>/dev/null && killed=true
        fi
        
        # Method 2: lsof (SIGKILL)
        if command -v lsof &> /dev/null; then
            local pids=$(lsof -ti :${port} 2>/dev/null)
            if [ ! -z "$pids" ]; then
                echo "$pids" | while read pid; do
                    kill -9 $pid 2>/dev/null
                    print_color $GREEN "  ✅ Killed PID $pid via lsof"
                done
                killed=true
            fi
        fi
        
        # Method 3: netstat
        if command -v netstat &> /dev/null; then
            local pids=$(netstat -tulpn 2>/dev/null | grep ":${port}" | awk '{print $7}' | cut -d'/' -f1 | grep -E '^[0-9]+$')
            if [ ! -z "$pids" ]; then
                echo "$pids" | while read pid; do
                    kill -9 $pid 2>/dev/null
                    print_color $GREEN "  ✅ Killed PID $pid via netstat"
                done
                killed=true
            fi
        fi
        
        # Method 4: ss
        if command -v ss &> /dev/null; then
            local pids=$(ss -tulpn 2>/dev/null | grep ":${port}" | grep -oP 'pid=\K[0-9]+')
            if [ ! -z "$pids" ]; then
                echo "$pids" | while read pid; do
                    kill -9 $pid 2>/dev/null
                    print_color $GREEN "  ✅ Killed PID $pid via ss"
                done
                killed=true
            fi
        fi
        
        # Method 5: /proc filesystem (Linux specific)
        if [ -d "/proc" ]; then
            for pid in $(ls /proc | grep -E '^[0-9]+$'); do
                if [ -d "/proc/$pid/fd" ]; then
                    for fd in /proc/$pid/fd/*; do
                        if [ -L "$fd" ]; then
                            local target=$(readlink "$fd" 2>/dev/null)
                            if echo "$target" | grep -q "socket:\|TCP.*:${port}"; then
                                kill -9 $pid 2>/dev/null && killed=true
                                print_color $GREEN "  ✅ Killed PID $pid via /proc"
                            fi
                        fi
                    done
                fi
            done
        fi
        
        sleep 0.5
        
        # Verify if port is free
        if ! (lsof -ti :${port} &>/dev/null || netstat -tulpn 2>/dev/null | grep -q ":${port}" || ss -tulpn 2>/dev/null | grep -q ":${port}"); then
            print_color $GREEN "  ✅ Port $port is FREE (attempt $attempt)"
            return 0
        fi
        
        if [ $attempt -lt $retries ]; then
            print_color $YELLOW "  ⚠️  Port $port still in use, retrying ($attempt/$retries)..."
        fi
    done
    
    # Final check
    if lsof -ti :${port} &>/dev/null || netstat -tulpn 2>/dev/null | grep -q ":${port}"; then
        print_color $RED "  ❌ Port $port STILL IN USE after $retries attempts!"
        print_color $RED "     Manual intervention may be required"
        return 1
    else
        print_color $GREEN "  ✅ Port $port is FREE"
        return 0
    fi
}

# Function to kill by process name
kill_by_name() {
    local process_name=$1
    print_color $YELLOW "🔍 Killing processes matching: $process_name..."
    
    local pids=$(pgrep -f "$process_name" 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "$pids" | xargs -r kill -9 2>/dev/null
        print_color $GREEN "  ✅ Killed processes: $pids"
    else
        print_color $BLUE "  ℹ️  No processes found"
    fi
}

# Main execution
main() {
    print_color $CYAN "╔════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║         🔥 KILL ALL DEV PORTS - TRIỆT ĐỂ 🔥               ║"
    print_color $CYAN "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Kill specific ports - PRIORITY ORDER
    print_color $BLUE "📍 KILLING SPECIFIC PORTS (AGGRESSIVE MODE):"
    echo ""
    
    # Port 3000 is priority - kill it first and thoroughly
    print_color $YELLOW "🎯 PRIORITY: Port 3000"
    kill_port_thorough 3000 "Next.js Dev Server"
    
    # Other common dev ports
    kill_port_thorough 3001 "Alternative Frontend"
    kill_port_thorough 5555 "Prisma Studio"
    kill_port_thorough 5556 "Prisma Studio Alt"
    kill_port_thorough 8000 "Backend API"
    kill_port_thorough 8080 "Alternative Backend"
    kill_port_thorough 9000 "Vite/Dev Server"
    kill_port_thorough 12000 "Custom Frontend"
    kill_port_thorough 12001 "Custom Backend"
    kill_port_thorough 13000 "Tazagroup Frontend"
    kill_port_thorough 13001 "Tazagroup Backend"
    
    echo ""
    print_color $BLUE "📍 KILLING BY PROCESS NAME (AGGRESSIVE):"
    echo ""
    
    # Kill Node.js/Bun dev processes
    kill_by_name "next dev"
    kill_by_name "next-server"
    kill_by_name "ts-node-dev"
    kill_by_name "nest start"
    kill_by_name "bun run dev"
    kill_by_name "bun dev"
    kill_by_name "bun --bun next dev"
    kill_by_name "prisma studio"
    kill_by_name "node.*next"
    kill_by_name "turbopack"
    kill_by_name "webpack-dev-server"
    
    # Kill any remaining node processes on port 3000
    print_color $YELLOW "🔍 Final sweep for port 3000..."
    pkill -9 -f ".*:3000" 2>/dev/null || true
    pkill -9 -f "localhost:3000" 2>/dev/null || true
    
    echo ""
    print_color $GREEN "✅ ALL DEV PROCESSES KILLED!"
    echo ""
    
    # Final verification
    print_color $YELLOW "📊 VERIFICATION:"
    echo ""
    
    # Check port 3000 specifically
    if lsof -ti :3000 &>/dev/null || netstat -tulpn 2>/dev/null | grep -q ":3000"; then
        print_color $RED "⚠️  WARNING: Port 3000 may still be in use!"
        print_color $YELLOW "   Running emergency cleanup..."
        sudo fuser -k -9 3000/tcp 2>/dev/null || true
        sudo lsof -ti :3000 | xargs -r sudo kill -9 2>/dev/null || true
    else
        print_color $GREEN "✅ Port 3000 is CONFIRMED FREE"
    fi
    
    # Show remaining processes
    echo ""
    print_color $YELLOW "📊 REMAINING DEV PROCESSES:"
    ps aux | grep -E "(next|bun.*dev|ts-node-dev|nest start|prisma studio|:1[23][0-9]{3}|:300[01]|:555[56])" | grep -v grep | head -10 || echo "✅ None found"
    
    echo ""
    print_color $CYAN "═══════════════════════════════════════════════════════════"
    print_color $GREEN "🎉 PORT CLEANUP COMPLETED!"
    print_color $CYAN "═══════════════════════════════════════════════════════════"
}

# Check if specific port argument provided
if [ ! -z "$1" ]; then
    kill_port_thorough $1 "Port $1"
else
    main
fi
