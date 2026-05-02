#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * Emits dist/sbom.json — a minimal CycloneDX 1.5 Software Bill of Materials.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID, createHash } from "node:crypto";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");

/**
 * Generates a Package URL (purl) for the npm package.
 */
function getPurl(name, version) {
  const [scope, bareName] = name.startsWith("@")
    ? name.slice(1).split("/")
    : [null, name];
  return scope
    ? `pkg:npm/%40${scope}/${bareName}@${version}`
    : `pkg:npm/${bareName}@${version}`;
}

/**
 * Calculates hashes for the given file.
 */
function getHashes(filePath) {
  if (!existsSync(filePath)) return [];
  const buf = readFileSync(filePath);
  return [
    { alg: "SHA-256", content: createHash("sha256").update(buf).digest("hex") },
    { alg: "SHA-512", content: createHash("sha512").update(buf).digest("hex") },
  ];
}

/**
 * Builds the CycloneDX 1.5 SBOM object.
 */
function buildSbom(pkg, purl, hashes) {
  const now = new Date().toISOString();
  const sbom = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: `urn:uuid:${randomUUID()}`,
    version: 1,
    metadata: {
      timestamp: now,
      tools: [{ vendor: "Skeletonic Stylus", name: "emit-sbom.mjs", version: "1.0.0" }],
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
            url: typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url,
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
  return sbom;
}

const srcManifest = join(repoRoot, "package.json");
const dstSbom = join(repoRoot, "dist", "sbom.json");
const minCss = join(repoRoot, "dist", "css", "core", "skeletonic.min.css");

if (!existsSync(srcManifest)) {
  console.error(`emit-sbom: source manifest not found: ${srcManifest}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(srcManifest, "utf8"));
const purl = getPurl(pkg.name, pkg.version);
const hashes = getHashes(minCss);
const sbom = buildSbom(pkg, purl, hashes);

writeFileSync(dstSbom, JSON.stringify(sbom, null, 2) + "\n");
console.log(`emit-sbom: wrote ${dstSbom} (CycloneDX 1.5, ${hashes.length} hashes)`);
