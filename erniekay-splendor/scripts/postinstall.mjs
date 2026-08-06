// Cloudflare Workers Builds runs only `npm clean-install` followed by the
// deploy command. `wrangler deploy` detects an OpenNext project and delegates
// to `opennextjs-cloudflare deploy`, which requires .open-next to already
// exist — it will not build it, and wrangler's own build.command does not run
// on that path. So the Worker bundle has to be produced here, right after
// dependencies are installed.
//
// Skipped outside CI so local `npm install` stays fast.
import { spawnSync } from "node:child_process";

const inCI = Boolean(process.env.WORKERS_CI || process.env.CI);

if (!inCI) {
  console.log("[postinstall] Not CI — skipping OpenNext build.");
  console.log("[postinstall] Run `npm run build:cf` to produce .open-next locally.");
  process.exit(0);
}

console.log("[postinstall] CI detected — building the OpenNext Worker bundle...");

const result = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.status !== 0) {
  console.error("[postinstall] OpenNext build failed.");
  process.exit(result.status ?? 1);
}
