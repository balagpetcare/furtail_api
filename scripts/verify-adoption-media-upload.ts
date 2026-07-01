import fs from "fs";
import path from "path";

declare const fetch: any;
declare const FormData: any;
declare const Blob: any;

function requiredEnv(name: string): string {
  const value = String(process.env[name] || "").trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  const value = String(process.env[name] || "").trim();
  return value || undefined;
}

function mimeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}

async function uploadOne(params: {
  apiBaseUrl: string;
  token: string;
  filePath: string;
  listingId?: string;
  draftId?: string;
}) {
  const bytes = fs.readFileSync(params.filePath);
  const body = new FormData();
  body.append(
    "file",
    new Blob([bytes], { type: mimeFromPath(params.filePath) }),
    path.basename(params.filePath),
  );
  if (params.listingId) body.append("listingId", params.listingId);
  if (params.draftId) body.append("draftId", params.draftId);

  const res = await fetch(
    `${params.apiBaseUrl.replace(/\/$/, "")}/api/v1/media/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: "application/json",
      },
      body,
    },
  );

  const raw = await res.text();
  let json: unknown = raw;
  try {
    json = JSON.parse(raw);
  } catch (_) {}

  return {
    ok: res.ok,
    status: res.status,
    file: params.filePath,
    response: json,
  };
}

async function main() {
  const apiBaseUrl = optionalEnv("API_BASE_URL") || "http://localhost:7200";
  const token = requiredEnv("AUTH_TOKEN");
  const photoPath = requiredEnv("PHOTO_PATH");
  const videoPath = requiredEnv("VIDEO_PATH");
  const listingId = optionalEnv("LISTING_ID");

  const results = [];
  results.push(
    await uploadOne({
      apiBaseUrl,
      token,
      filePath: photoPath,
      listingId,
      draftId: `verify-photo-${Date.now()}`,
    }),
  );
  results.push(
    await uploadOne({
      apiBaseUrl,
      token,
      filePath: videoPath,
      listingId,
      draftId: `verify-video-${Date.now()}`,
    }),
  );

  console.log(
    JSON.stringify({ success: results.every((r) => r.ok), results }, null, 2),
  );
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        success: false,
        message: error?.message || String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
