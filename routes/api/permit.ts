import { FreshContext, Handlers } from "$fresh/server.ts";
import { kv } from "../../kv.ts";
import { EventItem } from "../../interface/EventItem.interface.ts";
import { addNote } from "../../activity_pub.ts";
import { formatDTS } from "../../utils/date.ts";

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
    const messageBody1 = `
      イベントの予定をお知らせします<br>
      イベント名：${target.title}<br>
      日時：${formatDTS(target.date)}<br>
      場所：${target.placement}<br>
      詳細：<a href="https://e-vent.deno.dev/event/${target.hash}">こちら</a><br>
      ${
      target.prevEventId
        ? `<a href="https://e-vent.deno.dev/event/${target.prevEventId}#comments">前回の参加者の感想</a><br>`
        : ""
    }
      <img src="${target.thumbnailUrl}"><br>
      リプライするとこのイベントに申し込みできます
      `;
    await kv.set(["messages", messageId1], {
      id: messageId1,
      body: messageBody1,
      event: target.hash,
      type: "joinner",
    });
    await addNote(messageId1, messageBody1);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
