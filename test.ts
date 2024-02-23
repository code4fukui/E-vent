const kv = await Deno.openKv();
await kv.set(["users", 1]);
console.log(await kv.get(["users", 1]));
