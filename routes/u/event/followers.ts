import { Handlers } from "$fresh/server.ts";
import { entrypoint } from "../../../const.ts";
import { kv } from "../../../kv.ts";

/** フォロワーリスト */
export const handler: Handlers = {
  async GET(_req, _ctx) {
    const items = (await Array.fromAsync(kv.list({ prefix: ["followers"]}))).map(a => a.value.id);
    return Response.json({
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: `${entrypoint}u/event/followers`,
      type: 'OrderedCollection',
      first: {
        type: 'OrderedCollectionPage',
        totalItems: items.length,
        partOf: `${entrypoint}u/event/followers`,
        orderedItems: items,
        id: `${entrypoint}u/event/followers?page=1`,
      }
    }, {
      headers: {
        "Content-Type": "application/activity+json; charset=utf-8"
      }
    });
  },
};
