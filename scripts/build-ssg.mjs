#!/usr/bin/env node
import { execSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

function hasCommand(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Drops SSG output in dist that the current build no longer produces.
 *
 * cargo-ssg clears public/ each run, but dist/ receives a merging copy on top of
 * the library payload, so every content change leaves its previous fingerprinted
 * asset behind. Those orphans are published to the CDN and shipped in the npm
 * tarball, and they accumulate with each release. Only generated names are
 * pruned — fingerprinted assets and the _csp/ hashes — so the library files that
 * earlier build steps put in dist are never touched.
 */
const FINGERPRINTED = /\.[0-9a-f]{8}\.[^.]+$/;

// Generated output whose name is stable rather than fingerprinted, and which a
// given build may legitimately stop producing — news-sitemap.xml is dropped by
// fix-ssg-seo, so a copy left in dist by an earlier build would outlive it.
const GENERATED_NAMES = new Set(["news-sitemap.xml"]);

function pruneStaleOutput(publicDir, distDir) {
  if (!existsSync(distDir)) return 0;

  let pruned = 0;
  for (const entry of readdirSync(distDir)) {
    const distPath = resolve(distDir, entry);
    const publicPath = resolve(publicDir, entry);

    if (statSync(distPath).isDirectory()) {
      if (existsSync(publicPath)) pruned += pruneStaleOutput(publicPath, distPath);
      continue;
    }

    const generated =
      FINGERPRINTED.test(entry) || distDir.endsWith("_csp") || GENERATED_NAMES.has(entry);
    if (generated && !existsSync(publicPath)) {
      rmSync(distPath);
      pruned += 1;
    }
  }
  return pruned;
}

const ssgInstalled = hasCommand("ssg");

if (ssgInstalled) {
  // Runs before the build: a blank line in the raw-HTML content renders the
  // markup as escaped text and still produces a valid, passing site.
  // Regenerates content/components/ from the manifest. Runs before the lint so
  // generated pages are linted too, and before the compile so the reference is
  // always in step with src/stylus/components/.
  execSync("node ./scripts/generate-component-docs.mjs", { stdio: "inherit", cwd: root });
  execSync("node ./scripts/lint-content.mjs", { stdio: "inherit", cwd: root });
  console.log("build-ssg: generating showcase site with cargo-ssg...");
  execSync("ssg build -f ssg.toml", { stdio: "inherit", cwd: root });
  // Runs on the SSG output before it is copied into dist: the sitemap cargo-ssg
  // writes during the compile describes the previous build, so a clean build
  // ships an empty one.
  execSync("node ./scripts/fix-ssg-seo.mjs", { stdio: "inherit", cwd: root });
  cpSync(resolve(root, "assets"), resolve(root, "public/assets"), { recursive: true, force: true });
  // The social card is referenced absolutely by base.html (og:image and
  // twitter:image), so it has to exist at the published path, not only in
  // the repo. It is a checked-in artefact regenerated when the hero changes.
  cpSync(resolve(root, "images"), resolve(root, "public/images"), { recursive: true, force: true });
  cpSync(resolve(root, "_layouts/styles.css"), resolve(root, "public/styles.css"), { force: true });
  cpSync(resolve(root, "_layouts/showcase.css"), resolve(root, "public/showcase.css"), { force: true });
  cpSync(resolve(root, "_layouts/docs.css"), resolve(root, "public/docs.css"), { force: true });
  cpSync(resolve(root, "_layouts/theme-init.js"), resolve(root, "public/theme-init.js"), { force: true });
  cpSync(resolve(root, "_layouts/main.js"), resolve(root, "public/main.js"), { force: true });
  cpSync(resolve(root, "public/index.html"), resolve(root, "index.html"), { force: true });
  cpSync(resolve(root, "public"), resolve(root, "dist"), { recursive: true, force: true });
  const pruned = pruneStaleOutput(resolve(root, "public"), resolve(root, "dist"));
  if (pruned > 0) console.log(`build-ssg: pruned ${pruned} stale generated asset(s) from dist.`);
  console.log("build-ssg: successfully compiled SSG site and synchronized dist.");
} else {
  console.log("build-ssg: ssg binary not detected in PATH; falling back to committed index.html and assets.");
  if (existsSync(resolve(root, "index.html"))) {
    cpSync(resolve(root, "index.html"), resolve(root, "dist/index.html"), { force: true });
  }
  if (existsSync(resolve(root, "assets"))) {
    cpSync(resolve(root, "assets"), resolve(root, "dist/assets"), { recursive: true, force: true });
  }
}
