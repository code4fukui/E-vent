import { Handlers } from "$fresh/server.ts";
import { entrypoint } from "../../../const.ts";
import { getPublicKey } from "../../../activity_pub.ts";

/** ユーザの情報 */
export const handler: Handlers = {
  async GET(_req, _ctx) {
    const public_key_pem = await getPublicKey();
    return Response.json({
      '@context': ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
      "id": `${entrypoint}u/event`,
      "type": "Person",
      "inbox": `${entrypoint}u/event/inbox`,
      "followers": `${entrypoint}u/event/followers`,
      "preferredUsername": "たまイベント",
      "name": "たまイベント",
      "url": `${entrypoint}u/event`,
      publicKey: {
        id: `${entrypoint}u/event`,
        type: 'Key',
        owner: `${entrypoint}u/event`,
        publicKeyPem: public_key_pem,
      },
      "icon": {
        "type": "Image",
        "mediaType": "image/jpeg",
        "url": "https://res.cloudinary.com/dp8x1rtwn/image/upload/v1708208658/deno/tama_of1lfh.jpg"
      }
    }, {
      headers: {
        "Content-Type": "application/activity+json; charset=utf-8"
      }
    });
  },
};