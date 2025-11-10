#!/bin/bash
# Deployment validation shell wrapper for Klutr
# This script wraps the Node.js validation script and provides a simple exit code interface

set -e

# Change to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 2
fi

# Check if validation script exists
if [ ! -f "$SCRIPT_DIR/validate-deploy.js" ]; then
    echo "Error: validate-deploy.js not found at $SCRIPT_DIR/validate-deploy.js"
    exit 2
fi

# Run the validation script and pass through all arguments
node "$SCRIPT_DIR/validate-deploy.js" "$@"
EXIT_CODE=$?

# Exit with the same code
exit $EXIT_CODE
