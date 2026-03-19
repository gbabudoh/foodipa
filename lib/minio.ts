import { Client } from "minio";

const globalForMinio = globalThis as unknown as { minio: Client; minioBucketReady: boolean };

export const minio =
  globalForMinio.minio ??
  new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT ?? "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  });

if (process.env.NODE_ENV !== "production") globalForMinio.minio = minio;

export const BUCKET = process.env.MINIO_BUCKET ?? "foodipa";

/** Ensure the bucket exists — cached per process so it only hits MinIO once */
export async function ensureBucket() {
  if (globalForMinio.minioBucketReady) return;

  const exists = await minio.bucketExists(BUCKET);
  if (!exists) {
    await minio.makeBucket(BUCKET, "us-east-1");
    const policy = JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET}/*`],
        },
      ],
    });
    await minio.setBucketPolicy(BUCKET, policy);
  }

  globalForMinio.minioBucketReady = true;
}

/**
 * Upload a base64 data URL to MinIO.
 * Returns a proxy URL (/api/avatar/...) so browsers in HTTPS-only mode can load it.
 */
export async function uploadDataUrl(
  dataUrl: string,
  folder: string,
  filename: string
): Promise<string> {
  await ensureBucket();

  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");

  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const objectName = `${folder}/${filename}`;

  await minio.putObject(BUCKET, objectName, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  return `/api/avatar/${objectName}`;
}

/**
 * Upload a Buffer directly to MinIO.
 * Returns a proxy URL (/api/avatar/...) so browsers in HTTPS-only mode can load it.
 */
export async function uploadBuffer(
  buffer: Buffer,
  contentType: string,
  folder: string,
  filename: string
): Promise<string> {
  await ensureBucket();

  const objectName = `${folder}/${filename}`;
  await minio.putObject(BUCKET, objectName, buffer, buffer.length, {
    "Content-Type": contentType,
  });

  return `/api/avatar/${objectName}`;
}
