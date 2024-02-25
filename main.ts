/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";
import { startCron } from "./cron.ts";

const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  // cronの処理はこちら
  startCron();
}

await start(manifest, config);
