import { Handlers } from "$fresh/server.ts";
import { kv } from "../kv.ts";

/** DBをリセット */
export const handler: Handlers = {
  async GET(_req, _ctx) {
    for await (const message of kv.list({ prefix: ["messages"]})) {
        await kv.delete(message.key);
      }
      for await (const follower of kv.list({ prefix: ["followers"]})) {
        await kv.delete(follower.key);
      }
      return new Response("リセットしました");
  },
};
