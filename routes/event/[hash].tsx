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
        <h2 class="ev-title">{item.title}</h2>
        <img src={item.thumbnailUrl} alt={item.title} />
        <p>{item.description}</p>
      </main>
    </Fragment>
  );
}
