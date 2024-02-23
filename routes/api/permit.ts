import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "../../kv.ts";
import { EventItem } from "../../interface/EventItem.interface.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext) {
    const permitMode = ctx.url.searchParams.get("mode");
    const permitTarget = ctx.url.searchParams.get("id");
    const target: EventItem =
      (await kv.get(["eventItems", permitTarget])).value;

    if (!permitMode || !permitTarget) {
      return new Response(JSON.stringify({ success: false }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    target.permitted = permitMode === "permit";
    console.log(target);
    console.log(typeof target.date);

    await kv.set(["eventItems", permitTarget], {
      ...target,
      permitted: permitMode === "permit",
    });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
