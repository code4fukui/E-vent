import { Handlers } from "$fresh/server.ts";
import { kv } from "../kv.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    for (let i = 0; i < 4; i++) {
      const hash = crypto.randomUUID();
      const eventItem = {
        hash,
        title: "test",
        date: new Date("2024-02-21 16:40:23"),
        description: "テストイベント",
        placement: "jigオフィス",
        thumbnailUrl: "",
      };
      await kv.set(["eventItems", eventItem.hash], eventItem);
    }
    return new Response("サンプル作成！");
  },
};

const eventItems = [
  {
    title: "test",
    date: new Date("2024-02-21 16:40:23"),
    description: "テストイベント",
    placement: "jigオフィス",
    thumbnailUrl: "",
  },
];
