import { EventItem } from "../interface/EventItem.interface.ts";

export default function EventCard(
  props: { event: EventItem; isPermitter?: boolean },
) {
  let isBusy = false;
  let pastEvent = (() => {
    const eventHeld = new Date(props.event.date);
    const now = new Date();
    return eventHeld.getTime() < now.getTime();
  })();

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
    return `${date.getFullYear()}/${
      (date.getMonth() + 1).toString().padStart(2, "0")
    }/${date.getDate().toString().padStart(2, "0")} ${
      date.getHours().toString().padStart(2, "0")
    }:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <a
      class={"w-full border-solid border-2 rounded-2xl overflow-hidden border-gray-500 transition-colors " +
        "hover:border-orange-500 hover:shadow-gray-500 hover:shadow-md focus:border-orange-500 focus:shadow-gray-500 focus:shadow-md" +
        (pastEvent ? " bg-gray-300" : "")}
      href={`/event/${props.event.hash}`}
    >
      <div
        class={"w-full h-40 bg-cover bg-center bg-no-repeat grid place-content-center" +
          (pastEvent ? " bg-blend-overlay bg-gray-500" : "")}
        style={"background-image: url(" + props.event.thumbnailUrl + ")"}
      >
        {pastEvent
          ? <span class="text-2xl font-bold text-white">終了</span>
          : ""}
      </div>
      <div class="px-4 pb-4">
        <h3 class="text-2xl font-bold my-2">{props.event.title}</h3>
        <p class="w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-700">
          {props.event.description}
        </p>
        <section class="flex gap-2 mt-2 text-xs text-gray-500">
          <p class="w-full">
            ⌚ {genDateString(props.event.date)}
          </p>
          <p class="w-full">
            📍 {props.event.placement}
          </p>
        </section>
        {props.isPermitter && !pastEvent
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
