#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * Wraps a compiled CSS file in a single @layer skeletonic { … } block
 * with sub-layer ordering pre-declared at the top:
 *
 *   @layer skeletonic.reset, skeletonic.tokens, skeletonic.layout,
 *          skeletonic.elements, skeletonic.components, skeletonic.utilities;
 *   @layer skeletonic { … original CSS … }
 *
 * Why a post-wrap rather than nesting @layer inside Stylus source:
 *   - Stylus is whitespace-significant; wrapping the entire @import
 *     tree in @layer would require re-indenting every imported partial
 *     and is fragile in the face of new components.
 *   - A post-wrap is idempotent, deterministic, and trivial to revert.
 *
 * Cascade rules: any consumer styles outside any layer beat the
 * skeletonic layer in the cascade. This is the desired property —
 * consumers no longer fight specificity wars to override the library.
 *
 * Cross-platform: pure Node, no shell, runs on macOS / Linux / WSL.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { argv, exit } from "node:process";

const targets = argv.slice(2);
if (targets.length === 0) {
  console.error(
    "wrap-cascade-layers: usage: node wrap-cascade-layers.mjs <css-file> [<css-file> ...]",
  );
  exit(2);
}

const layerOrder =
  "@layer skeletonic.reset, skeletonic.tokens, skeletonic.layout, skeletonic.elements, skeletonic.components, skeletonic.utilities;";

let failed = 0;
for (const target of targets) {
  if (!existsSync(target)) {
    console.error(`wrap-cascade-layers: file not found: ${target}`);
    failed++;
    continue;
  }

  const css = readFileSync(target, "utf8");

  // Idempotency guard — never double-wrap.
  if (css.includes("@layer skeletonic.reset")) {
    console.log(`wrap-cascade-layers: ${target} already wrapped, skipping`);
    continue;
  }

  // Preserve any leading @charset rule — @charset must come first in
  // the CSS file, before any other rule, otherwise it's invalid.
  let charset = "";
  let body = css;
  const charsetMatch = body.match(/^(@charset[^;]+;\s*)/);
  if (charsetMatch) {
    charset = charsetMatch[1];
    body = body.slice(charsetMatch[1].length);
  }

  const wrapped = `${charset}${layerOrder}\n@layer skeletonic {\n${body}\n}\n`;

  writeFileSync(target, wrapped);
  console.log(`wrap-cascade-layers: wrapped ${target} (${wrapped.length} bytes)`);
}

exit(failed > 0 ? 1 : 0);
