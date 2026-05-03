#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * Post-publish CDN smoke check. Polls jsDelivr and unpkg for the
 * just-published version and fails if either CDN doesn't serve a
 * 200 within `timeoutMs`. Used in the npm-publish workflow as the
 * final gate before the release is considered done.
 *
 * Reads the version from dist/package.json (or package.json as a
 * fallback) so the same script works whether the workflow ran from
 * the published tarball or the repo root.
 *
 * Exit codes:
 *   0 — every URL served 200 within the timeout
 *   1 — at least one URL stayed in error state past the timeout
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const pkgPath = existsSync(join(repoRoot, "dist/package.json"))
  ? join(repoRoot, "dist/package.json")
  : join(repoRoot, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

// Validate package metadata against an allowlist before constructing
// any outbound URL. Refuses to ping a CDN for an unexpected name or a
// non-semver version, which closes a file-controlled-URL surface.
const ALLOWED_NAME = "@sebastienrousseau/skeletonic-stylus";
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
if (pkg.name !== ALLOWED_NAME) {
  console.error(`verify-cdn: refusing — unexpected package name: ${JSON.stringify(pkg.name)}`);
  process.exit(2);
}
if (typeof pkg.version !== "string" || !SEMVER_RE.test(pkg.version)) {
  console.error(`verify-cdn: refusing — invalid semver version: ${JSON.stringify(pkg.version)}`);
  process.exit(2);
}
const name = ALLOWED_NAME;
const version = pkg.version;

const timeoutMs = Number(process.env.CDN_TIMEOUT_MS || 5 * 60 * 1000);  // 5 min default
const pollMs = Number(process.env.CDN_POLL_MS || 5000);                 // 5 s polls

const urls = [
  `https://unpkg.com/${name}@${version}/css/core/skeletonic.min.css`,
  `https://unpkg.com/${name}@${version}/css/core/skeletonic-ui.min.css`,
  `https://cdn.jsdelivr.net/npm/${name}@${version}/css/core/skeletonic.min.css`,
  `https://cdn.jsdelivr.net/npm/${name}@${version}/css/core/skeletonic-ui.min.css`,
];

console.log(`\n\x1b[1mverify-cdn\x1b[0m — confirming ${name}@${version} is served by both CDNs\n`);

const checkOne = async (url) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return { url, ok: true, status: res.status };
    } catch {
      // network error — keep polling
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
  return { url, ok: false, status: "timeout" };
};

const all = await Promise.all(urls.map(checkOne));

let allOk = true;
for (const r of all) {
  const tick = r.ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
  console.log(`  ${tick} ${r.status}  ${r.url}`);
  if (!r.ok) allOk = false;
}

if (!allOk) {
  console.error(`\n\x1b[31mFAIL\x1b[0m — one or more CDN URLs did not serve 200 within ${timeoutMs / 1000}s.\n`);
  process.exit(1);
}

console.log(`\n\x1b[32mAll CDN URLs are live.\x1b[0m\n`);
process.exit(0);
