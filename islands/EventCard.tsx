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
  const deleteEvent = async ($event: Event) => {
    $event.preventDefault();
    $event.stopPropagation();
    const res = await (await fetch(`/api/event?id=${props.event.hash}`, {
      method: "DELETE",
    })).json();
    if (res.success) {
      alert(`イベント「${props.event.title}」を削除しました`);
      globalThis.location.reload();
    } else {
      alert(`イベント「${props.event.title}」を削除できませんでした`);
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
        <div class="flex justify-between items-center">
          <h3 class="text-2xl font-bold my-2">{props.event.title}</h3>
          {props.isPermitter
            ? (
              <button
                class="w-8 h-8 grid place-content-center fill-gray-500 hover:fill-red-500 tooltip"
                data-tooltip="イベントを削除"
                onClick={deleteEvent}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z">
                  </path>
                  <path d="M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z">
                  </path>
                </svg>
              </button>
            )
            : ""}
        </div>
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
