#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_ROOT}"

PROJECT="${PROJECT:-roosa-biz}"
BUILDER_RAW="${BUILDER:-b-roosa-biz}"
BUILDER="$(printf '%s' "${BUILDER_RAW}" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9._-')"
[ -n "${BUILDER}" ] || BUILDER="b-roosa-biz"
case "${BUILDER}" in [a-zA-Z]*) ;; *) BUILDER="b-${BUILDER}" ;; esac

CLEAN_BUILD=0
STATUS_ONLY=0
CLEANUP_ONLY=0
AGGRESSIVE_CLEAN=0
COMPOSE_FILE="${PROJECT_ROOT}/compose.yaml"
COMPOSE_BIN=()

usage() {
  cat <<USAGE
Usage: $(basename "$0") [options]

Options:
  --clean-build      Build the image with --no-cache before deploy.
  --aggressive-clean Prune all cache for this project's buildx builder.
  --status           Show project-scoped compose status and exit.
  --cleanup-only     Run project-scoped cleanup and exit.
  -h, --help         Show this help.
USAGE
}

log() { printf '[deploy:%s] %s\n' "${PROJECT}" "$*"; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "Missing required command: $1" >&2; exit 1; }; }

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --clean-build) CLEAN_BUILD=1 ;;
      --aggressive-clean) AGGRESSIVE_CLEAN=1 ;;
      --status) STATUS_ONLY=1 ;;
      --cleanup-only) CLEANUP_ONLY=1 ;;
      -h|--help) usage; exit 0 ;;
      *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
    esac
    shift
  done
}

load_env() {
  if [ -f "${PROJECT_ROOT}/.env" ]; then
    # shellcheck disable=SC1091
    . "${PROJECT_ROOT}/bin/load-env.sh"
    load_dotenv "${PROJECT_ROOT}/.env"
  fi
}

init_compose() {
  [ -f "${COMPOSE_FILE}" ] || { echo "Could not find ${COMPOSE_FILE}." >&2; exit 1; }
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_BIN=(docker compose)
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_BIN=(docker-compose)
  else
    echo "Missing docker compose plugin/binary." >&2
    exit 1
  fi
}

compose() { "${COMPOSE_BIN[@]}" -f "${COMPOSE_FILE}" -p "${PROJECT}" "$@"; }

ensure_project_builder() {
  if ! docker buildx inspect "${BUILDER}" >/dev/null 2>&1; then
    log "Creating buildx builder ${BUILDER}"
    docker buildx create --name "${BUILDER}" --driver docker-container >/dev/null
  fi
  docker buildx use "${BUILDER}" >/dev/null
  docker buildx inspect --bootstrap "${BUILDER}" >/dev/null
  export BUILDX_BUILDER="${BUILDER}"
}

wait_for_web() {
  local port="${NGINX_APP_PORT:-12017}" attempt=0
  log "Waiting for Roosa on 127.0.0.1:${port}..."
  while [ "${attempt}" -lt 60 ]; do
    curl -fsS "http://127.0.0.1:${port}/" >/dev/null 2>&1 && return 0
    attempt=$((attempt + 1))
    sleep 2
  done
  log "WARNING: Roosa did not become ready after 120s"
  compose ps || true
  compose logs --tail=120 || true
  return 1
}

run_post_deploy_hooks() {
  wait_for_web || return 0
  if [ -x "${PROJECT_ROOT}/bin/nginx-sync.sh" ]; then
    log "Syncing nginx vhost"
    "${PROJECT_ROOT}/bin/nginx-sync.sh" || log "WARNING: nginx sync failed"
  fi
}

cleanup() {
  log "Pruning build cache for ${BUILDER}"
  if [ "${AGGRESSIVE_CLEAN}" -eq 1 ]; then
    docker buildx prune --builder "${BUILDER}" -af >/dev/null || true
  else
    docker buildx prune --builder "${BUILDER}" -af --filter "until=24h" >/dev/null || true
  fi
  docker image prune -a --filter "label=com.project=${PROJECT}" -f >/dev/null || true
}

main() {
  parse_args "$@"
  load_env
  require_cmd docker
  require_cmd curl
  init_compose
  export DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1 PROJECT_LABEL="${PROJECT}"

  if [ "${STATUS_ONLY}" -eq 1 ]; then compose ps; exit 0; fi
  ensure_project_builder

  if [ "${CLEANUP_ONLY}" -eq 1 ]; then cleanup; compose ps; exit 0; fi

  if [ "${CLEAN_BUILD}" -eq 1 ]; then
    compose build --no-cache --pull
  else
    compose build
  fi
  compose down --remove-orphans || true
  compose up -d --remove-orphans
  run_post_deploy_hooks
  cleanup
  compose ps
  log "Deploy completed"
}

main "$@"

