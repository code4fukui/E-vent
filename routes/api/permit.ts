import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "../../kv.ts";
import { EventItem } from "../../interface/EventItem.interface.ts";
import { addNote } from "../../activity_pub.ts";

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

    // 募集ツイート
    const messageId1 = crypto.randomUUID();
    const messageBody1 = permitTarget.title + "の参加者を募集！";
    await kv.set(["messages", messageId1], {
      id: messageId1,
      body: messageBody1,
      event: permitTarget.hash,
      type: "joinner",
    });
    await addNote(messageId1, messageBody1);

    // 感想募集ツイート
    const messageId2 = crypto.randomUUID();
    const messageBody2 = permitTarget.title + "の感想を募集！";
    await kv.set(["messages", messageId2], {
      id: messageId2,
      body: messageBody2,
      event: permitTarget.hash,
      type: "comment",
    });
    await addNote(messageId2, messageBody2);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
