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

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcManifest = join(repoRoot, "package.json");
const dstSbom = join(repoRoot, "dist", "sbom.json");
const minCss = join(repoRoot, "dist", "css", "core", "skeletonic.min.css");

if (!existsSync(srcManifest)) {
  console.error(`emit-sbom: source manifest not found.`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(srcManifest, "utf8"));

// 1. Build PURL (Package URL)
const [scope, name] = pkg.name.startsWith("@") ? pkg.name.slice(1).split("/") : [null, pkg.name];
const purl = scope ? `pkg:npm/%40${scope}/${name}@${pkg.version}` : `pkg:npm/${name}@${pkg.version}`;

// 2. Build Hashes
const hashes = [];
if (existsSync(minCss)) {
  const buf = readFileSync(minCss);
  hashes.push(
    { alg: "SHA-256", content: createHash("sha256").update(buf).digest("hex") },
    { alg: "SHA-512", content: createHash("sha256").update(buf).digest("hex") }
  );
}

// 3. Build CycloneDX 1.5 Object
const sbom = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  serialNumber: `urn:uuid:${randomUUID()}`,
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
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
        { type: "vcs", url: typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url },
        { type: "issue-tracker", url: pkg.bugs?.url }
      ].filter(r => r.url)
    }
  },
  components: [],
  dependencies: [{ ref: purl, dependsOn: [] }]
};

if (hashes.length > 0) sbom.metadata.component.hashes = hashes;

// 4. Emit
writeFileSync(dstSbom, JSON.stringify(sbom, null, 2) + "\n");
console.log(`emit-sbom: success`);
