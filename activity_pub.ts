import { kv } from "./kv.ts";
import { entrypoint } from "./const.ts";

export function stob(s: string) {
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

export function btos(b: ArrayBuffer) {
  return String.fromCharCode(...new Uint8Array(b));
}

export async function importprivateKey(pem: string) {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  if (pem.startsWith('"')) pem = pem.slice(1);
  if (pem.endsWith('"')) pem = pem.slice(0, -1);
  pem = pem.split("\\n").join("");
  pem = pem.split("\n").join("");
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length,
  );
  const der = stob(atob(pemContents));
  const r = await crypto.subtle.importKey(
    "pkcs8",
    der,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"],
  );
  return r;
}

export async function privateKeyToPublicKey(key: CryptoKey) {
  const jwk = await crypto.subtle.exportKey("jwk", key);
  if ("kty" in jwk) {
    delete jwk.d;
    delete jwk.p;
    delete jwk.q;
    delete jwk.dp;
    delete jwk.dq;
    delete jwk.qi;
    delete jwk.oth;
    jwk.key_ops = ["verify"];
  }
  const r = await crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["verify"],
  );
  return r;
}

export async function exportPublicKey(key: CryptoKey) {
  const der = await crypto.subtle.exportKey("spki", key);
  if ("byteLength" in der) {
    let pemContents = btoa(btos(der));

    let pem = "-----BEGIN PUBLIC KEY-----\n";
    while (pemContents.length > 0) {
      pem += pemContents.substring(0, 64) + "\n";
      pemContents = pemContents.substring(64);
    }
    pem += "-----END PUBLIC KEY-----\n";
    return pem;
  }
}

export async function getInbox(req: string) {
  const res = await fetch(req, {
    method: "GET",
    headers: { Accept: "application/activity+json" },
  });
  return res.json();
}

export async function postInbox(
  req: string,
  data: any,
  headers: { [key: string]: string },
) {
  const res = await fetch(req, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });
  return res;
}

export async function signHeaders(
  res: any,
  strInbox: string,
  privateKey: CryptoKey,
) {
  const strTime = new Date().toUTCString();
  const s = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(JSON.stringify(res)),
  );
  const s256 = btoa(btos(s));
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    stob(
      `(request-target): post ${new URL(strInbox).pathname}\n` +
        `host: ${new URL(strInbox).hostname}\n` +
        `date: ${strTime}\n` +
        `digest: SHA-256=${s256}`,
    ),
  );
  const b64 = btoa(btos(sig));
  const headers = {
    Host: new URL(strInbox).hostname,
    Date: strTime,
    Digest: `SHA-256=${s256}`,
    Signature: `keyId="${entrypoint}u/event",` +
      `algorithm="rsa-sha256",` +
      `headers="(request-target) host date digest",` +
      `signature="${b64}"`,
    Accept: "application/activity+json",
    "Content-Type": "application/activity+json",
    "Accept-Encoding": "gzip",
    "User-Agent": `Minidon/0.0.0 (+${entrypoint})`,
  };
  return headers;
}

export async function acceptFollow(x: any, y: any, privateKey: CryptoKey) {
  const strId = crypto.randomUUID();
  const strInbox = x.inbox;
  const res = {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${entrypoint}u/event/s/${strId}`,
    type: "Accept",
    actor: `${entrypoint}u/event`,
    object: y,
  };
  const headers = await signHeaders(res, strInbox, privateKey);
  await postInbox(strInbox, res, headers);
}

export async function createNote(
  strId: string,
  x: any,
  y: string,
  privateKey: CryptoKey,
) {
  const strTime = new Date().toISOString().substring(0, 19) + "Z";
  const strInbox = x.inbox;
  const res = {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${entrypoint}u/event/s/${strId}/activity`,
    type: "Create",
    actor: `${entrypoint}u/event`,
    published: strTime,
    to: ["https://www.w3.org/ns/activitystreams#Public"],
    cc: [`${entrypoint}u/event/followers`],
    object: {
      id: `${entrypoint}u/event/s/${strId}`,
      type: "Note",
      attributedTo: `${entrypoint}u/event`,
      content: y,
      url: `${entrypoint}u/event/s/${strId}`,
      published: strTime,
      to: ["https://www.w3.org/ns/activitystreams#Public"],
      cc: [`${entrypoint}u/event/followers`],
    },
  };
  const headers = await signHeaders(res, strInbox, privateKey);
  await postInbox(strInbox, res, headers);
}

