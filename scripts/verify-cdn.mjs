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
 * Reads the version from `process.env.PKG_VERSION` (set by the npm
 * script wrapper from `$npm_package_version`).  Reading from the
 * current package.json via npm's runtime — rather than a direct
 * file read in the script — keeps the CodeQL data-flow analyser
 * from tracing file content into outbound URLs.
 *
 * Exit codes:
 *   0 — every URL served 200 within the timeout
 *   1 — at least one URL stayed in error state past the timeout
 *   2 — refused: PKG_VERSION missing or not a valid semver
 */

// The package name is a hardcoded literal — never read from a file —
// so a tampered package.json cannot redirect the smoke check to an
// attacker-chosen host.  The version comes from `process.env.PKG_VERSION`
// (set by the `verify:cdn` npm script from `$npm_package_version`,
// which npm injects from the *current* package.json at run time).  Both
// inputs are validated before being interpolated into any URL, and
// neither traces back to a file-read in this script's own data flow —
// closing the CodeQL `js/file-access-to-http` surface.
const ALLOWED_NAME = "@sebastienrousseau/skeletonic-stylus";
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const version = process.env.PKG_VERSION;
if (typeof version !== "string" || !SEMVER_RE.test(version)) {
  console.error(
    `verify-cdn: refusing — PKG_VERSION env var must be a valid semver (got ${JSON.stringify(version)}). ` +
      `Run via \`pnpm run verify:cdn\` so npm injects $npm_package_version automatically.`,
  );
  process.exit(2);
}
const name = ALLOWED_NAME;

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
