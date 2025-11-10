#!/bin/bash
# Deployment Validation Shell Wrapper
# 
# Lightweight wrapper that calls the Node.js validation script
# and exits with appropriate status code.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_SCRIPT="${SCRIPT_DIR}/validate-deploy.js"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed or not in PATH"
  exit 1
fi

# Run the validation script with all passed arguments
node "$NODE_SCRIPT" "$@"

# Exit code is preserved from the Node script
exit $?
