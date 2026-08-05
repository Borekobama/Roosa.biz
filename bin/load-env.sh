#!/usr/bin/env bash

# Load simple KEY=VALUE dotenv files without evaluating their contents.
load_dotenv() {
  local env_file="$1" raw_line line key value first_char last_char
  [ -f "${env_file}" ] || return 0

  while IFS= read -r raw_line || [ -n "${raw_line}" ]; do
    raw_line="${raw_line%$'\r'}"
    line="${raw_line#"${raw_line%%[![:space:]]*}"}"
    [ -z "${line}" ] && continue
    [[ "${line}" == \#* ]] && continue
    if [[ "${line}" == export[[:space:]]* ]]; then
      line="${line#export }"
      line="${line#"${line%%[![:space:]]*}"}"
    fi
    if [[ "${line}" =~ ^([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*=[[:space:]]*(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
    else
      continue
    fi
    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"
    if [ "${#value}" -ge 2 ]; then
      first_char="${value:0:1}"
      last_char="${value: -1}"
      if [[ ( "${first_char}" == '"' && "${last_char}" == '"' ) || ( "${first_char}" == "'" && "${last_char}" == "'" ) ]]; then
        value="${value:1:${#value}-2}"
      fi
    fi
    export "${key}=${value}"
  done < "${env_file}"
}

