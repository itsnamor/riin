#!/usr/bin/env bun

import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";

const BUMP_TYPE = process.argv[2];

if (!BUMP_TYPE) {
  console.log("Usage: bun run scripts/release.ts [major|minor|patch]");
  process.exit(1);
}

const validBumps = ["major", "minor", "patch"];
if (!validBumps.includes(BUMP_TYPE)) {
  console.error(`Invalid bump type: ${BUMP_TYPE} (use major, minor, or patch)`);
  process.exit(1);
}

function readJsonFile(path: string): Record<string, unknown> {
  const content = readFileSync(path, "utf-8");
  return JSON.parse(content);
}

function writeJsonFile(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

function runGit(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("git", args);
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (data) => {
      stdout += data;
    });
    proc.stderr.on("data", (data) => {
      stderr += data;
    });
    proc.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`git ${args.join(" ")} failed: ${stderr}`));
    });
    proc.on("error", reject);
  });
}

async function main() {
  console.log(`Release script - bump type: ${BUMP_TYPE}`);

  const pkgJson = readJsonFile("package.json");
  const tauriConf = readJsonFile("tauri/tauri.conf.json");

  const pkgVersion = pkgJson.version as string;
  const tauriVersion = tauriConf.version as string;

  console.log(`Current versions - package.json: ${pkgVersion}, tauri.conf.json: ${tauriVersion}`);

  const [major, minor, patch] = pkgVersion.split(".").map(Number);

  let newMajor = major;
  let newMinor = minor;
  let newPatch = patch;

  if (BUMP_TYPE === "major") {
    newMajor = major + 1;
    newMinor = 0;
    newPatch = 0;
  } else if (BUMP_TYPE === "minor") {
    newMinor = minor + 1;
    newPatch = 0;
  } else if (BUMP_TYPE === "patch") {
    newPatch = patch + 1;
  }

  const newVersion = `${newMajor}.${newMinor}.${newPatch}`;
  console.log(`New version: ${newVersion}`);

  pkgJson.version = newVersion;
  tauriConf.version = newVersion;

  writeJsonFile("package.json", pkgJson);
  writeJsonFile("tauri/tauri.conf.json", tauriConf);

  console.log(`Updated both package.json and tauri/tauri.conf.json to ${newVersion}`);

  await runGit(["add", "package.json", "tauri/tauri.conf.json"]);
  await runGit(["commit", "-m", `Release v${newVersion}`]);

  try {
    await runGit(["rev-parse", `v${newVersion}`]);
    console.log(`Tag v${newVersion} already exists, skipping tag creation`);
  } catch {
    await runGit(["tag", `v${newVersion}`]);
  }

  console.log("Pushing changes and tags to remote...");
  await runGit(["push", "origin", "main", "--tags"]);

  console.log("");
  console.log(`Release v${newVersion} triggered! CI will build and create release.`);
}

main();
