import { Handlers } from "$fresh/server.ts";
import { kv } from "../../../kv.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const key = ["user", id];
    const user = (await kv.get(key)).value!;
    return new Response(JSON.stringify(user));
  },
};
