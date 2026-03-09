#!/bin/bash
set -euo pipefail

REPO="router-for-me/CLIProxyAPI"
SIDECAR_NAME="cli-proxy-api"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BINARIES_DIR="$SCRIPT_DIR/../tauri/binaries"

VERSION="${1:-}"

if [ -z "$VERSION" ]; then
  echo "Fetching latest version..."
  VERSION=$(curl -sL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')
  if [ -z "$VERSION" ]; then
    echo "Error: Failed to fetch latest version"
    exit 1
  fi
fi

VERSION_NUM="${VERSION#v}"

echo "CLIProxyAPI version: $VERSION"

mkdir -p "$BINARIES_DIR"

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

TARGETS=$(cat <<'EOF'
darwin amd64 x86_64-apple-darwin tar.gz
darwin arm64 aarch64-apple-darwin tar.gz
linux amd64 x86_64-unknown-linux-gnu tar.gz
linux arm64 aarch64-unknown-linux-gnu tar.gz
windows amd64 x86_64-pc-windows-msvc zip
windows arm64 aarch64-pc-windows-msvc zip
EOF
)

echo "$TARGETS" | while read -r PLATFORM GOARCH TARGET_TRIPLE EXT; do
  [ -n "$PLATFORM" ] || continue

  if [ "$PLATFORM" = "windows" ]; then
    BIN_SUFFIX=".exe"
  else
    BIN_SUFFIX=""
  fi

  ASSET_NAME="CLIProxyAPI_${VERSION_NUM}_${PLATFORM}_${GOARCH}.${EXT}"
  DOWNLOAD_URL="https://github.com/$REPO/releases/download/$VERSION/$ASSET_NAME"
  DEST_BINARY="${BINARIES_DIR}/${SIDECAR_NAME}-${TARGET_TRIPLE}${BIN_SUFFIX}"
  ARCHIVE_PATH="$TMP_DIR/$ASSET_NAME"
  EXTRACT_DIR="$TMP_DIR/${PLATFORM}-${GOARCH}"

  if [ -f "$DEST_BINARY" ]; then
    echo "Skipping existing binary: $DEST_BINARY"
    continue
  fi

  echo "Downloading $DOWNLOAD_URL ..."
  curl -fSL -o "$ARCHIVE_PATH" "$DOWNLOAD_URL"

  echo "Extracting $ASSET_NAME ..."
  rm -rf "$EXTRACT_DIR"
  mkdir -p "$EXTRACT_DIR"
  if [ "$EXT" = "zip" ]; then
    unzip -q "$ARCHIVE_PATH" -d "$EXTRACT_DIR"
  else
    tar -xzf "$ARCHIVE_PATH" -C "$EXTRACT_DIR"
  fi

  SRC_BINARY=$(find "$EXTRACT_DIR" -name "CLIProxyAPI${BIN_SUFFIX}" -type f | head -1)
  if [ -z "$SRC_BINARY" ]; then
    SRC_BINARY=$(find "$EXTRACT_DIR" -name "cli-proxy-api${BIN_SUFFIX}" -type f | head -1)
  fi
  if [ -z "$SRC_BINARY" ]; then
    echo "Error: Binary not found in archive $ASSET_NAME. Contents:"
    find "$EXTRACT_DIR" -type f
    exit 1
  fi

  cp "$SRC_BINARY" "$DEST_BINARY"
  chmod +x "$DEST_BINARY"

  echo "Installed: $DEST_BINARY"
done
