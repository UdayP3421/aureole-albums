import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { albumFolder } from "@/lib/cloudinary/folders";
import { getUserCloudinaryCredentials, signedUploadParams } from "@/lib/cloudinary/client";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(`cloudinary-sign:${session.user.id}`, 120, 60_000);

  if (!limited.ok) {
    return NextResponse.json({ error: "Too many upload signatures requested" }, { status: 429 });
  }

  const { albumId, resourceType = "auto" } = await request.json();

  if (!albumId) {
    return NextResponse.json({ error: "albumId is required" }, { status: 400 });
  }

  const album = await db.album.findFirst({
    where: {
      id: albumId,
      userId: session.user.id
    }
  });

  if (!album) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }

  const credentials = await getUserCloudinaryCredentials(session.user.id);

  if (!credentials) {
    return NextResponse.json({ error: "Cloudinary is not connected" }, { status: 409 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = albumFolder(session.user.id, album.id);
  const signed = signedUploadParams(credentials, {
    timestamp,
    folder,
    overwrite: false,
    use_filename: true,
    unique_filename: true
  });

  return NextResponse.json({ ...signed, resourceType });
}
