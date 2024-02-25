import Header from "../components/Header.tsx";
import { Fragment } from "preact";
import { Handlers } from "$fresh/server.ts";
import { EventItem } from "../interface/EventItem.interface.ts";
import { PageProps } from "$fresh/server.ts";
import EventCard from "../islands/EventCard.tsx";
import { kv } from "../kv.ts";

export const handler: Handlers<EventItem[]> = {
  async GET(_req, ctx) {
    const list = kv.list<EventItem>({ prefix: ["eventItems"] });
    const eventItems = [];
    for await (const eventItem of list) {
      if (!eventItem.value.permitted) continue;
      eventItems.push(eventItem.value);
    }
    return ctx.render(eventItems);
  },
};

export default function Home(eventItems: PageProps<EventItem[]>) {
  const items = eventItems.data;
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <h2 class="ev-title">イベント一覧</h2>
        <section class="flex flex-col md:grid md:grid-cols-2 gap-2">
          {items.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ).map((
            item,
          ) => <EventCard event={item} />)}
        </section>
      </main>
    </Fragment>
  );
}
