#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * End-to-end pre-release verifier. Runs every gate the GitHub Actions
 * release workflow runs, plus deeper checks for tarball layout,
 * version coherence, and the published package.json paths.
 *
 * Exit codes:
 *   0 — every gate passed; safe to tag
 *   1 — at least one gate failed; do not tag
 *   2 — the runner itself crashed (missing fixture, etc.)
 *
 * Usage:
 *   pnpm run verify
 *   node scripts/verify-release.mjs
 *
 * The script is intentionally synchronous-feeling and prints a single
 * report at the end so a release engineer can scan it in <10 lines.
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { gzipSync, brotliCompressSync, constants as zlib } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const results = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  const tick = ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m";
  console.log(`  ${tick} ${name.padEnd(48)} ${detail}`);
};

const sh = (cmd, opts = {}) => {
  try {
    return execSync(cmd, { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"], ...opts }).toString();
  } catch (err) {
    return null;
  }
};

console.log("\n\x1b[1mverify-release\x1b[0m — pre-release gate\n");

// ─── 1. package.json ↔ dist/package.json ↔ SBOM version coherence ────
{
  const src = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
  const dist = existsSync(join(repoRoot, "dist/package.json"))
    ? JSON.parse(readFileSync(join(repoRoot, "dist/package.json"), "utf8"))
    : null;
  const sbom = existsSync(join(repoRoot, "dist/sbom.json"))
    ? JSON.parse(readFileSync(join(repoRoot, "dist/sbom.json"), "utf8"))
    : null;

  if (!dist) {
    record("dist/ exists", false, "run `pnpm build` first");
    process.exit(2);
  }
  record(
    "version coherence (src ↔ dist ↔ sbom)",
    src.version === dist.version && dist.version === sbom?.metadata?.component?.version,
    `${src.version} / ${dist.version} / ${sbom?.metadata?.component?.version}`,
  );
  record("dist/package.json strips dev fields", !["devDependencies", "pnpm", "autoupdate"].some(k => k in dist));
  record("dist/package.json files[] declared", Array.isArray(dist.files) && dist.files.length > 0, dist.files?.join(", "));
  const repoUrl = (typeof dist.repository === "string" ? dist.repository : dist.repository?.url || "").replace(/^git\+/, "").replace(/\.git$/, "");
  let repoOk = false;
  try {
    const u = new URL(repoUrl);
    repoOk = u.hostname === "github.com" && u.pathname === "/sebastienrousseau/skeletonic-stylus";
  } catch { /* malformed URL → fail gate */ }
  record("repository URL is github.com/sebastienrousseau/skeletonic-stylus", repoOk, repoUrl);
  record("publishConfig.access = public", dist.publishConfig?.access === "public");
  record("license is OSI-recognised", /MIT|Apache|BSD|ISC/i.test(dist.license || ""), dist.license);
}

// ─── 2. Bundle size budgets — measured against the actual artefact ───
{
  const budgets = [
    ["dist/css/core/skeletonic.min.css",            10 * 1024,     3 * 1024,   2.5 * 1024],
    ["dist/css/core/skeletonic-ui.min.css",         48 * 1024,    10 * 1024,     8 * 1024],
    ["dist/css/animations/skeletonic-animations.min.css",
                                                   250 * 1024,    10 * 1024,     8 * 1024],
  ];
  for (const [path, rawMax, gzMax, brMax] of budgets) {
    if (!existsSync(join(repoRoot, path))) {
      record(`bundle present: ${path}`, false);
      continue;
    }
    const buf = readFileSync(join(repoRoot, path));
    const gz = gzipSync(buf, { level: 9 });
    const br = brotliCompressSync(buf, { params: { [zlib.BROTLI_PARAM_QUALITY]: 11 } });
    const fmt = (n) => `${(n / 1024).toFixed(2)}kB`;
    record(
      `size: ${path.split("/").slice(-1)[0]}`,
      buf.length <= rawMax && gz.length <= gzMax && br.length <= brMax,
      `raw ${fmt(buf.length)}/${fmt(rawMax)} · gz ${fmt(gz.length)}/${fmt(gzMax)} · br ${fmt(br.length)}/${fmt(brMax)}`,
    );
  }
}

// ─── 3. Production audit — required by CI ────────────────────────────
{
  const out = sh("pnpm audit --prod --json");
  // pnpm 10 emits a single JSON document. Empty `advisories` ⇒ clean.
  // Older pnpm versions wrote NDJSON, so fall back to line-by-line.
  let advisoryCount = 0;
  if (out) {
    try {
      const j = JSON.parse(out);
      advisoryCount = Object.keys(j.advisories || {}).length;
    } catch {
      advisoryCount = out.trim().split("\n").filter(l => {
        try { const o = JSON.parse(l); return o.severity && o.module_name; } catch { return false; }
      }).length;
    }
  }
  record("pnpm audit --prod", advisoryCount === 0, `${advisoryCount} advisory${advisoryCount === 1 ? "" : "ies"}`);
}

// ─── 4. Stylint clean ────────────────────────────────────────────────
{
  const r = spawnSync("pnpm", ["test"], { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
  const text = (r.stdout || "") + (r.stderr || "");
  const errMatch = text.match(/Stylint:\s*(\d+)\s*Errors/);
  const warnMatch = text.match(/Stylint:\s*(\d+)\s*Warnings/);
  const errors = errMatch ? Number(errMatch[1]) : 0;
  const warnings = warnMatch ? Number(warnMatch[1]) : 0;
  record("stylint", r.status === 0 && errors === 0, `${errors} errors, ${warnings} warnings`);
}

// ─── 5. Tarball validity ─────────────────────────────────────────────
{
  const tgz = sh("ls *.tgz 2>/dev/null").trim().split("\n").filter(Boolean).find(f => f.includes("skeletonic-stylus"));
  if (!tgz) {
    record("tarball produced", false, "run `pnpm build` first");
  } else {
    record("tarball produced", true, tgz);
    const fileList = sh(`tar -tzf "${tgz}"`)?.trim().split("\n") || [];
    const need = ["package/package.json", "package/css/core/skeletonic.min.css", "package/stylus/skeletonic.styl", "package/sbom.json", "package/README.md"];
    record("tarball contains required files", need.every(n => fileList.includes(n)), `${fileList.length} entries`);
  }
}

// ─── 6. CHANGELOG entry exists for current version ───────────────────
{
  const src = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
  const changelog = existsSync(join(repoRoot, "CHANGELOG.md"))
    ? readFileSync(join(repoRoot, "CHANGELOG.md"), "utf8")
    : "";
  record("CHANGELOG.md present", changelog.length > 0);
  record(`CHANGELOG references v${src.version}`, changelog.includes(src.version));
}

// ─── 7. Workflow file pinned + permissions ───────────────────────────
{
  const wf = existsSync(join(repoRoot, ".github/workflows/npm-publish.yml"))
    ? readFileSync(join(repoRoot, ".github/workflows/npm-publish.yml"), "utf8")
    : "";
  record(".github/workflows/npm-publish.yml present", wf.length > 0);
  // Every `uses:` must be a 40-char SHA, not @vN.
  const usesLines = wf.match(/uses:\s+\S+@[^\s]+/g) || [];
  const unpinned = usesLines.filter(l => !/uses:\s+\S+@[a-f0-9]{40}/.test(l));
  record("all GH actions pinned to SHA", unpinned.length === 0, unpinned.length ? unpinned.join("; ") : "");
  record("publish job has id-token: write", /publish:[\s\S]*?id-token:\s*write/.test(wf));
}

// ─── 8. Final tally ──────────────────────────────────────────────────
const failed = results.filter(r => !r.ok);
console.log(`\n  \x1b[1m${results.length - failed.length}/${results.length}\x1b[0m gates passed.\n`);
if (failed.length > 0) {
  console.log("  \x1b[31mFAILURES:\x1b[0m");
  for (const f of failed) console.log(`    - ${f.name}${f.detail ? ` (${f.detail})` : ""}`);
  console.log("");
  process.exit(1);
}
console.log("  \x1b[32mRelease is ready to tag.\x1b[0m\n");
process.exit(0);
