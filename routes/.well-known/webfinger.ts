import { Handlers } from "$fresh/server.ts";
import { domain, entrypoint } from "../../const.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    return Response.json({
      "subject": `acct:event@${domain}`,
      "links": [
        {
          "rel":  "self",
          "type": "application/activity+json",
          "href": `${entrypoint}u/event`
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/jrd+json; charset=utf-8"
      }
    });
  },
};
