import { Handlers } from "$fresh/server.ts";
import { kv } from "../../kv.ts";

export const handler: Handlers = {
  async DELETE(_req, ctx) {
    const targetId = ctx.url.searchParams.get("id");

    try {
      await kv.delete(["eventItems", targetId]);
    } catch (error) {
      console.log(error);
      return Response.json({ success: false });
    }
    return Response.json({ success: true });
  },
};
