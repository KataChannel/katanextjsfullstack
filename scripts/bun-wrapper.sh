#!/usr/bin/env bash
# Wrapper script to suppress async_hooks warning from Prisma when using Bun

# Run the command and filter out the async_hooks warning
"$@" 2>&1 | grep -v "async_hooks.createHook is not implemented in Bun" || {
    # If grep exits with error (no matches), check if the original command failed
    exit_code=${PIPESTATUS[0]}
    if [ $exit_code -ne 0 ]; then
        exit $exit_code
    fi
}
