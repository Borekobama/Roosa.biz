#!/usr/bin/env bash
# Rebuild and restart the clone server, failing loudly rather than silently
# serving a stale build.
#
# next start holds the manifest it booted with. If a rebuild happens while it
# runs, it serves HTML referencing chunks that no longer exist, CSS 404/500s,
# and every layout assertion then measures unstyled markup. A kill that leaves
# the port bound makes the restart fail with EADDRINUSE while the old server
# keeps answering, which looks identical to success unless checked.
set -euo pipefail

PORT="${PORT:-3111}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG="${SERVER_LOG:-/tmp/solene-server.log}"
cd "$ROOT"

echo "→ stopping anything on :$PORT"
for _ in $(seq 1 20); do
  PIDS="$(lsof -ti tcp:"$PORT" 2>/dev/null || true)"
  [ -z "$PIDS" ] && break
  # shellcheck disable=SC2086
  kill $PIDS 2>/dev/null || true
  sleep 0.5
  PIDS="$(lsof -ti tcp:"$PORT" 2>/dev/null || true)"
  [ -n "$PIDS" ] && kill -9 $PIDS 2>/dev/null || true
  sleep 0.5
done
if [ -n "$(lsof -ti tcp:"$PORT" 2>/dev/null || true)" ]; then
  echo "✖ port $PORT still bound; refusing to continue" >&2
  exit 1
fi

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  echo "→ building"
  npm run build >/tmp/solene-build.log 2>&1 || { tail -30 /tmp/solene-build.log >&2; exit 1; }
fi

echo "→ starting"
: > "$LOG"
(npm run start >"$LOG" 2>&1 &)

for _ in $(seq 1 40); do
  sleep 1
  grep -q "EADDRINUSE\|Failed to start" "$LOG" && { echo "✖ server failed to start:" >&2; tail -12 "$LOG" >&2; exit 1; }
  curl -sf -o /dev/null "http://localhost:$PORT/" 2>/dev/null && break
done

curl -sf -o /dev/null "http://localhost:$PORT/" || { echo "✖ server not answering" >&2; tail -12 "$LOG" >&2; exit 1; }

# The page must reference a stylesheet that actually resolves.
CSS="$(curl -s "http://localhost:$PORT/" | grep -o -E 'href="[^"]*\.css"' | head -1 | sed 's/href="//;s/"//')"
if [ -z "$CSS" ]; then
  echo "✖ page references no stylesheet" >&2
  exit 1
fi
STATUS="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT$CSS")"
if [ "$STATUS" != "200" ]; then
  echo "✖ stylesheet $CSS returned $STATUS — stale build" >&2
  exit 1
fi

echo "✔ server ready on :$PORT, stylesheet $CSS resolves"
