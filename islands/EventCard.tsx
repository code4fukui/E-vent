import { EventItem } from "../interface/EventItem.interface.ts";

export default function EventCard(
  props: { event: EventItem; isPermitter?: boolean },
) {
  let isBusy = false;

  const permitEvent = async ($event: Event) => {
    $event.preventDefault();
    $event.stopPropagation();
    const res =
      await (await fetch(`/api/permit?mode=permit&id=${props.event.hash}`))
        .json();
    if (res?.success) {
      alert(`イベント「${props.event.title}」を承認しました`);
      globalThis.location.reload();
    }
  };
  const rejectEvent = async ($event: Event) => {
    $event.preventDefault();
    $event.stopPropagation();
    const res =
      await (await fetch(`/api/permit?mode=reject&id=${props.event.hash}`))
        .json();
    if (res?.success) {
      alert(`イベント「${props.event.title}」を却下しました`);
      globalThis.location.reload();
    }
  };

  const genDateString = (dateString: Date) => {
    const date = new Date(dateString);
    console.log(date, typeof date);
    return `${date.getFullYear()}/${
      (date.getMonth() + 1).toString().padStart(2, "0")
    }/${date.getDate().toString().padStart(2, "0")} ${
      date.getHours().toString().padStart(2, "0")
    }:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <a
      class="w-full border-solid border-2 rounded-2xl overflow-hidden
        border-gray-500 transition-colors
        hover:border-orange-500 hover:shadow-gray-500 hover:shadow-md
        focus:border-orange-500 focus:shadow-gray-500 focus:shadow-md"
      href={`/event/${props.event.hash}`}
    >
      <img
        class="w-full h-40 object-cover object-center bg-gray-300"
        src={props.event.thumbnailUrl}
        alt={props.event.title}
      />
      <div class="px-4 pb-4">
        <h3 class="text-2xl font-bold my-2">{props.event.title}</h3>
        <p>{props.event.description}</p>
        <section class="flex gap-2 text-xs text-gray-500">
          <p class="w-full">
            ⌚ {genDateString(props.event.date)}
          </p>
          <p class="w-full">
            📍 {props.event.placement}
          </p>
        </section>
        {props.isPermitter
          ? props.event.permitted === undefined
            ? !isBusy
              ? (
                <div class="flex gap-2 justify-center mt-4">
                  <button
                    class="ev-button m-0"
                    onClick={(event) => permitEvent(event)}
                  >
                    承認
                  </button>
                  <button
                    class="ev-button-danger m-0"
                    onClick={(event) => rejectEvent(event)}
                  >
                    却下
                  </button>
                </div>
              )
              : <p class="w-full mt-4 py-2 text-center">処理中</p>
            : (
              <p class="w-full mt-4 py-2 text-center">
                {props.event.permitted ? "承認済み" : "却下済み"}
              </p>
            )
          : null}
      </div>
    </a>
  );
}
