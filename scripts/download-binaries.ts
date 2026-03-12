#!/usr/bin/env bun

import { existsSync, readdirSync, copyFileSync, chmodSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

import { $ } from "bun";

const REPO = "router-for-me/CLIProxyAPI";
const SIDECAR_NAME = "riin-proxy";
const BINARIES_DIR = join(process.cwd(), "tauri", "binaries");

const VERSION = process.argv[2];
const TARGET = process.argv[3];

const PLATFORMS = {
  darwin: { arm64: "aarch64-apple-darwin", amd64: "x86_64-apple-darwin" },
  windows: { arm64: "aarch64-pc-windows-msvc", amd64: "x86_64-pc-windows-msvc" },
  linux: { arm64: "aarch64-unknown-linux-gnu", amd64: "x86_64-unknown-linux-gnu" },
};

function getTargetTriple(): { os: string; arch: string; triple: string } {
  if (TARGET) {
    const map: Record<string, { os: string; arch: string }> = {
      "aarch64-apple-darwin": { os: "darwin", arch: "arm64" },
      "x86_64-apple-darwin": { os: "darwin", arch: "amd64" },
      "x86_64-pc-windows-msvc": { os: "windows", arch: "amd64" },
      "aarch64-pc-windows-msvc": { os: "windows", arch: "arm64" },
      "x86_64-unknown-linux-gnu": { os: "linux", arch: "amd64" },
      "aarch64-unknown-linux-gnu": { os: "linux", arch: "arm64" },
    };
    const found = map[TARGET];
    if (!found) {
      console.error(`Unknown target: ${TARGET}`);
      process.exit(1);
    }
    return { ...found, triple: TARGET };
  }

  const os =
    process.platform === "win32"
      ? "windows"
      : process.platform === "darwin"
        ? "darwin"
        : process.platform === "linux"
          ? "linux"
          : null;
  const arch = process.arch === "arm64" ? "arm64" : process.arch === "x64" ? "amd64" : null;

  if (!os || !arch) {
    console.error(`Unsupported platform: ${process.platform}/${process.arch}`);
    process.exit(1);
  }

  return { os, arch, triple: PLATFORMS[os][arch] };
}

async function getVersion(): Promise<string> {
  if (VERSION) return VERSION.replace(/^v/, "");

  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
  const data = (await res.json()) as { tag_name: string };
  return data.tag_name.replace(/^v/, "");
}

async function download(url: string, path: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
}

async function extract(file: string, isZip: boolean): Promise<string> {
  const dir = join(tmpdir(), `riin-${Date.now()}`, "out");
  mkdirSync(dir, { recursive: true });

  if (isZip) {
    await $`unzip -q ${file} -d ${dir}`;
  } else {
    await $`tar -xzf ${file} -C ${dir}`;
  }

  return dir;
}

function findBinary(dir: string): string | null {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isFile() && (entry.name.includes("CLIProxyAPI") || entry.name.includes("cli-proxy-api"))) return path;
    if (entry.isDirectory()) {
      const found = findBinary(path);
      if (found) return found;
    }
  }
  return null;
}

async function main() {
  const { os, arch, triple } = getTargetTriple();
  const version = await getVersion();
  const ext = os === "windows" ? "zip" : "tar.gz";

  const asset = `CLIProxyAPI_${version}_${os}_${arch}.${ext}`;
  const url = `https://github.com/${REPO}/releases/download/v${version}/${asset}`;
  const dest = join(BINARIES_DIR, `${SIDECAR_NAME}-${triple}${os === "windows" ? ".exe" : ""}`);

  if (existsSync(dest)) {
    console.log(`Already exists: ${dest}`);
    return;
  }

  mkdirSync(BINARIES_DIR, { recursive: true });

  const tmp = join(tmpdir(), `riin-${Date.now()}`, asset);
  mkdirSync(join(tmp, ".."), { recursive: true });

  console.log(`Downloading ${url}...`);
  await download(url, tmp);

  console.log("Extracting...");
  const dir = await extract(tmp, ext === "zip");
  const bin = findBinary(dir);

  if (!bin) {
    console.error("Binary not found");
    process.exit(1);
  }

  copyFileSync(bin, dest);
  chmodSync(dest, 0o755);
  rmSync(join(tmp, ".."), { recursive: true, force: true });

  console.log(`Installed: ${dest}`);
}

main();
