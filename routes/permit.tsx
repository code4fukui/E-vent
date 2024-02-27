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
  const pastEvents = items.filter((item) =>
    (new Date(item.date)).getTime() < (new Date()).getTime()
  );
  const needPermitEvents = items.filter((item) =>
    (new Date(item.date)).getTime() > (new Date()).getTime() &&
    item.permitted === undefined
  );
  const permittedEvents = items.filter((item) =>
    (new Date(item.date)).getTime() > (new Date()).getTime() &&
    item.permitted !== undefined
  );
  return (
    <Fragment>
      <Header />
      <main class="ev-main">
        <section class="mb-8">
          <h2 class="ev-title">イベント承認</h2>
          <div
            class={"flex flex-col md:grid gap-2" +
              (needPermitEvents.length > 0
                ? "md:grid-cols-2"
                : " md:grid-cols-1")}
          >
            {needPermitEvents.length > 0
              ? needPermitEvents.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
              ).map((item) => <EventCard event={item} isPermitter={true} />)
              : (
                <span class="w-full my-16 text-xl text-center text-gray-700">
                  未承認のイベントはありません
                </span>
              )}
          </div>
        </section>
        <section class="mb-8">
          <h2 class="ev-title">承認・却下済みイベント</h2>
          <div class="flex flex-col md:grid md:grid-cols-2 gap-2">
            {permittedEvents.sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ).map((item) => <EventCard event={item} isPermitter={true} />)}
          </div>
        </section>
        <section>
          <h2 class="ev-title">終了済みイベント</h2>
          <div class="flex flex-col md:grid md:grid-cols-2 gap-2">
            {pastEvents.sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ).map((item) => <EventCard event={item} isPermitter={true} />)}
          </div>
        </section>
      </main>
    </Fragment>
  );
}
