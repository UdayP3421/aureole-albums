import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { albumFolder } from "@/lib/cloudinary/folders";
import { db } from "@/lib/db";
import { uploadCompleteSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = uploadCompleteSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const album = await db.album.findFirst({
    where: {
      id: parsed.data.albumId,
      userId: session.user.id
    }
  });

  if (!album) {
    return NextResponse.json({ error: "Album not found" }, { status: 404 });
  }

  const expectedFolder = albumFolder(session.user.id, album.id);

  if (!parsed.data.publicId.startsWith(`${expectedFolder}/`)) {
    return NextResponse.json({ error: "Media folder does not match this tenant album" }, { status: 403 });
  }

  const count = await db.media.count({
    where: { albumId: parsed.data.albumId }
  });

  const media = await db.media.create({
    data: {
      albumId: parsed.data.albumId,
      cloudinaryPublicId: parsed.data.publicId,
      imageUrl: parsed.data.secureUrl,
      secureUrl: parsed.data.secureUrl,
      mediaType: parsed.data.resourceType === "video" ? "VIDEO" : "IMAGE",
      category: parsed.data.category,
      width: parsed.data.width,
      height: parsed.data.height,
      bytes: parsed.data.bytes,
      duration: parsed.data.duration,
      order: count
    }
  });

  return NextResponse.json({ media });
}
