import { Handlers } from "$fresh/server.ts";
import { EventItem } from "../../interface/EventItem.interface.ts";
import { kv } from "../../kv.ts";
import { uploadToCloudinary } from "../../utils/cloudinary.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const hash = crypto.randomUUID();

    const title = form.get("title")?.toString();
    const description = form.get("description")?.toString() ?? "";
    const date = new Date(Date.parse(form.get("date") as string));
    const joinDeadline = new Date(
      Date.parse(form.get("joinDeadline") as string),
    );
    const placement = form.get("placement")?.toString();
    const prevEventId = form.get("prevEventId")?.toString();

    if (!title || !date || !placement) {
      return Response.json(JSON.stringify({ success: false }));
    }

    console.log(
      typeof form.get("thumbnail"),
      form.get("thumbnail"),
    );
    const thumbnail = new Uint8Array(
      await (form.get("thumbnail") as Blob).arrayBuffer(),
    );
    const thumbnailUrl = await uploadToCloudinary(thumbnail);
    console.log(thumbnailUrl);

    const eventItem: EventItem = {
      hash,
      title,
      description,
      date,
      placement,
      thumbnailUrl,
      prevEventId,
      joinDeadline,
    };
    console.log(eventItem);
    await kv.set(["eventItems", eventItem.hash], eventItem);
    return Response.json({ success: true });
  },
};
