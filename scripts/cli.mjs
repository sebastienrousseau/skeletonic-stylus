#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * `skeletonic` — opinionated project bootstrap.
 *
 * Usage:
 *   npx @sebastienrousseau/skeletonic-stylus init
 *   npx @sebastienrousseau/skeletonic-stylus add <component>
 *   npx @sebastienrousseau/skeletonic-stylus list
 *   npx @sebastienrousseau/skeletonic-stylus --version
 *
 * `init` scaffolds a `styles/` folder in the current directory with a
 * thin Stylus entry that imports tokens + a few sensible component
 * defaults, plus a starter `index.html` that loads the CDN bundle so
 * the project works *with no build step* on day one. The user opts
 * into a Stylus pipeline later when they want to customise tokens.
 *
 * `add <component>` copies a single component's `.styl` source into
 * the user's `styles/components/` folder for them to edit.
 *
 * `list` prints every component file shipped in the package.
 *
 * No dependencies. Pure Node 18+. Cross-platform.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));

const c = (code) => (process.stdout.isTTY ? `\x1b[${code}m` : "");
const reset = c(0);
const bold = c(1);
const dim = c(2);
const green = c(32);
const cyan = c(36);
const red = c(31);

const log = (msg) => process.stdout.write(msg + "\n");
const ok = (msg) => log(`  ${green}✓${reset} ${msg}`);
const fail = (msg) => process.stderr.write(`  ${red}✗${reset} ${msg}\n`);

const ENTRY_STYL = `// styles/index.styl — your project's Stylus entry.
// Built into a single CSS file by:
//   npx stylus -c styles/index.styl -o public/styles.css
// Or skip the build step entirely and load the CDN bundle in <head>:
//   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sebastienrousseau/skeletonic-stylus@${pkg.version}/css/core/skeletonic.min.css">
//   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sebastienrousseau/skeletonic-stylus@${pkg.version}/css/core/skeletonic-ui.min.css">

@import "@sebastienrousseau/skeletonic-stylus/stylus/skeletonic"
@import "@sebastienrousseau/skeletonic-stylus/stylus/skeletonic-ui"

// Override any token in your project root variables file.
// @import "tokens"
`;

const STARTER_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Skeletonic site</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sebastienrousseau/skeletonic-stylus@${pkg.version}/css/core/skeletonic.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sebastienrousseau/skeletonic-stylus@${pkg.version}/css/core/skeletonic-ui.min.css">
  </head>
  <body>
    <main class="container">
      <h1>Hello, Skeletonic</h1>
      <p>Class-based, JS-free, RTL-ready, WCAG 2.2 AA. Pulls 1.6 KB
        brotli for the core + 5.9 KB for the UI add-on.</p>

      <p>
        <a href="#" class="button primary">Primary</a>
        <a href="#" class="button secondary">Secondary</a>
        <a href="#" class="button primary-outline">Outline</a>
      </p>

      <div class="alert alert-success" role="status">
        <strong>It works.</strong> Edit <code>index.html</code> and refresh.
      </div>
    </main>
  </body>
