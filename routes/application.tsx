import { Handlers, PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";
import Header from "../components/Header.tsx";
import { kv } from "../kv.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    const hash = crypto.randomUUID();
    const title = form.get("title");
    const description = form.get("description");
    const date = new Date(Date.parse(form.get("date") as string));
    const placement = form.get("placement");
    const thumbnailUrl = "";
    const eventItem = {
      hash,
      title,
      description,
      date,
      placement,
      thumbnailUrl,
    };
    await kv.set(["eventItems", eventItem.hash], eventItem);
    return Response.redirect(url.origin + "/");
  },
};

export default function Application() {
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <h2 class="ev-title">イベント開催申請</h2>
        <form method="post" class="mx-auto flex flex-col gap-2">
          <input
            class="ev-input"
            type="text"
            name="title"
            placeholder="イベントタイトルを入力"
          >
          </input>
          <input
            class="ev-input"
            type="text"
            name="description"
            placeholder="詳細を入力"
          >
          </input>
          <input
            class="ev-input"
            type="date"
            name="date"
          >
          </input>
          <input
            class="ev-input"
            type="text"
            name="placement"
            placeholder="場所を入力"
          >
          </input>
          <button class="ev-button">
            申請する
          </button>
        </form>
      </main>
    </Fragment>
  );
}
