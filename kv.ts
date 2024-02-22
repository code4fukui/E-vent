export const kv = await Deno.openKv();

export interface Follower {
  id: string;
}

export interface Message {
  id: string;
  body: string;
  type: "joinner" | "comment";
}
