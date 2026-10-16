/**
 * Fails if a shared file has drifted from its original in erniekay-splendor.
 *
 * The two applications are separate npm packages with no workspace linking
 * them, so lib/schema.ts and lib/mediaSlots.ts are duplicated rather than
 * imported. That is a deliberate trade — a monorepo for two apps and two files
 * is more machinery than it saves — but a silent divergence is the failure mode
 * it buys. Specifically: a slot added to the public site but not here is
 * invisible to staff, and a schema change here that the public app has not seen
 * writes columns it will not read.
 *
 * The copies carry a "COPY — do not edit here" header. Everything after that
 * header must match the original byte for byte.
 *
 * Usage: npm run check:shared
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.join(here, "..");
// Sibling checkout. Both applications live under the same parent directory.
const siteRoot = path.join(adminRoot, "..", "erniekay-splendor");

const SHARED = ["lib/schema.ts", "lib/mediaSlots.ts"];

/** Drops the copy header so the comparison is of the code, not the preamble. */
function withoutHeader(source) {
  const marker = "COPY — do not edit here.";
  if (!source.includes(marker)) return source;
  const end = source.indexOf("*/");
  return end === -1 ? source : source.slice(end + 2);
}

/** Ignores line-ending and trailing-whitespace differences: this is a Windows checkout. */
const normalise = (source) =>
  withoutHeader(source).replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();

let failed = false;

for (const relative of SHARED) {
  const copyPath = path.join(adminRoot, relative);
  const originalPath = path.join(siteRoot, relative);

  let copy;
  let original;

  try {
    copy = readFileSync(copyPath, "utf8");
  } catch {
    console.error(`missing  ${relative} in erniekay-admin`);
    failed = true;
    continue;
  }

  try {
    original = readFileSync(originalPath, "utf8");
  } catch {
    // Not a failure: the public site may simply not be checked out next to this
    // one (a CI job that builds only the admin, for instance).
    console.warn(`skip     ${relative} — no erniekay-splendor checkout at ${siteRoot}`);
    continue;
  }

  if (normalise(copy) === normalise(original)) {
    console.log(`ok       ${relative}`);
    continue;
  }

  failed = true;

  const copyLines = normalise(copy).split("\n");
  const originalLines = normalise(original).split("\n");
  const firstDiff = originalLines.findIndex((line, index) => line !== copyLines[index]);

  console.error(`DIVERGED ${relative}`);
  if (firstDiff !== -1) {
    console.error(`  first difference at line ${firstDiff + 1} (after the copy header)`);
    console.error(`  splendor: ${originalLines[firstDiff] ?? "(end of file)"}`);
    console.error(`  admin:    ${copyLines[firstDiff] ?? "(end of file)"}`);
  }
}

if (failed) {
  console.error(
    "\nEdit the original in erniekay-splendor, then copy it over the file here " +
      "(keeping the COPY header) and re-run.",
  );
  process.exit(1);
}

console.log("\nShared files are in step.");
