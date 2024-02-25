import { type PageProps } from "$fresh/server.ts";
export default function App({ Component, url }: PageProps) {
  return (
    <html>
      <head
        prefix={url.href.includes("/event/")
          ? "og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#"
          : ""}
      >
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>E-vent</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="pb-8">
        <Component />
      </body>
    </html>
  );
}
