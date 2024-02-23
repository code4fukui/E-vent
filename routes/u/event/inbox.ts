import { Handlers } from "$fresh/server.ts";
import { kv } from "../../../kv.ts";
import {
  acceptFollow,
  follow,
  getActivity,
  getInbox,
  getPrivateKey,
} from "../../../activity_pub.ts";
import { entrypoint } from "../../../const.ts";
import { EventItem } from "../../../interface/EventItem.interface.ts";
import { Message } from "../../../kv.ts";

/** マストドンでフォローなどしたときの投稿先inbox */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const y = await req.json();
    const x = await getInbox(y.actor);
    const private_key = await getPrivateKey();
    if (!private_key) {
      return new Response(null, { status: 500 });
    }

    if (req.method == "POST") {
      if (y.type == "Follow") {
        await kv.set(["followers", y.actor], { id: y.actor });
        await acceptFollow(x, y, private_key);
        const z = await getActivity(y.actor);
        await follow(z);
        return new Response();
      } else if (y.type == "Undo") {
        await kv.delete(["followers", y.actor]);
        return new Response();
      } else if (y.type == "Create") {
        console.log("ユーザの投稿");
        const inReplyTo = y.object.inReplyTo;
        if (inReplyTo && inReplyTo.startsWith(entrypoint)) {
          console.log("リプライ");
          const messageId = inReplyTo.split("/").slice(-1)[0];
          const message =
            (await kv.get<Message>(["messages", messageId])).value;
          const replyMessage = y.object.content.replace(/<[^>]*>/g, "").replace(
            /@\w+/g,
            "",
          ).trim();
          const eventItem = await kv.get<EventItem>([
            "eventItems",
            message.event,
          ]).value;
          const reply = {
            user: y.actor,
            body: replyMessage,
          };
          if (message.type == "joinner") {
            console.log("参加");
            if (!("joinners" in eventItem)) {
              eventItem.joinners = [];
            }
            eventItem.joinners.push(reply);
          } else if (message.type == "comment") {
            console.log("コメント");
            if (!("comments" in eventItem)) {
              eventItem.comments = [];
            }
            eventItem.comments.push(reply);
          }
          // kvにセットするところ
          await kv.set(["eventItems", eventItem.hash], eventItem);
          return new Response();
        }
      }
    }
    return new Response(null, { status: 400 });
  },
};
