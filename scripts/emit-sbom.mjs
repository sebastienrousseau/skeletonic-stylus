#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * Emits dist/sbom.json — a minimal CycloneDX 1.5 Software Bill of Materials
 * for the published artifact.
 *
 * Why a hand-rolled emitter instead of @cyclonedx/cyclonedx-npm?
 *   This package has ZERO runtime dependencies (`dependencies` is unset; only
 *   `devDependencies` exist). The published tarball ships only compiled CSS
 *   and Stylus sources — no JavaScript, no transitive runtime graph. The
 *   correct SBOM is therefore a single-component manifest describing the
 *   package itself, which we can emit deterministically without invoking
 *   any package manager. This avoids the pnpm 9 / cyclonedx-npm v2 flag
 *   incompatibility (`--all`, `--omit` were removed from `pnpm ls`) and
 *   removes a heavy native-build dependency from the toolchain.
 *
 * If runtime dependencies are ever added, swap this for @cyclonedx/cdxgen:
 *   pnpm add -D @cyclonedx/cdxgen
 *   cdxgen -t pnpm -o dist/sbom.json --spec-version 1.5
 *
 * Cross-platform: pure Node, no shell.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID, createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const srcManifest = join(repoRoot, "package.json");
const dstSbom = join(repoRoot, "dist", "sbom.json");
const minCss = join(repoRoot, "dist", "css", "core", "skeletonic.min.css");

if (!existsSync(srcManifest)) {
  console.error(`emit-sbom: source manifest not found: ${srcManifest}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(srcManifest, "utf8"));

// Build a purl per https://github.com/package-url/purl-spec
// e.g. pkg:npm/%40sebastienrousseau/skeletonic-stylus@2.0.0
const [scope, bareName] = pkg.name.startsWith("@")
  ? pkg.name.slice(1).split("/")
  : [null, pkg.name];
const purl = scope
  ? `pkg:npm/%40${scope}/${bareName}@${pkg.version}`
  : `pkg:npm/${bareName}@${pkg.version}`;

// Hash the principal compiled artefact (best-effort; not fatal if absent).
const hashes = [];
if (existsSync(minCss)) {
  const buf = readFileSync(minCss);
  hashes.push(
    { alg: "SHA-256", content: createHash("sha256").update(buf).digest("hex") },
    { alg: "SHA-512", content: createHash("sha512").update(buf).digest("hex") },
  );
}

const now = new Date().toISOString();

const sbom = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  serialNumber: `urn:uuid:${randomUUID()}`,
  version: 1,
  metadata: {
    timestamp: now,
    tools: [
      {
        vendor: "Skeletonic Stylus",
        name: "emit-sbom.mjs",
        version: "1.0.0",
      },
    ],
    component: {
      "bom-ref": purl,
      type: "library",
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      licenses: [{ expression: pkg.license }],
      purl,
      externalReferences: [
        { type: "website", url: pkg.homepage },
        {
          type: "vcs",
          url:
            typeof pkg.repository === "string"
              ? pkg.repository
              : pkg.repository?.url,
        },
        { type: "issue-tracker", url: pkg.bugs?.url },
      ].filter((ref) => ref.url),
    },
  },
  components: [],
  dependencies: [{ ref: purl, dependsOn: [] }],
};

if (hashes.length > 0) {
  sbom.metadata.component.hashes = hashes;
}

writeFileSync(dstSbom, JSON.stringify(sbom, null, 2) + "\n");
console.log(`emit-sbom: wrote ${dstSbom} (CycloneDX 1.5, ${hashes.length} hashes)`);
