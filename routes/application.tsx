import { Handlers, PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";
import Header from "../components/Header.tsx";
import { kv } from "../kv.ts";
import { EventItem } from "../interface/EventItem.interface.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    return ctx.render();
  },
  async POST(req, ctx) {
    const url = new URL(req.url);
    const form = await req.formData();
    const hash = crypto.randomUUID();
    const title = form.get("title")?.toString() ?? "no title";
    const description = form.get("description")?.toString() ?? "no description";
    const date = new Date(Date.parse(form.get("date") as string));
    const joinDeadline = new Date(
      Date.parse(form.get("joinDeadline") as string),
    );
    const placement = form.get("placement")?.toString() ?? "no place";
    const thumbnailUrl = "";
    const eventItem: EventItem = {
      hash,
      title,
      description,
      date,
      placement,
      thumbnailUrl,
      joinDeadline,
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
          <label>
            イベントタイトル<br />
            <input
              class="ev-input"
              type="text"
              name="title"
              placeholder="イベントタイトルを入力"
              required
            />
          </label>
          <label>
            イベント詳細<br />
            <textarea
              class="w-full border-solid border-2 border-gray-500 px-4 py-2 rounded-2xl"
              type="text"
              name="description"
              cols={40}
              rows={5}
              placeholder="詳細を入力"
            >
            </textarea>
          </label>
          <label>
            開催日時<br />
            <input
              class="ev-input"
              type="datetime-local"
              name="date"
              required
            />
          </label>
          <label>
            開催場所<br />
            <input
              class="ev-input"
              type="text"
              name="placement"
              placeholder="場所を入力"
              required
            />
          </label>
          <label>
            参加締め切り日時<br />
            <input
              class="ev-input"
              type="datetime-local"
              name="joinDeadline"
            />
          </label>
          <label>
            サムネイル写真<br />
            <input type="file" name="thumbnail" id="event-thumbnail" />
          </label>
          <button class="ev-button">
            申請する
          </button>
        </form>
      </main>
    </Fragment>
  );
}
