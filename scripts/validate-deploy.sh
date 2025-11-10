#!/bin/bash

# Deployment Validation Shell Wrapper
# 
# Lightweight wrapper that calls the Node.js validation script
# and exits with appropriate status code.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root
cd "$PROJECT_ROOT"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed or not in PATH"
  exit 1
fi

# Run the validation script with all passed arguments
node "$SCRIPT_DIR/validate-deploy.js" "$@"

# Exit code is already set by the Node script
exit $?
