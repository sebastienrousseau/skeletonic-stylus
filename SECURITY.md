<!-- markdownlint-disable MD002 MD024 MD033 MD036 MD041 -->

This document is the security policy for
**`@sebastienrousseau/skeletonic-stylus`**. It tells you how to report a
suspected vulnerability, what to expect once you do, and which versions
of the library receive security fixes.

---

**Supported Versions**

Skeletonic Stylus ships security fixes only for the latest minor release
on the current major line. Older versions receive no backports.

| Version  | Supported          |
| -------- | ------------------ |
| 2.x      | :white_check_mark: |
| < 2.0    | :x:                |

---

**Reporting a Vulnerability**

**Please do not file public GitHub issues for security problems.**

Send the report privately to <sebastian.rousseau@gmail.com> with the
subject prefix `[SECURITY] skeletonic-stylus` and include:

- A clear description of the issue and its impact.
- Steps to reproduce, or a minimal proof-of-concept.
- The affected version(s) — `npm view @sebastienrousseau/skeletonic-stylus version`.
- Any suggested mitigation, if you have one.

You can also use GitHub's
[private vulnerability reporting](https://github.com/sebastienrousseau/skeletonic-stylus/security/advisories/new)
to submit a draft advisory directly through the repository's Security tab.

---

**Response Timeline**

- **Acknowledgement** within 72 hours of receipt.
- **Triage and severity assessment** within 7 days, using
  [CVSS v3.1](https://www.first.org/cvss/v3.1/specification-document).
- **Fix or mitigation plan** communicated within 14 days for
  high/critical findings, longer for low/medium.
- **Public disclosure** coordinated with the reporter; default 90-day
  embargo unless the issue is already public or being actively exploited.

---

**Scope**

In scope:

- Code published to npm under `@sebastienrousseau/skeletonic-stylus`.
- Build, release, and CI scripts in this repository
  (`scripts/`, `.github/workflows/`).
- Supply-chain integrity of the published artefact (SBOM, provenance
  attestation, npm Trusted Publishing configuration).

Out of scope:

- Vulnerabilities in third-party dependencies — please report those
  upstream and open a tracking issue here only if a coordinated
  workaround is needed.
- Issues that require a victim to install a maliciously modified copy
  of the package outside the official npm registry.
- Findings that depend on browser bugs already fixed in current
  releases of Chrome, Firefox, Safari, or Edge.

---

**Disclosure**

Confirmed advisories are published as
[GitHub Security Advisories](https://github.com/sebastienrousseau/skeletonic-stylus/security/advisories)
and assigned a CVE through GitHub's CNA when warranted. The CHANGELOG
entry for the patched release will reference the advisory ID.

---

**Supply-chain Hardening**

This project applies the following baseline controls; reports of
regressions in any of these are in-scope:

- All GitHub Actions are pinned to commit SHAs (Scorecard
  `Pinned-Dependencies`).
- Workflow tokens follow least privilege; `id-token: write` only on
  the publish job (Scorecard `Token-Permissions`).
- Releases are published to npm via OIDC Trusted Publishing with
  Sigstore provenance — no long-lived `NPM_TOKEN`.
- A CycloneDX SBOM ships in every release tarball at `sbom.json`.
- CodeQL (`security-extended` queries) and OpenSSF Scorecard run on
  every push to `main` and weekly.
