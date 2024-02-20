import { EventItem } from "../interface/EventItem.interface.ts";

export default function EventCard(props: { event: EventItem }) {
  return (
    <a
      class="w-full border-solid border-2 rounded-2xl border-orange-500 p-4"
      href={`/event/${props.event.hash}`}
    >
      <img src={props.event.thumbnailUrl} alt={props.event.title} />
      <h3>{props.event.title}</h3>
      <p>{props.event.description}</p>
      <section>
        <p>
          ⌚ {props.event.date.toLocaleString()}
        </p>
        <p>
          📍 {props.event.placement}
        </p>
      </section>
    </a>
  );
}
