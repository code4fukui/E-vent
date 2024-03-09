import { TwitterApi } from "npm:twitter-api-v2";

// https://qiita.com/RuruCun/items/28a893cb52627b1591cc

const twitterClient = new TwitterApi({
  appKey: Deno.env.get("TWITTER_APP_KEY")!,
  appSecret: Deno.env.get("TWITTER_APP_SECRET")!,
  accessToken: Deno.env.get("TWITTER_ACCESS_TOKEN")!,
  accessSecret: Deno.env.get("TWITTER_ACCESS_SECRET")!,
});

export async function postToTwitter(message: string) {
  await twitterClient.v2.tweet(message);
}
