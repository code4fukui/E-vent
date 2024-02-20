import { Handlers } from "$fresh/server.ts";
import { Follower, kv, Message } from "../kv.ts";
import { EventItem } from "../interface/EventItem.interface.ts";

/** DBをリセット */
export const handler: Handlers = {
  async GET(_req, _ctx) {
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
