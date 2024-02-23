import { load } from "https://deno.land/std@0.191.0/dotenv/mod.ts";

await load();
export const kv = await Deno.openKv(Deno.env.get("CONNECT_DATABASE_URL"));

export interface Follower {
  id: string;
}

export interface Message {
  id: string;
  body: string;
  type: "joinner" | "comment";
  event: string;
}
