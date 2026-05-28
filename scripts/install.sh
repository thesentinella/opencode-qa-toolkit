#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory '$TARGET_DIR' does not exist."
  exit 1
fi

TARGET_OPENCODE_DIR="$TARGET_DIR/.opencode"

if [ -d "$TARGET_OPENCODE_DIR" ]; then
  echo "Warning: '$TARGET_OPENCODE_DIR' already exists."
  read -rp "Overwrite? [y/N] " confirm
  if [[ "$confirm" != [yY] ]]; then
    echo "Aborted."
    exit 0
  fi
fi

mkdir -p "$TARGET_OPENCODE_DIR/agents"
mkdir -p "$TARGET_OPENCODE_DIR/commands"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/../templates/opencode"

cp -R "$TEMPLATES_DIR/agents/"* "$TARGET_OPENCODE_DIR/agents/"
cp -R "$TEMPLATES_DIR/commands/"* "$TARGET_OPENCODE_DIR/commands/"

GITIGNORE_SOURCE="$SCRIPT_DIR/../examples/playwright/gitignore.example"
if [ -f "$GITIGNORE_SOURCE" ] && [ -f "$TARGET_DIR/.gitignore" ]; then
  echo ""
  echo "Appending gitignore entries for Playwright artifacts and QA reports..."
  while IFS= read -r line; do
    if ! grep -qF "$line" "$TARGET_DIR/.gitignore" 2>/dev/null; then
      echo "$line" >> "$TARGET_DIR/.gitignore"
    fi
  done < "$GITIGNORE_SOURCE"
elif [ -f "$GITIGNORE_SOURCE" ] && [ ! -f "$TARGET_DIR/.gitignore" ]; then
  cp "$GITIGNORE_SOURCE" "$TARGET_DIR/.gitignore"
fi

echo "Installed OpenCode QA toolkit into $TARGET_OPENCODE_DIR"
echo ""
echo "Installed commands:"
ls -1 "$TARGET_OPENCODE_DIR/commands/"
echo ""
echo "Installed agents:"
ls -1 "$TARGET_OPENCODE_DIR/agents/"
echo ""
echo "Next steps:"
echo "  1. Ensure Playwright is installed and configured."
echo "  2. Create a .env file with TEST_ENV_URL, TEST_USER, and TEST_PASSWORD."
echo "  3. Run 'opencode' from the target project and use /crawl-ui to start."