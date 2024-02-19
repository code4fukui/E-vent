export const kv = await Deno.openKv();

export interface Follower {
  id: string;
}
