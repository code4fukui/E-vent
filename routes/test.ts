import { Handlers } from "$fresh/server.ts";
import { teiki } from "../cron.ts";

/** 動作確認用テスト */
export const handler: Handlers = {
  async GET(_req, _ctx) {
    await teiki();
    return new Response("投稿しました");
  },
};
