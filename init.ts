import { teiki, updateEventData } from "./cron.ts";

export async function init() {
  await updateEventData();
  Deno.cron("data update", "0 0 * * *", updateEventData);
  Deno.cron("teiki housou", "0 * * * *", teiki);
}
