"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { configureCloudinary, getUserCloudinaryCredentials } from "@/lib/cloudinary/client";
import { db } from "@/lib/db";
import { mediaCategorySchema, mediaIdSchema, mediaMoveSchema } from "@/lib/validators";

async function getOwnedMedia(userId: string, mediaId: string) {
  return db.media.findFirst({
    where: {
      id: mediaId,
      album: { userId }
    },
    include: {
      album: {
        select: {
          id: true,
          slug: true
        }
      }
    }
  });
}

function revalidateMediaSurfaces(albumSlug?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/media");
  revalidatePath("/dashboard/albums");

  if (albumSlug) {
    revalidatePath(`/albums/${albumSlug}`);
  }
}

export async function deleteMedia(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const parsed = mediaIdSchema.safeParse({
    mediaId: formData.get("mediaId")
  });

  if (!parsed.success) {
    return;
  }

  const media = await getOwnedMedia(session.user.id, parsed.data.mediaId);

  if (!media) {
    return;
  }

  const credentials = await getUserCloudinaryCredentials(session.user.id);

  if (credentials) {
    const client = configureCloudinary(credentials);
    await client.uploader.destroy(media.cloudinaryPublicId, {
      invalidate: true,
      resource_type: media.mediaType === "VIDEO" ? "video" : "image"
    });
  }

  await db.media.delete({
    where: { id: media.id }
  });

  revalidateMediaSurfaces(media.album.slug);
}

export async function updateMediaCategory(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const parsed = mediaCategorySchema.safeParse({
    mediaId: formData.get("mediaId"),
    category: formData.get("category")
  });

  if (!parsed.success) {
    return;
  }

  const media = await getOwnedMedia(session.user.id, parsed.data.mediaId);

  if (!media) {
    return;
  }

  await db.media.update({
    where: { id: media.id },
    data: { category: parsed.data.category }
  });

  revalidateMediaSurfaces(media.album.slug);
}

export async function moveMedia(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const parsed = mediaMoveSchema.safeParse({
    mediaId: formData.get("mediaId"),
    direction: formData.get("direction")
  });

  if (!parsed.success) {
    return;
  }

  const media = await getOwnedMedia(session.user.id, parsed.data.mediaId);

  if (!media) {
    return;
  }

  const adjacent = await db.media.findFirst({
    where: {
      albumId: media.album.id,
      order: parsed.data.direction === "up" ? { lt: media.order } : { gt: media.order }
    },
    orderBy: {
      order: parsed.data.direction === "up" ? "desc" : "asc"
    }
  });

  if (!adjacent) {
    return;
  }

  await db.$transaction([
    db.media.update({
      where: { id: media.id },
      data: { order: adjacent.order }
    }),
    db.media.update({
      where: { id: adjacent.id },
      data: { order: media.order }
    })
  ]);

  revalidateMediaSurfaces(media.album.slug);
}

export async function setAlbumCover(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const parsed = mediaIdSchema.safeParse({
    mediaId: formData.get("mediaId")
  });

  if (!parsed.success) {
    return;
  }

  const media = await getOwnedMedia(session.user.id, parsed.data.mediaId);

  if (!media) {
    return;
  }

  await db.album.update({
    where: { id: media.album.id },
    data: { coverImage: media.secureUrl ?? media.imageUrl }
  });

  revalidateMediaSurfaces(media.album.slug);
}
