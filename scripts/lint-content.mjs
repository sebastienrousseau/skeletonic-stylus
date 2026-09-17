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
  // CommonMark HTML block type 1 — <script>, <style>, <textarea> — ends only at
  // its closing tag. A blank line inside one is not a break, so flagging it is
  // a false positive that pushes authors into contorting perfectly good code.
  // <pre> is type 1 too, but a blank line there still changes what renders, so
  // it keeps its own check below.
  let inRawText = null;
  const RAW_TEXT = ["script", "style", "textarea"];

  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.includes("<pre")) inPre = true;
    if (inRawText === null) {
      const opened = RAW_TEXT.find(t => line.includes(`<${t}`) && !line.includes(`</${t}>`));
      if (opened) inRawText = opened;
    }

    if (line.trim() === "" && inRawText === null) {
      const next = lines[i + 1] ?? "";
      const indent = next.length - next.trimStart().length;
      if (inPre) {
        offences.push(`${file}:${i + 1} blank line inside <pre> splits the code block into paragraphs`);
      } else if (next.trim() && indent >= 4) {
        offences.push(`${file}:${i + 1} blank line before ${indent}-space indent turns the HTML below into a code block`);
      }
    }

    if (inRawText !== null && line.includes(`</${inRawText}>`)) inRawText = null;
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
