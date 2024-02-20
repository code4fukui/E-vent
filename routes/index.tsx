import Header from "../components/Header.tsx";
import { Fragment } from "preact";
import { Handlers } from "$fresh/server.ts";
import { EventItem } from "../interface/EventItem.interface.ts";
import { PageProps } from "$fresh/server.ts";
import EventCard from "../components/EventCard.tsx";
import { kv } from "../kv.ts";

export const handler: Handlers<EventItem[]> = {
  async GET(_req, ctx) {
    const list = kv.list<EventItem>({ prefix: ["eventItems"] });
    const eventItems = [];
    for await (const eventItem of list) {
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
        <section class="grid grid-cols-3 gap-2">
          {items.map((item) => <EventCard event={item} />)}
        </section>
      </main>
    </Fragment>
  );
}
