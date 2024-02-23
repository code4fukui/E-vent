import { Handlers } from "$fresh/server.ts";
import { kv } from "../kv.ts";
import { addNote } from "../activity_pub.ts";

/** 動作確認用テスト */
export const handler: Handlers = {
  async GET(_req, _ctx) {
    // イベントを作成
    const hash = crypto.randomUUID();
    const title = "テストイベント " + new Date();
    const eventItem = {
      hash,
      title,
      date: new Date("2024-02-21 16:40:23"),
      description: "テストイベント",
      placement: "jigオフィス",
      thumbnailUrl: "",
    };

    // 募集メッセージを投稿
    const messageId1 = crypto.randomUUID();
    const messageBody1 = eventItem.title + " 募集";
    await kv.set(["eventItems", eventItem.hash], eventItem);

    await kv.set(["messages", messageId1], {
      id: messageId1,
      body: messageBody1,
      event: eventItem.hash,
      type: "joinner",
    });
    await addNote(messageId1, messageBody1);

    // 感想メッセージを投稿
    const messageId2 = crypto.randomUUID();
    const messageBody2 = eventItem.title + " 感想";
    await kv.set(["messages", messageId2], {
      id: messageId2,
      body: messageBody2,
      event: eventItem.hash,
      type: "comment",
    });
    await addNote(messageId2, messageBody2);

    return new Response("テスト投稿をしました");
  },
};
