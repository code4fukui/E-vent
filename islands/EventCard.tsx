import { EventItem } from "../interface/EventItem.interface.ts";

export default function EventCard(
  props: { event: EventItem; isPermitter?: boolean },
) {
  const permitEvent = async () => {
    await fetch(`/api/permit?mode=permit&id=${props.event.hash}`);
  };
  const rejectEvent = async () => {
    await fetch(`/api/permit?mode=reject&id=${props.event.hash}`);
  };
  return (
    <a
      class="w-full border-solid border-2 rounded-2xl 
        border-gray-500 p-4 transition-colors 
        hover:border-orange-500 hover:bg-gray-200
        focus:border-orange-500 focus:bg-gray-200"
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
      {props.isPermitter
        ? (
          <div class="flex gap-2 justify-center">
            <button class="ev-button" onClick={permitEvent}>承認</button>
            <button class="ev-button-danger" onClick={rejectEvent}>却下</button>
          </div>
        )
        : null}
    </a>
  );
}
