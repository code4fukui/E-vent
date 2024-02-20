import { Handlers, PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";
import { EventItem } from "../../interface/EventItem.interface.ts";
import Header from "../../components/Header.tsx";
import EventCard from "../../components/EventCard.tsx";

export const handler: Handlers<EventItem> = {
  GET(_req, ctx) {
    return ctx.render({
      title: "test",
      date: new Date("2024-02-21 16:40:23"),
      description: "テストイベント",
      placement: "jigオフィス",
      hash: "0ho800kjvg",
      thumbnailUrl: "",
    });
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
