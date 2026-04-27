#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  bash scripts/preflight.sh [--skip-install]

Runs the same verification gates expected in CI:
  1. npm ci
  2. npm run check
  3. npm run build
  4. npm test
  5. npm pack --dry-run

Options:
  --skip-install  assume dependencies are already installed
  -h, --help      show help
EOF
}

SKIP_INSTALL=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-install)
      SKIP_INSTALL=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

if [[ ! -f package-lock.json ]]; then
  echo "package-lock.json is required for reproducible CI installs." >&2
  echo "Run: npm install --package-lock-only" >&2
  exit 2
fi

echo "ui8px preflight"
echo "Root: ${ROOT_DIR}"

if [[ "${SKIP_INSTALL}" -eq 0 ]]; then
  echo
  echo "==> Installing reproducible dependencies"
  npm ci
fi

echo
echo "==> Type checking"
npm run check

echo
echo "==> Building"
npm run build

echo
echo "==> Testing"
npm test

echo
echo "==> Previewing npm package"
npm pack --dry-run

echo
echo "Preflight passed."
