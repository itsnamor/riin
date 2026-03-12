#!/bin/bash

# Release script: ./release.sh [major|minor|patch]

set -e

if [ -z "$1" ]; then
  echo "Usage: ./release.sh [major|minor|patch]"
  exit 1
fi

BUMP_TYPE=$1

# Get current versions using pure bash
PKG_VERSION=$(grep -m1 '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/' | tr -d ' ')
TAURI_VERSION=$(grep -m1 '"version"' tauri/tauri.conf.json | sed 's/.*"version": "\(.*\)".*/\1/' | tr -d ' ')

echo "Current versions - package.json: $PKG_VERSION, tauri.conf.json: $TAURI_VERSION"

# Bump version using pure bash
IFS='.' read -ra VERSION_PARTS <<< "$PKG_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

if [ "$BUMP_TYPE" = "major" ]; then
  MAJOR=$((MAJOR + 1))
  MINOR=0
  PATCH=0
elif [ "$BUMP_TYPE" = "minor" ]; then
  MINOR=$((MINOR + 1))
  PATCH=0
elif [ "$BUMP_TYPE" = "patch" ]; then
  PATCH=$((PATCH + 1))
else
  echo "Invalid bump type: $BUMP_TYPE (use major, minor, or patch)"
  exit 1
fi

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

echo "New version: $NEW_VERSION"

# Update package.json using sed
sed -i '' "s/\"version\": \"$PKG_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json

# Update tauri.conf.json using sed
sed -i '' "s/\"version\": \"$TAURI_VERSION\"/\"version\": \"$NEW_VERSION\"/" tauri/tauri.conf.json

echo "Updated both package.json and tauri/tauri.conf.json to $NEW_VERSION"

# Commit and tag
git add package.json tauri/tauri.conf.json
git commit -m "Release v$NEW_VERSION"

# Create tag if it doesn't already exist
if git rev-parse "v$NEW_VERSION" >/dev/null 2>&1; then
  echo "Tag v$NEW_VERSION already exists, skipping tag creation"
else
  git tag v$NEW_VERSION
fi

echo ""
echo "Run the following to push and trigger release:"
echo "  git push origin main --tags"
