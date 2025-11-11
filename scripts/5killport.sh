#!/bin/bash

# Find and kill all processes running on port 3000
echo "Killing all processes on port 3000..."

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
        
        # Double check and kill any remaining processes
        REMAINING=$(sudo lsof -ti:$PORT 2>/dev/null)
        if [ ! -z "$REMAINING" ]; then
            echo "Found remaining processes, killing again: $REMAINING"
            sudo kill -9 $REMAINING 2>/dev/null
            sleep 1
        fi
    else
        echo "No process found on port $PORT"
    fi
    
    # Use fuser as final fallback to ensure port is freed
    sudo fuser -k $PORT/tcp 2>/dev/null
}

# Kill all processes on port 3000
kill_port 3000


# Verify ports are free
echo ""
echo "Verifying port 3000 is free..."
REMAINING_3000=$(sudo ss -tulpn | grep ":3000 " | grep -oP 'pid=\K[0-9]+' | sort -u)

if [ -z "$REMAINING_3000" ]; then
    echo "✓ All processes successfully killed. Port 3000 is now free."
else
    echo "⚠ Warning: Some processes may still be running!"
    echo "  - Port 3000 still has PIDs: $REMAINING_3000"
    echo "  - Attempting final kill..."
    for PID in $REMAINING_3000; do
        sudo kill -9 $PID 2>/dev/null
        echo "  ✓ Force killed PID $PID"
    done
    sleep 1
    
    # Final verification
    FINAL_CHECK=$(sudo ss -tulpn | grep ":3000 " | grep -oP 'pid=\K[0-9]+' | sort -u)
    if [ -z "$FINAL_CHECK" ]; then
        echo "✓ Port 3000 is now completely free!"
    else
        echo "✗ Failed to free port 3000. Remaining: $FINAL_CHECK"
        sudo ss -tulpn | grep ":3000 "
    fi
fi

echo "Done!"