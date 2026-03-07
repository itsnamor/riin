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

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Darwin)                             PLATFORM="darwin" ;;
  Linux)                              PLATFORM="linux" ;;
  MINGW*|MSYS*|CYGWIN*|Windows_NT)   PLATFORM="windows" ;;
  *) echo "Error: Unsupported OS: $OS"; exit 1 ;;
esac

# Detect architecture
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)   GOARCH="amd64" ;;
  arm64|aarch64)   GOARCH="arm64" ;;
  *) echo "Error: Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Map to Tauri target triple
case "${PLATFORM}_${GOARCH}" in
  darwin_arm64)   TARGET_TRIPLE="aarch64-apple-darwin" ;;
  darwin_amd64)   TARGET_TRIPLE="x86_64-apple-darwin" ;;
  windows_amd64)  TARGET_TRIPLE="x86_64-pc-windows-msvc" ;;
  windows_arm64)  TARGET_TRIPLE="aarch64-pc-windows-msvc" ;;
  linux_amd64)    TARGET_TRIPLE="x86_64-unknown-linux-gnu" ;;
  linux_arm64)    TARGET_TRIPLE="aarch64-unknown-linux-gnu" ;;
esac

# Archive extension and binary suffix
if [ "$PLATFORM" = "windows" ]; then
  EXT="zip"
  BIN_SUFFIX=".exe"
else
  EXT="tar.gz"
  BIN_SUFFIX=""
fi

ASSET_NAME="CLIProxyAPI_${VERSION_NUM}_${PLATFORM}_${GOARCH}.${EXT}"
DOWNLOAD_URL="https://github.com/$REPO/releases/download/$VERSION/$ASSET_NAME"
DEST_BINARY="${BINARIES_DIR}/${SIDECAR_NAME}-${TARGET_TRIPLE}${BIN_SUFFIX}"

if [ -f "$DEST_BINARY" ]; then
  echo "Binary already exists: $DEST_BINARY"
  echo "Delete it to re-download."
  exit 0
fi

mkdir -p "$BINARIES_DIR"

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Downloading $DOWNLOAD_URL ..."
curl -fSL -o "$TMP_DIR/$ASSET_NAME" "$DOWNLOAD_URL"

echo "Extracting..."
if [ "$EXT" = "zip" ]; then
  unzip -q "$TMP_DIR/$ASSET_NAME" -d "$TMP_DIR/extracted"
else
  mkdir -p "$TMP_DIR/extracted"
  tar -xzf "$TMP_DIR/$ASSET_NAME" -C "$TMP_DIR/extracted"
fi

SRC_BINARY=$(find "$TMP_DIR/extracted" -name "CLIProxyAPI${BIN_SUFFIX}" -type f | head -1)
if [ -z "$SRC_BINARY" ]; then
  SRC_BINARY=$(find "$TMP_DIR/extracted" -name "cli-proxy-api${BIN_SUFFIX}" -type f | head -1)
fi
if [ -z "$SRC_BINARY" ]; then
  echo "Error: Binary not found in archive. Contents:"
  find "$TMP_DIR/extracted" -type f
  exit 1
fi

cp "$SRC_BINARY" "$DEST_BINARY"
chmod +x "$DEST_BINARY"

echo "Installed: $DEST_BINARY"
