// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_well_known_webfinger from "./routes/.well-known/webfinger.ts";
import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_application from "./routes/api/application.ts";
import * as $api_permit from "./routes/api/permit.ts";
import * as $api_users_id_ from "./routes/api/users/[id].ts";
import * as $application from "./routes/application.tsx";
import * as $create_sample from "./routes/create_sample.ts";
import * as $event_hash_ from "./routes/event/[hash].tsx";
import * as $index from "./routes/index.tsx";
import * as $permit from "./routes/permit.tsx";
import * as $reset from "./routes/reset.ts";
import * as $u_event_followers from "./routes/u/event/followers.ts";
import * as $u_event_inbox from "./routes/u/event/inbox.ts";
import * as $u_event_index from "./routes/u/event/index.ts";
import * as $u_event_outbox from "./routes/u/event/outbox.ts";
import * as $ApplicationForm from "./islands/ApplicationForm.tsx";
import * as $CopyToClipboard from "./islands/CopyToClipboard.tsx";
import * as $EventCard from "./islands/EventCard.tsx";
import * as $ImageInputPreview from "./islands/ImageInputPreview.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/.well-known/webfinger.ts": $_well_known_webfinger,
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/api/application.ts": $api_application,
    "./routes/api/permit.ts": $api_permit,
    "./routes/api/users/[id].ts": $api_users_id_,
    "./routes/application.tsx": $application,
    "./routes/create_sample.ts": $create_sample,
    "./routes/event/[hash].tsx": $event_hash_,
    "./routes/index.tsx": $index,
    "./routes/permit.tsx": $permit,
    "./routes/reset.ts": $reset,
    "./routes/u/event/followers.ts": $u_event_followers,
    "./routes/u/event/inbox.ts": $u_event_inbox,
    "./routes/u/event/index.ts": $u_event_index,
    "./routes/u/event/outbox.ts": $u_event_outbox,
  },
  islands: {
    "./islands/ApplicationForm.tsx": $ApplicationForm,
    "./islands/CopyToClipboard.tsx": $CopyToClipboard,
    "./islands/EventCard.tsx": $EventCard,
    "./islands/ImageInputPreview.tsx": $ImageInputPreview,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
