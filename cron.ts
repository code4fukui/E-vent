import { escape } from "https://deno.land/std@0.216.0/html/mod.ts";
import { addNote } from "./activity_pub.ts";

// 起動時にイベント情報を取得
export let eventData: EventData[];

interface EventData {
  title: string;
  opendays: string[];
}

/** イベント情報を取ってきてアップデート */
export async function updateEventData() {
  const tamaEventApi = "https://www.city.tama.lg.jp/event.js";
  const eventJs = await (await fetch(tamaEventApi)).text();
  try {
    const eventDataTmp = eval(`${eventJs};event_data`);
    // 昨日以前のイベントを取り除く
    const today = getYmd(new Date());
    eventData = eventDataTmp.events
      .filter((event: any) =>
        event.opendays.some((day: string) => day >= today)
      )
      .map((event: any) => ({
        title: event.eventtitle,
        opendays: event.opendays.filter((day: string) => day >= today),
      }));
    console.log("イベントDB更新完了");
  } catch (e) {
    console.log(e);
  }
}

/** イベントの情報を定期ツイートする */
export async function teiki() {
  const today = getYmd(new Date());
  const todayEvents = eventData.filter((event) =>
    event.opendays.includes(today)
  );
  const eventsStr = todayEvents.map((event) =>
    `<li>${escape(event.title)}</li>`
  ).join("");
  const message = `本日のイベント<br><br><ul>${eventsStr}</ul>`;
  console.log("投稿: " + message);
  await addNote(message);
}

/** Date型を「2024/02/18」などに変換する */
function getYmd(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}/${month}/${day}`;
}
