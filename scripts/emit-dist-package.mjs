#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * Emits dist/package.json with consumer-facing fields and rewritten paths.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

/**
 * Strips development-only fields from the package object.
 */
function stripDevFields(pkg) {
  const fields = [
    "scripts",
    "devDependencies",
    "pre-commit",
    "pnpm",
    "autoupdate",
    "license_URI",
    "filename",
  ];
  for (const k of fields) delete pkg[k];
}

/**
 * Rewrites path fields for the published tarball layout.
 */
function rewritePaths(pkg) {
  pkg.main = "stylus/skeletonic.styl";
  pkg.style = "css/core/skeletonic.min.css";
  pkg.sass = "stylus/skeletonic.styl";
  pkg.files = ["css", "stylus", "README.md", "index.html", "sbom.json"];
  pkg.scripts = {
    test: 'echo "No tests in published artefact" && exit 0',
  };
}

/**
 * Verifies that the rewritten paths exist in the dist directory.
 */
function verifyDistPaths(pkg, root) {
  const checks = [pkg.main, pkg.style];
  const missing = checks.filter((p) => !existsSync(join(root, "dist", p)));
  if (missing.length > 0) {
    console.error(
      `emit-dist-package: paths missing from dist/: ${missing.join(", ")}`,
    );
    process.exit(1);
  }
}

const srcManifest = join(repoRoot, "package.json");
const dstManifest = join(repoRoot, "dist", "package.json");

if (!existsSync(srcManifest)) {
  console.error(`emit-dist-package: source manifest not found: ${srcManifest}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(srcManifest, "utf8"));

stripDevFields(pkg);
rewritePaths(pkg);

writeFileSync(dstManifest, JSON.stringify(pkg, null, 2) + "\n");

verifyDistPaths(pkg, repoRoot);

console.log(
  `emit-dist-package: wrote dist/package.json (main=${pkg.main}, style=${pkg.style})`,
);
