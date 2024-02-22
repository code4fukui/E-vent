import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "../../kv.ts";

export const hanler: Handlers = {
  async GET(_req: Request, ctx: FreshContext) {
    const permitMode = ctx.url.searchParams.get("mode");
    const permitTarget = ctx.url.searchParams.get("id");
    const target = await kv.get(["eventItems", permitTarget]);

    await kv.set(["eventItems", permitTarget], {
      ...target,
      permitted: permitMode === "permit",
    });
    return new Response(JSON.stringify({ success: true }));
  },
};
