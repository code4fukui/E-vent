import { kv } from "./kv.ts";
import { EventItem } from "./interface/EventItem.interface.ts";
import { formatDTS } from "./utils/date.ts";
import { addNote } from "./activity_pub.ts";

export function startCron() {
  Deno.cron("Sample cron", "*/1 * * * *", async () => {
    console.log("Every minute, Deno Deploy runs this without a server");
    const eventItems = kv.list<EventItem>({ prefix: ["eventItems"] });
    const now = formatDTS(new Date());
    for await (const eventItem of eventItems) {
      const target = eventItem.value;
      const deadLine = formatDTS(target.valuejoinDeadline);
      console.log("cron now=", now, "deadline=", deadLine);
      if (now == deadLine) {
        // 感想募集ツイート
        const messageId2 = crypto.randomUUID();
        const messageBody2 = `
          イベントの感想の募集をお知らせします<br>
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
      }
    }
  });
}
