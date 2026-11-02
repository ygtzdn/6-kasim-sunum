#!/usr/bin/env bash
set -euo pipefail
TASK_NODE_DIR="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin"
if ! command -v node >/dev/null 2>&1 && [ -x "$TASK_NODE_DIR/node" ]; then
  export PATH="$TASK_NODE_DIR:$PATH"
fi
cd -- "$(dirname -- "$0")/.."
exec pnpm dev "$@"
