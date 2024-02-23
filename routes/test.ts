import { Handlers } from "$fresh/server.ts";
import { kv } from "../kv.ts";
import { addNote } from "../activity_pub.ts";

/** 動作確認用テスト */
export const handler: Handlers = {
  async GET(_req, _ctx) {
    const hash = crypto.randomUUID();
    const title = "テストイベント " + new Date();
    const eventItem = {
      hash,
      title: "test",
      date: new Date("2024-02-21 16:40:23"),
      description: "テストイベント",
      placement: "jigオフィス",
      thumbnailUrl: "",
    };
    const messageId1 = crypto.randomUUID();
    const messageBody1 = eventItem.title + " 募集";

    await kv.set(["eventItems", eventItem.hash], eventItem);
    await kv.set(["messages", messageId1], {
      id: messageId1,
      body: messageBody1,
      type: "joinner",
    });
    await kv.set(["eventItemsByJoinnerMessage", messageId1], eventItem.hash);
    await addNote(messageId1, messageBody1);

    const messageId2 = crypto.randomUUID();
    const messageBody2 = eventItem.title + " 感想";
    await kv.set(["messages", messageId2], {
      id: messageId2,
      body: messageBody2,
      type: "comment",
    });
    await kv.set(["eventItemsByCommentMessage", messageId2], eventItem.hash);
    addNote(messageBody2, "comment");

    return new Response("投稿しました");
  },
};
