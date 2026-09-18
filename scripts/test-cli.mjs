#!/usr/bin/env node
/**
 * Skeletonic Stylus CLI Tests
 * Tests skeletonic init, add, list, version, and error handling.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const cliPath = join(repoRoot, "scripts", "cli.mjs");
const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));

function runCli(args, options = {}) {
  try {
    const stdout = execFileSync(process.execPath, [cliPath, ...args], {
      cwd: options.cwd || repoRoot,
      encoding: "utf8",
      env: { ...process.env, ...(options.env || {}) },
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (err) {
    return {
      status: err.status ?? 1,
      stdout: err.stdout?.toString() || "",
      stderr: err.stderr?.toString() || "",
    };
  }
}

test("CLI: --version returns current package version", () => {
  const { status, stdout } = runCli(["--version"]);
  assert.equal(status, 0);
  assert.equal(stdout.trim(), pkg.version);
});

test("CLI: --help prints usage help", () => {
  const { status, stdout } = runCli(["--help"]);
  assert.equal(status, 0);
  assert.match(stdout, /Usage:/);
  assert.match(stdout, /skeletonic init/);
});

test("CLI: list outputs available components", () => {
  const { status, stdout } = runCli(["list"]);
  assert.equal(status, 0);
  assert.match(stdout, /components shipped/);
  assert.match(stdout, /card/);
  assert.match(stdout, /alert/);
  assert.match(stdout, /navbar/);
  assert.doesNotMatch(stdout, /_contents/);
});

test("CLI: init scaffolds starter files in target folder", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "skeletonic-test-init-"));
  try {
    const { status, stdout } = runCli(["init"], { cwd: tempDir });
    assert.equal(status, 0);
    assert.match(stdout, /Done/);

    const indexHtml = join(tempDir, "index.html");
    const indexStyl = join(tempDir, "styles", "index.styl");

    assert.ok(existsSync(indexHtml), "index.html was created");
    assert.ok(existsSync(indexStyl), "styles/index.styl was created");

    const htmlContent = readFileSync(indexHtml, "utf8");
    assert.match(htmlContent, /Hello, Skeletonic/);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("CLI: add copies an existing component to styles/components/", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "skeletonic-test-add-"));
  try {
    const { status, stdout } = runCli(["add", "card"], { cwd: tempDir });
    assert.equal(status, 0);
    assert.match(stdout, /copied card\.styl/);

    const targetFile = join(tempDir, "styles", "components", "card.styl");
    assert.ok(existsSync(targetFile), "card.styl was copied");

    const cardContent = readFileSync(targetFile, "utf8");
    assert.match(cardContent, /\.card/);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("CLI: add non-existent component fails with error", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "skeletonic-test-nonexistent-"));
  try {
    const { status, stderr } = runCli(["add", "unknown-component-xyz"], { cwd: tempDir });
    assert.equal(status, 1);
    assert.match(stderr, /No component named/);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("CLI: add with no argument fails with helpful error", () => {
  const { status, stderr } = runCli(["add"]);
  assert.equal(status, 1);
  assert.match(stderr, /requires a component name/);
});
