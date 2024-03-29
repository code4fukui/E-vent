import { encode } from "https://deno.land/std@0.97.0/encoding/base64.ts";
import { Sha1 } from "https://deno.land/std@0.119.0/hash/sha1.ts";

// no-npm
// https://cloudinary.com/documentation/image_upload_api_reference
export async function uploadToCloudinary(body: Uint8Array) {
  const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
  const apiKey = Deno.env.get("CLOUDINARY_API_KEY")!;
  const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET")!;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  console.log(`upload to ${url}`);
  const timestamp = String(Math.trunc(new Date().getTime() / 1000));
  const signature = new Sha1().update(`timestamp=${timestamp}${apiSecret}`)
    .toString();

  const formData = new FormData();
  formData.append("file", "data:image/png;base64," + encode(body));
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const result = await fetch(url, {
    method: "POST",
    body: formData,
  });
  console.log(JSON.stringify(result));
  const json = await result.json();
  return json.secure_url;
}
