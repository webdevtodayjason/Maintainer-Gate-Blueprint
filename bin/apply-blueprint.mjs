#!/usr/bin/env node

import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error("Usage: node bin/apply-blueprint.mjs <manifest.json>");
  process.exit(2);
}

const blueprintRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const templatesRoot = join(blueprintRoot, "templates");
const manifest = JSON.parse(readFileSync(resolve(manifestPath), "utf8"));

required("REPO_ROOT_PATH");
required("PROJECT_NAME");
required("REPO_NAME");

const targetRoot = resolve(manifest.REPO_ROOT_PATH);

if (!existsSync(targetRoot)) {
  console.error(`Target repo does not exist: ${targetRoot}`);
  process.exit(1);
}

copyTree(templatesRoot, targetRoot, "");
console.log(`Applied maintainer-gate blueprint to ${targetRoot}`);

function copyTree(sourceRoot, targetRoot, relativeDir) {
  const currentSourceDir = relativeDir ? join(sourceRoot, relativeDir) : sourceRoot;

  for (const entry of readdirSync(currentSourceDir, { withFileTypes: true })) {
    const sourcePath = join(currentSourceDir, entry.name);
    const relativePath = relativeDir ? join(relativeDir, entry.name) : entry.name;
    const destPath = join(targetRoot, relativePath);

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyTree(sourceRoot, targetRoot, relativePath);
      continue;
    }

    const raw = readFileSync(sourcePath, "utf8");
    const rendered = raw.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
      if (!(key in manifest)) {
        throw new Error(`Missing manifest value for ${key}`);
      }
      return String(manifest[key]);
    });

    mkdirSync(dirname(destPath), { recursive: true });
    writeFileSync(destPath, rendered);

    if (relativePath.startsWith("scripts/")) {
      chmodSync(destPath, statSync(sourcePath).mode);
    }
  }
}

function required(key) {
  if (!manifest[key]) {
    console.error(`Missing required manifest key: ${key}`);
    process.exit(1);
  }
}
