#!/usr/bin/env bun

import { readFileSync, writeFileSync } from "fs";

import { $ } from "bun";

const BUMP = process.argv[2];

if (!BUMP) {
  console.log("Usage: bun run scripts/release.ts [major|minor|patch]");
  process.exit(1);
}

async function main() {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  const tauri = JSON.parse(readFileSync("tauri/tauri.conf.json", "utf-8"));

  const [major, minor, patch] = pkg.version.split(".").map(Number);
  const versions = {
    major: `${major + 1}.0.0`,
    minor: `${major}.${minor + 1}.0`,
    patch: `${major}.${minor}.${patch + 1}`,
  };
  const newVersion = versions[BUMP as keyof typeof versions];

  pkg.version = newVersion;
  tauri.version = newVersion;

  writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
  writeFileSync("tauri/tauri.conf.json", JSON.stringify(tauri, null, 2) + "\n");

  console.log(`Version: ${newVersion}`);

  await $`git add package.json tauri/tauri.conf.json`;
  await $`git commit -m "Release v${newVersion}"`;
  await $`git tag v${newVersion}`;
  await $`git push origin main --tags`;

  console.log("Done!");
}

main();
