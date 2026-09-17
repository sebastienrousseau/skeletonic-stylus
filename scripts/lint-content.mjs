#!/usr/bin/env node
/**
 * Guards the raw-HTML content sources against CommonMark block breakage.
 *
 * A blank line terminates an HTML block, so the parser restarts on the next
 * line: indented four or more spaces it becomes an indented code block, and
 * unindented it becomes a paragraph. Either way the markup is emitted as
 * escaped text inside <pre><code> instead of rendering, which silently ships
 * a broken showcase that still builds and still passes a tag-balance check.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");

const offences = [];

for (const file of readdirSync(contentDir).filter(f => f.endsWith(".md"))) {
  const lines = readFileSync(join(contentDir, file), "utf8").split("\n");
  // Frontmatter is YAML, not markdown: skip past its closing delimiter.
  const start = lines[0]?.trim() === "---" ? lines.indexOf("---", 1) + 1 : 0;

  let inPre = false;
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.includes("<pre")) inPre = true;

    if (line.trim() === "") {
      const next = lines[i + 1] ?? "";
      const indent = next.length - next.trimStart().length;
      if (inPre) {
        offences.push(`${file}:${i + 1} blank line inside <pre> splits the code block into paragraphs`);
      } else if (next.trim() && indent >= 4) {
        offences.push(`${file}:${i + 1} blank line before ${indent}-space indent turns the HTML below into a code block`);
      }
    }

    if (line.includes("</pre>")) inPre = false;
  }
}

if (offences.length > 0) {
  console.error("lint-content: raw HTML blocks broken by blank lines:");
  for (const o of offences) console.error(`  - ${o}`);
  console.error("Remove the blank line, or drop the indentation below 4 spaces.");
  process.exit(1);
}

console.log("lint-content: content HTML blocks intact.");
