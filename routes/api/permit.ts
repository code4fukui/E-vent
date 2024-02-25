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
    const messageBody1 = `
      多摩市のイベントの予定をお知らせします<br>
      イベント名：${target.title}<br>
      日時：${formatDTS(target.date)}<br>
      場所：${target.placement}<br>
      詳細：<a href="https://e-vent.deno.dev/event/${target.hash}">こちら</a><br>
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

    // 感想募集ツイート
    const messageId2 = crypto.randomUUID();
    const messageBody2 = `
      多摩市のイベントの感想の募集をお知らせします<br>
      イベント名：${target.title}<br>
      日時：${formatDTS(target.date)}<br>
      場所：${target.placement}<br>
      詳細：<a href="https://e-vent.deno.dev/event/${target.hash}">こちら</a><br>
      <img src="${target.thumbnailUrl}"><br>
      このイベントの感想をリプライで募集中
    `;
    await kv.set(["messages", messageId2], {
      id: messageId2,
      body: messageBody2,
      event: target.hash,
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

function formatDTS(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}年${month}月${day}日 ${hours}時${minutes}分`;
}
