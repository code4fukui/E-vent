import { Handlers } from "$fresh/server.ts";
import { entrypoint } from "../../../const.ts";
import { getPublicKey } from "../../../activity_pub.ts";

/** ユーザの情報 */
export const handler: Handlers = {
  async GET(_req, _ctx) {
    const public_key_pem = await getPublicKey();
    return Response.json({
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        "https://w3id.org/security/v1",
        {
          "discoverable": "http://joinmastodon.org/ns#discoverable",
        },
      ],
      "id": `${entrypoint}u/event`,
      "type": "Person",
      "discoverable": true,
      "inbox": `${entrypoint}u/event/inbox`,
      "outbox": `${entrypoint}u/event/outbox`,
      "followers": `${entrypoint}u/event/followers`,
      "preferredUsername": "event",
      "name": "たまイベント",
      "summary": "イベントの参加者の募集と感想の募集",
      "url": `${entrypoint}u/event`,
      publicKey: {
        id: `${entrypoint}u/event#main-key`,
        type: "Key",
        owner: `${entrypoint}u/event`,
        publicKeyPem: public_key_pem,
      },
      "icon": {
        "type": "Image",
        "mediaType": "image/jpeg",
        "url": "https://e-vent.deno.dev/icon.jpg",
      },
    }, {
      headers: {
        "Content-Type": "application/activity+json; charset=utf-8",
      },
    });
  },
};
