#!/usr/bin/env bun

import { tmpdir } from "os";
import { join } from "path";
import { parseArgs } from "util";

import { $ } from "bun";

const REPO = "nghyane/llm-mux";
const SIDECAR_NAME = "riin-proxy";
const BINARIES_DIR = join(import.meta.dir, "..", "tauri", "binaries");

const TRIPLES: Record<string, { os: string; arch: string }> = {
  "aarch64-apple-darwin": { os: "darwin", arch: "arm64" },
  "x86_64-apple-darwin": { os: "darwin", arch: "amd64" },
  "aarch64-pc-windows-msvc": { os: "windows", arch: "arm64" },
  "x86_64-pc-windows-msvc": { os: "windows", arch: "amd64" },
  "aarch64-unknown-linux-gnu": { os: "linux", arch: "arm64" },
  "x86_64-unknown-linux-gnu": { os: "linux", arch: "amd64" },
};

const OS_MAP: Record<string, string> = { win32: "windows", darwin: "darwin", linux: "linux" };
const ARCH_MAP: Record<string, string> = { arm64: "arm64", x64: "amd64" };

const { values: flags } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    version: { type: "string", short: "v" },
    target: { type: "string", short: "t" },
  },
});

function getTarget() {
  if (flags.target) {
    const info = TRIPLES[flags.target];
    if (!info) throw new Error(`Unknown target: ${flags.target}`);
    return { ...info, triple: flags.target };
  }

  const os = OS_MAP[process.platform];
  const arch = ARCH_MAP[process.arch];
  if (!os || !arch) throw new Error(`Unsupported: ${process.platform}/${process.arch}`);

  const triple = Object.entries(TRIPLES).find(([, v]) => v.os === os && v.arch === arch)?.[0];
  if (!triple) throw new Error(`No triple for ${os}/${arch}`);
  return { os, arch, triple };
}

async function getVersion() {
  if (flags.version) return flags.version.replace(/^v/, "");
  const json = await $`curl -sfL https://api.github.com/repos/${REPO}/releases/latest`.json();
  return (json as { tag_name: string }).tag_name.replace(/^v/, "");
}

const { os, arch, triple } = getTarget();
const version = await getVersion();
const isWindows = os === "windows";
const ext = isWindows ? "zip" : "tar.gz";
const dest = join(BINARIES_DIR, `${SIDECAR_NAME}-${triple}${isWindows ? ".exe" : ""}`);

if (await Bun.file(dest).exists()) {
  console.log(`Already exists: ${dest}`);
  process.exit(0);
}

const url = `https://github.com/${REPO}/releases/download/v${version}/llm-mux_${version}_${os}_${arch}.${ext}`;
const tmp = join(tmpdir(), `riin-${Date.now()}`);
const archive = join(tmp, `archive.${ext}`);

console.log(`Downloading ${url}...`);
await $`mkdir -p ${tmp}`;
await $`curl -fSL -o ${archive} ${url}`;

console.log("Extracting...");
const out = join(tmp, "out");
await $`mkdir -p ${out}`;
if (isWindows) await $`unzip -q ${archive} -d ${out}`;
else await $`tar -xzf ${archive} -C ${out}`;

const glob = new Bun.Glob("**/*");
const bin = [...glob.scanSync({ cwd: out, onlyFiles: true })].find((f) => f.includes("llm-mux"));
if (!bin) throw new Error("Binary not found in archive");

await $`mkdir -p ${BINARIES_DIR}`;
await $`cp ${join(out, bin)} ${dest}`;

if (!isWindows) await $`chmod 755 ${dest}`;

await $`rm -rf ${tmp}`;

console.log(`Installed: ${dest}`);
