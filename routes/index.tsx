import { useSignal } from "@preact/signals";
import Header from "../components/Header.tsx";
import { Fragment } from "preact";
import { Handlers } from "$fresh/server.ts";
import { EventItem } from "../interface/EventItem.interface.ts";
import { PageProps } from "$fresh/server.ts";
import EventCard from "../components/EventCard.tsx";

export const handler: Handlers<EventItem[]> = {
  GET(_req, ctx) {
    return ctx.render([{
      title: "test",
      date: new Date("2024-02-21 16:40:23"),
      description: "テストイベント",
      placement: "jigオフィス",
      hash: "0ho800kjvg",
      thumbnailUrl: "",
    }, {
      title: "test",
      date: new Date("2024-02-21 16:40:23"),
      description: "テストイベント",
      placement: "jigオフィス",
      hash: "0ho800kjvg",
      thumbnailUrl: "",
    }, {
      title: "test",
      date: new Date("2024-02-21 16:40:23"),
      description: "テストイベント",
      placement: "jigオフィス",
      hash: "0ho800kjvg",
      thumbnailUrl: "",
    }, {
      title: "test",
      date: new Date("2024-02-21 16:40:23"),
      description: "テストイベント",
      placement: "jigオフィス",
      hash: "0ho800kjvg",
      thumbnailUrl: "",
    }]);
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
