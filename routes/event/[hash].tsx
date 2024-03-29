import { Handlers, PageProps } from "$fresh/server.ts";
import { Fragment } from "preact";
import { EventItem } from "../../interface/EventItem.interface.ts";
import Header from "../../components/Header.tsx";
import { kv } from "../../kv.ts";
import { Head } from "$fresh/runtime.ts";
import CopyToClipboard from "../../islands/CopyToClipboard.tsx";

export const handler: Handlers<EventItem> = {
  async GET(_req, ctx) {
    const hash = ctx.params.hash;
    const eventItem = await kv.get(["eventItems", hash]);
    return ctx.render(eventItem.value);
  },
};

export default function Event(event: PageProps<EventItem>) {
  const item = event.data;
  return (
    <Fragment>
      <Head>
        <title>{item.title} - E-vent</title>
        <meta property="og:url" content={event.url.href} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={item.title + " - E-vent"} />
        <meta property="og:description" content={item.description} />
        <meta property="og:site_name" content="E-vent" />
        <meta property="og:image" content={item.thumbnailUrl} />
      </Head>
      <Header />
      <main class="ev-main">
        <section>
          <h2 class="ev-title flex">
            {item.title}
            <CopyToClipboard
              body={item.hash}
              tooltipText="イベントIDをコピー"
            />
          </h2>
          <img
            class="w-full h-fit object-cover object-center bg-gray-300"
            src={item.thumbnailUrl}
            alt={item.title}
          />
          <p class="mt-4">{item.description}</p>
        </section>

        {item.prevEventId !== undefined
          ? (
            <a
              class="mt-4 underline text-blue-700 hover:font-bold"
              href={`/event/${item.prevEventId}#comments`}
            >
              前回イベントの感想を見てみる
            </a>
          )
          : ""}

        <section class="mt-4">
          <h3 id="joinners" class="text-xl font-bold">参加者一覧</h3>
          {item.joinners !== undefined
            ? (
              <ul class="mt-2">
                {item.joinners.map((joinner) => {
                  return (
                    <li>
                      {joinner.user.replace(
                        /http.*\//,
                        "",
                      )} さん<br />「{joinner.body}」
                    </li>
                  );
                })}
              </ul>
            )
            : <p>まだ参加者がいません</p>}
        </section>

        <section class="mt-4">
          <h3 id="comments" class="text-xl font-bold">コメント</h3>
          {item.comments !== undefined
            ? (
              <ul class="mt-2">
                {item.comments.map((comment) => {
                  // console.log(comment);
                  return (
                    <li>
                      <a href={comment.url}>
                        {comment.user.replace(
                          /http.*\//,
                          "",
                        )} さん<br />「{comment.body}」
                      </a>
                      {comment.images.map((image) => (
                        <a href={image}>
                          {image.endsWith(".mp4")
                            ? (
                              <video controls width="256">
                                <source src={image} type="video/mp4" />
                              </video>
                            )
                            : <img src={image} width="256" />}
                        </a>
                      ))}
                    </li>
                  );
                })}
              </ul>
            )
            : <p>まだコメントがありません</p>}
        </section>
      </main>
    </Fragment>
  );
}
