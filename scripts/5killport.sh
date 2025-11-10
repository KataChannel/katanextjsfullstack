#!/bin/bash

# Find and kill all processes running on ports 12001 and 12000
echo "Killing all processes on ports 12001 and 12000..."

# Function to kill all processes on a specific port
kill_port() {
    local PORT=$1
    
    # Method 1: Using lsof
    local PIDS=$(sudo lsof -ti:$PORT 2>/dev/null)
    
    # Method 2: Using ss and extract PIDs (backup method)
    if [ -z "$PIDS" ]; then
        PIDS=$(sudo ss -tulpn | grep ":$PORT " | grep -oP 'pid=\K[0-9]+' | sort -u)
    fi
    
    # Method 3: Using fuser (backup method)
    if [ -z "$PIDS" ]; then
        PIDS=$(sudo fuser $PORT/tcp 2>/dev/null)
    fi
    
    if [ ! -z "$PIDS" ]; then
        echo "Found processes on port $PORT: $PIDS"
        for PID in $PIDS; do
            # Show process info before killing
            ps -p $PID -o pid,comm,args 2>/dev/null | tail -n +2
            sudo kill -9 $PID 2>/dev/null
            if [ $? -eq 0 ]; then
                echo "✓ Killed process $PID on port $PORT"
            else
                echo "✗ Failed to kill process $PID"
            fi
        done
        # Wait a bit for processes to terminate
        sleep 1
    else
        echo "No process found on port $PORT"
    fi
}

# Kill all processes on port 12001
kill_port 12001

# Kill all processes on port 12000
kill_port 12000

# Verify ports are free
echo ""
echo "Verifying ports are free..."
REMAINING_12001=$(sudo ss -tulpn | grep ":12001 " | grep -oP 'pid=\K[0-9]+' | sort -u)
REMAINING_12000=$(sudo ss -tulpn | grep ":12000 " | grep -oP 'pid=\K[0-9]+' | sort -u)

if [ -z "$REMAINING_12001" ] && [ -z "$REMAINING_12000" ]; then
    echo "✓ All processes successfully killed. Ports 12001 and 12000 are now free."
else
    echo "⚠ Warning: Some processes may still be running!"
    if [ ! -z "$REMAINING_12001" ]; then
        echo "  - Port 12001 still has PIDs: $REMAINING_12001"
        sudo ss -tulpn | grep ":12001 "
    fi
    if [ ! -z "$REMAINING_12000" ]; then
        echo "  - Port 12000 still has PIDs: $REMAINING_12000"
        sudo ss -tulpn | grep ":12000 "
    fi
fi

echo "Done!"