import { Handlers, PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";
import { EventItem } from "../../interface/EventItem.interface.ts";
import Header from "../../components/Header.tsx";
import { kv } from "../../kv.ts";

export const handler: Handlers<EventItem> = {
  async GET(_req, ctx) {
    const hash = ctx.params.hash;
    const eventItem = await kv.get(["eventItems", hash]);
    return ctx.render(eventItem.value);
  },
};

export default function Event(event: PageProps<EventItem>) {
  const item = event.data;
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <section>
          <h2 class="ev-title">{item.title}</h2>
          <img
            class="w-full h-40 object-cover object-center bg-gray-300"
            src={item.thumbnailUrl}
            alt={item.title}
          />
          <p class="mt-4">{item.description}</p>
        </section>

        <section class="mt-4">
          <h3 class="text-xl font-bold">参加者一覧</h3>
          {item.joinners !== undefined
            ? (
              <ul class="mt-2 flex gap-2">
                {item.joinners.map((joinner) => {
                  <span>{joinner.user}</span>;
                })}
              </ul>
            )
            : <p>まだ参加者がいません</p>}
        </section>

        <section class="mt-4">
          <h3 class="text-xl font-bold">コメント</h3>
          {item.comments !== undefined
            ? (
              <ul class="mt-2 flex gap-2">
                {item.comments.map((joinner) => {
                  <span>{joinner.user}</span>;
                })}
              </ul>
            )
            : <p>まだコメントがありません</p>}
        </section>
      </main>
    </Fragment>
  );
}
