import { NextRequest } from "next/server";
import { minio, BUCKET } from "@/lib/minio";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const objectName = slug.join("/");

  try {
    const [stream, stat] = await Promise.all([
      minio.getObject(BUCKET, objectName),
      minio.statObject(BUCKET, objectName),
    ]);

    const contentType = stat.metaData?.["content-type"] ?? "image/jpeg";
    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