</html>
`;

// Resolve where the .styl component sources live. After `npm publish`
// the package layout is `<pkgRoot>/stylus/components/`. In the source
// repo (during development) it's `<pkgRoot>/src/stylus/components/`
// or `<pkgRoot>/dist/stylus/components/` after a build. Try each.
function componentsDir() {
  for (const candidate of ["stylus", "dist/stylus", "src/stylus"]) {
    const dir = join(pkgRoot, candidate, "components");
    if (existsSync(dir)) return dir;
  }
  return null;
}

function listComponents() {
  const dir = componentsDir();
  if (!dir) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".styl"))
    .map((f) => f.replace(/\.styl$/, ""))
    .sort();
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function relPath(p) {
  const rel = p.replace(process.cwd() + "/", "");
  return rel === p ? p : rel;
}

async function confirm(prompt, dflt = true) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const yn = dflt ? "Y/n" : "y/N";
  const ans = (await rl.question(`${prompt} ${dim}[${yn}]${reset} `)).trim().toLowerCase();
  rl.close();
  if (!ans) return dflt;
  return ans.startsWith("y");
}

async function cmdInit() {
  log(`${bold}${cyan}Skeletonic Stylus${reset} v${pkg.version} — project bootstrap`);
  log("");
  const cwd = process.cwd();
  log(`  Target: ${dim}${cwd}${reset}`);
  log("");

  const stylesDir = join(cwd, "styles");
  const stylesEntry = join(stylesDir, "index.styl");
  const indexHtml = join(cwd, "index.html");

  const willWrite = [
    [stylesEntry, ENTRY_STYL, existsSync(stylesEntry)],
    [indexHtml, STARTER_HTML, existsSync(indexHtml)],
  ];

  for (const [path, , exists] of willWrite) {
    log(`  ${exists ? dim + "skip" : "write"}${reset} ${relPath(path)}${exists ? dim + " (exists)" + reset : ""}`);
  }
  log("");

  if (process.stdin.isTTY) {
    const go = await confirm("Proceed?");
    if (!go) {
      log("  cancelled.");
      return 0;
    }
  }

  ensureDir(stylesDir);
  let written = 0;
  for (const [path, content, exists] of willWrite) {
    if (exists) continue;
    writeFileSync(path, content, "utf8");
    written++;
    ok(`wrote ${relPath(path)}`);
  }

  log("");
  log(`  ${green}Done.${reset} ${written} file${written === 1 ? "" : "s"} created.`);
  log("");
  log(`  ${bold}Next steps:${reset}`);
  log(`    1. Open ${cyan}index.html${reset} in a browser to see it work.`);
  log(`    2. Customise tokens by editing ${cyan}styles/index.styl${reset}.`);
  log(`    3. Add a single component to your project tree:`);
  log(`         ${dim}npx @sebastienrousseau/skeletonic-stylus add card${reset}`);
  log("");
  log(`  Docs: ${cyan}https://skeletonic.io/${reset}`);
  return 0;
}

function cmdAdd(name) {
  if (!name) {
    fail("`add` requires a component name.");
    log(`  Try: ${dim}skeletonic list${reset} to see what's available.`);
    return 1;
  }
  const dir = componentsDir();
  const src = dir ? join(dir, `${name}.styl`) : null;
  if (!src || !existsSync(src)) {
    fail(`No component named "${name}". Run \`skeletonic list\`.`);
    return 1;
  }
  const cwd = process.cwd();
  const targetDir = join(cwd, "styles", "components");
  const targetFile = join(targetDir, `${name}.styl`);
  ensureDir(targetDir);
  try {
    writeFileSync(targetFile, readFileSync(src, "utf8"), { encoding: "utf8", flag: "wx" });
  } catch (err) {
    if (err.code === "EEXIST") {
      fail(`${relPath(targetFile)} already exists. Refusing to overwrite.`);
      return 1;
    }
    throw err;
  }
  ok(`copied ${name}.styl → ${relPath(targetFile)}`);
  return 0;
}

function cmdList() {
  const items = listComponents();
  log(`${bold}${items.length} components${reset} shipped in v${pkg.version}:`);
  log("");
  for (const name of items) log(`  ${cyan}${name}${reset}`);
  log("");
  log(`  ${dim}skeletonic add <name>${reset}  copies one into your project.`);
  return 0;
}

function cmdHelp() {
  log(`${bold}skeletonic${reset} v${pkg.version}`);
  log("");
  log("  Usage:");
  log(`    ${cyan}skeletonic init${reset}          scaffold styles/ + index.html in cwd`);
  log(`    ${cyan}skeletonic add <name>${reset}    copy one component into ./styles/components/`);
  log(`    ${cyan}skeletonic list${reset}          list every shipped component`);
  log(`    ${cyan}skeletonic --version${reset}     print the package version`);
  log(`    ${cyan}skeletonic --help${reset}        this message`);
  log("");
  log(`  Docs: https://skeletonic.io/`);
  return 0;
}

const [, , cmd, ...args] = process.argv;
let exit = 0;
switch (cmd) {
  case "init":
    exit = await cmdInit();
    break;
  case "add":
    exit = cmdAdd(args[0]);
    break;
  case "list":
  case "ls":
    exit = cmdList();
    break;
  case "--version":
  case "-v":
    log(pkg.version);
    break;
  case "--help":
  case "-h":
  case undefined:
    exit = cmdHelp();
    break;
  default:
    fail(`Unknown command: ${cmd}`);
    cmdHelp();
    exit = 1;
}
process.exit(exit);
