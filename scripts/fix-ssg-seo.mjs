#!/usr/bin/env node
/**
 * Rebuilds the SEO artefacts cargo-ssg cannot produce correctly for this site.
 *
 * Two upstream behaviours make the published site's discovery surface wrong,
 * and neither is reachable from front matter:
 *
 * 1. `sitemap.xml` is assembled by walking the output directory *during* the
 *    compile, before any page has been written to it. On a clean build the
 *    `<urlset>` is therefore empty; on a rebuild over a populated directory it
 *    describes the *previous* build. CI always builds clean, so the sitemap
 *    that ships is the empty one. The entries it does emit also order their
 *    children `changefreq, lastmod, loc` and leave `<lastmod>` empty, both of
 *    which the sitemaps.org schema rejects (`loc` must come first; `lastmod`
 *    must be a W3C date).
 *
 * 2. `news-sitemap.xml` is emitted unconditionally with placeholder content
 *    (`<loc></loc>`, "Unnamed Publication", "Untitled Article"). The repair
 *    plugin that would fill it derives each entry from the page's path
 *    relative to the site root and skips anything that resolves to the empty
 *    string — which is exactly what a root-level `index.md` resolves to. A CSS
 *    library's showcase is not a news publication, so the file is dropped
 *    rather than repaired.
 *
 * Everything else — canonical, og:url, RSS channel and item, robots.txt — is
 * correct once `content/index.md` declares an absolute `permalink` chain, and
 * is deliberately left alone here.
 */
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

/** Reads a top-level string key out of ssg.toml without a TOML dependency. */
function readConfigValue(config, key) {
  for (const line of config.split("\n")) {
    const match = line.match(/^\s*([A-Za-z_]+)\s*=\s*"([^"]*)"\s*$/);
    if (match && match[1] === key) return match[2];
  }
  return undefined;
}

const configPath = resolve(root, "ssg.toml");
const config = readFileSync(configPath, "utf8");
const baseUrl = (readConfigValue(config, "base_url") ?? "").replace(/\/+$/, "");
const outputDir = resolve(root, readConfigValue(config, "output_dir") ?? "public");

if (!baseUrl) {
  console.error("fix-ssg-seo: ssg.toml declares no base_url; cannot build absolute URLs.");
  process.exit(1);
}

/** Every generated page, as a site-relative directory path ("" is the root). */
function findPages(dir) {
  const pages = [];
  for (const entry of readdirSync(dir)) {
    // `.meta`, `.ssg-cache` and friends hold build state, not pages.
    if (entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      pages.push(...findPages(path));
    } else if (entry === "index.html") {
      pages.push(relative(outputDir, dir).split(sep).filter(Boolean).join("/"));
    }
  }
  return pages;
}

/**
 * The page's front matter, from the sidecar staticdatagen writes per page.
 *
 * Sidecars are flat inside `.meta/`, named after the source file's stem, so
 * the root `index.md` lands at `.meta/index.meta.json` and `foo/index.html`
 * at `.meta/foo.meta.json`.
 */
function readSidecar(page) {
  const path = join(outputDir, ".meta", `${page === "" ? "index" : page}.meta.json`);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

const xmlEscape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** W3C date (YYYY-MM-DD) or undefined — an empty `<lastmod>` is invalid. */
function lastmodOf(meta) {
  for (const key of ["item_pub_date", "last_build_date", "date"]) {
    const raw = meta[key];
    if (typeof raw !== "string" || raw.trim() === "") continue;
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  }
  return undefined;
}

// Pretty directory URLs with a trailing slash, matching the convention the
// canonical link, og:url and the RSS channel link already publish.
const pages = findPages(outputDir).sort();

if (pages.length === 0) {
  console.error(`fix-ssg-seo: no index.html found under ${outputDir}; the site did not build.`);
  process.exit(1);
}

const entries = pages.map((page) => {
  const loc = `${baseUrl}/${page === "" ? "" : `${page}/`}`;
  const lastmod = lastmodOf(readSidecar(page));
  const lines = [`    <loc>${xmlEscape(loc)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  return `  <url>\n${lines.join("\n")}\n  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

writeFileSync(join(outputDir, "sitemap.xml"), sitemap, "utf8");
console.log(
  `fix-ssg-seo: rebuilt sitemap.xml with ${entries.length} entr${entries.length === 1 ? "y" : "ies"}.`,
);

const newsSitemap = join(outputDir, "news-sitemap.xml");
if (existsSync(newsSitemap)) {
  rmSync(newsSitemap);
  console.log("fix-ssg-seo: dropped placeholder news-sitemap.xml (this site publishes no news).");
}

// The feed's item link, guid and self link have to be written as absolute URLs
// in front matter — cargo-ssg only derives them for a page that declares no
// permalink at all, and this one does. That duplicates the domain outside
// ssg.toml, so changing `base_url` there would silently publish a feed still
// pointing at the old host. Fail the build instead.
const feedPath = join(outputDir, "rss.xml");
if (existsSync(feedPath)) {
  const feed = readFileSync(feedPath, "utf8");
  const urls = [...feed.matchAll(/https?:\/\/[^\s"'<>]+/g)].map((match) => match[0]);
  const foreign = [...new Set(urls.filter((url) => !url.startsWith(`${baseUrl}/`)))]
    // The RSS 2.0 spec and Atom namespace URLs are not site URLs.
    .filter((url) => !url.startsWith("http://www.w3.org/"));

  if (foreign.length > 0) {
    console.error(
      `fix-ssg-seo: rss.xml carries ${foreign.length} URL(s) outside base_url (${baseUrl}):\n` +
        foreign.map((url) => `  ${url}`).join("\n") +
        "\n  Front matter in content/index.md (atom_link, item_link, item_guid) must " +
        "match base_url in ssg.toml.",
    );
    process.exit(1);
  }
}
