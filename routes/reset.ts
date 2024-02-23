import { Handlers } from "$fresh/server.ts";
import { Follower, kv, Message } from "../kv.ts";
import { EventItem } from "../interface/EventItem.interface.ts";
import { load } from "https://deno.land/std@0.191.0/dotenv/mod.ts";

await load();

/** DBをリセット */
export const handler: Handlers = {
  async GET(req, _ctx) {
    const ADMIN_USER = Deno.env.get("ADMIN_USER");
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    if (!ADMIN_USER || !ADMIN_PASSWORD) {
      return new Response(null, { status: 500 });
    }
    if (
      req.headers.get("Authorization") !==
        `Basic ${btoa(`${ADMIN_USER}:${ADMIN_PASSWORD}`)}`
    ) {
      const headers = new Headers({
        "WWW-Authenticate": 'Basic realm="Fake Realm"',
      });
      return new Response("Unauthorized", { status: 401, headers });
    }
    for await (const message of kv.list<Message>({ prefix: ["messages"] })) {
      await kv.delete(message.key);
    }
    for await (const follower of kv.list<Follower>({ prefix: ["followers"] })) {
      await kv.delete(follower.key);
    }
    for await (
      const eventItem of kv.list<EventItem>({ prefix: ["eventItems"] })
    ) {
      await kv.delete(eventItem.key);
    }
    return new Response("リセットしました");
  },
};
