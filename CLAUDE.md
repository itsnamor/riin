# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**riin** is a Tauri desktop application (Rust + React/TypeScript) that provides a GUI for managing AI API credentials and proxy configuration. It wraps a sidecar binary (`riin-proxy`) that handles the actual proxy functionality.

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, HeroUI v3 (beta)
- **Backend**: Tauri v2 (Rust)
- **State Management**: Jotai
- **Package Manager**: Bun
- **Linting/Formatting**: Oxlint, Oxfmt

## Common Commands

```bash
# Development
bun run dev              # Start Tauri development server (runs Vite on :1234 + Rust)
bun run ui:dev           # Run Vite dev server only (port 1234)

# Building
bun run build            # Build production Tauri app
bun run ui:build         # Build frontend only (outputs to dist/)

# Code Quality
bun run lint             # Run Oxlint
bun run lint:fix         # Run Oxlint with auto-fix
bun run fmt              # Format code with Oxfmt
bun run fmt:check        # Check formatting

# Release
bun run release patch    # Bump version, commit, tag, and push
bun run release minor
bun run release major

# Binary Management
bun run download:binaries            # Download sidecar binary for current platform
bun run scripts/download-binaries.ts -- --target aarch64-apple-darwin  # Specific target
```

## Architecture

### Directory Structure

```
ui/                      # Frontend React application
  core/                  # Core utilities
    icon/                # Iconify configuration
    stores/              # Jotai state atoms (config, credentials, layout, etc.)
    styles/              # Global CSS (Tailwind v4, fonts, theme)
    types/               # TypeScript type definitions
    ui/                  # Shared UI components
  modules/               # Feature modules
    credentials/         # Credential management UI
    layout/              # Main app layout/sidebar
    models/              # AI models listing
    proxy/               # Proxy control UI
  main.tsx               # App entry point
tauri/                   # Rust Tauri application
  src/
    commands/            # Tauri command handlers ( exposed to frontend)
    helpers/             # Rust utility modules
    types/               # Rust types (ProxyState, OAuthState, etc.)
  resources/             # Bundled resources (config.default.yml)
  binaries/              # Sidecar binaries (riin-proxy)
scripts/                 # Build/release scripts (Bun/TypeScript)
```

### Key Architectural Patterns

**Frontend State (Jotai)**
- Stores in `ui/core/stores/` use Jotai atoms for state management
- Each store exports: `useXxxStore()`, `useXxxValue()`, `useSetXxx()` hooks
- Config/credentials are synced between UI and Rust backend via Tauri commands

**Tauri Commands**
Commands are defined in `tauri/src/commands/` and registered in `tauri/src/lib.rs`:
- `read_config` / `write_config` - Config file I/O
- `read_credentials` / `write_credential` / `delete_credential` - Credential management
- `start_proxy` / `stop_proxy` / `is_proxy_running` - Proxy lifecycle
- `start_oauth_login` / `cancel_oauth_login` - OAuth flow

**Config File Location**
`~/.config/riin/config.yml` - YAML configuration for the proxy

**Sidecar Binary**
The app bundles `riin-proxy` as an external binary (downloaded from `router-for-me/CLIProxyAPI` releases). The binary is executed with shell permissions to run the actual proxy server.

### Import Conventions

- **Absolute imports only**: Use `$/` prefix (configured in `vite.config.ts` and `tsconfig.json`)
- **No relative imports** (`../`) - enforced by Oxlint
- Import order is auto-sorted by Oxfmt: builtins → external → internal (`$core/`, `$modules/`) → styles

### Code Style

- Use `type` instead of `interface` (enforced by Oxlint)
- File/folder names use `kebab-case`
- Single quotes for strings
- Trailing commas required
- 120 character print width

### UI Components

Uses HeroUI v3 (beta) components from `@heroui/react`. Key patterns:
- Compound component pattern (e.g., `Card.Header`, `Card.Content`)
- Tailwind v4 with `@import` syntax (not `@tailwind` directives)
- Custom utilities in `main.css` (e.g., `liquid-glass` for glassmorphism)
