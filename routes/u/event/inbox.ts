import { Handlers } from "$fresh/server.ts";
import { kv } from "../../../kv.ts";
import { getPrivateKey, getInbox, acceptFollow } from "../../../activity_pub.ts";

/** マストドンでフォローなどしたときの投稿先inbox */
export const handler: Handlers = {
  async POST(req, _ctx) {
    const y = await req.json()
    const x = await getInbox(y.actor);
    const private_key = await getPrivateKey();
    
    if (req.method == "POST") {
      if (y.type == "Follow") {
        await kv.set(["followers", y.actor], { id: y.actor });
        await acceptFollow(x, y, private_key);
        return new Response();
      } else if (y.type == 'Undo') {
        await kv.delete(["followers", y.actor]);
        return new Response();
      }
    }
    return new Response(null, { status: 400 });
  },
};
