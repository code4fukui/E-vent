import { Handlers } from "$fresh/server.ts";
import { entrypoint } from "../../../const.ts";
import { EventItem } from "../../../interface/EventItem.interface.ts";
import { kv } from "../../../kv.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    const list = await kv.list<EventItem>({ prefix: ["eventItems"] });
    let eventCount = 0;
    for await (const item of list) {
      if (!item.value.permitted) continue;
      eventCount++;
    }
    return Response.json({
      "@context": "https://www.w3.org/ns/activitystreams",
      "id": `${entrypoint}u/event/outbox`,
      "totalItems": eventCount,
    });
  },
};
