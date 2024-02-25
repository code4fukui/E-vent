import { Handlers, PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";
import { EventItem } from "../interface/EventItem.interface.ts";
import Header from "../components/Header.tsx";
import EventCard from "../islands/EventCard.tsx";
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

export default function Permit(eventItems: PageProps<EventItem[]>) {
  const items = eventItems.data;
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <h2 class="ev-title">イベント承認</h2>
        <section class="flex flex-col md:grid md:grid-cols-2 gap-2">
          {items.map((item) => <EventCard event={item} isPermitter={true} />)}
        </section>
      </main>
    </Fragment>
  );
}
