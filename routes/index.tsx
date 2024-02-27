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
  const events = items.filter((item) =>
    (new Date(item.date)).getTime() > (new Date()).getTime()
  );
  const pastEvents = items.filter((item) =>
    (new Date(item.date)).getTime() < (new Date()).getTime()
  );
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <section class="mb-16">
          <h2 class="ev-title">参加者募集中のイベント</h2>
          <div class="flex flex-col md:grid md:grid-cols-2 gap-2">
            {events.sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ).map((
              item,
            ) => <EventCard event={item} />)}
          </div>
        </section>
        <section>
          <h2 class="ev-title">終了したイベント</h2>
          <div class="flex flex-col md:grid md:grid-cols-2 gap-2">
            {pastEvents.sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ).map((
              item,
            ) => <EventCard event={item} />)}
          </div>
        </section>
      </main>
    </Fragment>
  );
}