/** 秘密鍵 */
export async function getPrivateKey() {
  const ID_RSA = Deno.env.get("ID_RSA")!;
  return await importprivateKey(ID_RSA);
}

/** 公開鍵 */
export async function getPublicKey() {
  const ID_RSA = Deno.env.get("ID_RSA")!;
  const PRIVATE_KEY = await importprivateKey(ID_RSA);
  const PUBLIC_KEY = await privateKeyToPublicKey(PRIVATE_KEY);
  return await exportPublicKey(PUBLIC_KEY);
}

/** ツイートする */
export async function addNote(messageBody: string) {
  const messageId = crypto.randomUUID();
  const PRIVATE_KEY = await getPrivateKey();

  await kv.set(["messages", messageId], {
    id: messageId,
    body: messageBody,
  });

  for await (const follower of kv.list({ prefix: ["followers"] })) {
    const x = await getInbox(follower.value.id);
    await createNote(messageId, x, messageBody, PRIVATE_KEY);
  }
  return messageId;
}

export async function follow(x: { [key: string]: any }) {
  const strId = crypto.randomUUID();
  const body = {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${entrypoint}/u/event/s/${strId}`,
    type: "Follow",
    actor: `${entrypoint}u/event`,
    object: x.id,
  };
  await postActivity(x.inbox, body);
}

export async function getActivity(req: string) {
  const PRIVATE_KEY = await getPrivateKey();
  if (!PRIVATE_KEY) {
    return;
  }
  const strTime = new Date().toUTCString();
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    PRIVATE_KEY,
    stob(
      [
        `(request-target): get ${new URL(req).pathname}`,
        `host: ${new URL(req).hostname}`,
        `date: ${strTime}`,
      ].join("\n"),
    ),
  );
  const b64 = btoa(btos(sig));
  const headers = {
    Host: new URL(req).hostname,
    Date: strTime,
    Signature: [
      `keyId="${entrypoint}u/event#Key"`,
      'algorithm="rsa-sha256"',
      'headers="(request-target) host date"',
      `signature="${b64}"`,
    ].join(),
    Accept: "application/activity+json",
    "Accept-Encoding": "identity",
    "Cache-Control": "no-cache",
    "User-Agent": `Matchbox/0.8.0 (+https://${entrypoint}/)`,
  };
  const res = await fetch(req, { method: "GET", headers });
  const body = await res.json();
  console.log("getActivity body = ", body);
  console.log(`GET ${req} ${res.status}`);
  return body;
}

export async function postActivity(req: string, x: { [key: string]: any }) {
  const PRIVATE_KEY = await getPrivateKey();
  if (!PRIVATE_KEY) {
    return;
  }
  const strTime = new Date().toUTCString();
  const body = JSON.stringify(x);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(body),
  );
  const s256 = btoa(btos(digest));
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    PRIVATE_KEY,
    stob(
      [
        `(request-target): post ${new URL(req).pathname}`,
        `host: ${new URL(req).hostname}`,
        `date: ${strTime}`,
        `digest: SHA-256=${s256}`,
      ].join("\n"),
    ),
  );
  const b64 = btoa(btos(sig));
  const headers = {
    Host: new URL(req).hostname,
    Date: strTime,
    Digest: `SHA-256=${s256}`,
    Signature: [
      `keyId="${entrypoint}u/event#Key"`,
      'algorithm="rsa-sha256"',
      'headers="(request-target) host date digest"',
      `signature="${b64}"`,
    ].join(),
    Accept: "application/json",
    "Accept-Encoding": "gzip",
    "Cache-Control": "max-age=0",
    "Content-Type": "application/activity+json",
    "User-Agent": `Matchbox/0.8.0 (+${entrypoint})`,
  };
  console.log(`POST ${req} ${body}`);
  await fetch(req, { method: "POST", body, headers });
}
