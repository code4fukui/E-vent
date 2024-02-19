#!/usr/bin/env -S deno run -A --watch=static/,routes/

import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

import "$std/dotenv/load.ts";
import { init } from "./init.ts";

const isBuildMode = Deno.args.includes("build");
if (!isBuildMode) {
  init();
}

await dev(import.meta.url, "./main.ts", config);
