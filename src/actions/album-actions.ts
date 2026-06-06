"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { configureCloudinary, getUserCloudinaryCredentials } from "@/lib/cloudinary/client";
import { albumFolder } from "@/lib/cloudinary/folders";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { albumIdSchema, albumSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export type AlbumActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createAlbum(_: AlbumActionState, formData: FormData): Promise<AlbumActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", message: "Sign in to create albums." };
  }

  const parsed = albumSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    privacy: formData.get("privacy") || "PRIVATE",
    password: formData.get("password") || undefined
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check album details." };
  }

  const baseSlug = slugify(parsed.data.title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const passwordHash =
    parsed.data.privacy === "PASSWORD" && parsed.data.password
      ? await hashPassword(parsed.data.password)
      : undefined;

  await db.album.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      privacy: parsed.data.privacy,
      passwordHash
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/albums");

  return { status: "success", message: "Album created." };
}

export async function deleteAlbum(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  const parsed = albumIdSchema.safeParse({
    albumId: formData.get("albumId")
  });

  if (!parsed.success) {
    return;
  }

  const album = await db.album.findFirst({
    where: {
      id: parsed.data.albumId,
      userId: session.user.id
    },
    select: {
      id: true
    }
  });

  if (!album) {
    return;
  }

  const credentials = await getUserCloudinaryCredentials(session.user.id);

  if (credentials) {
    const client = configureCloudinary(credentials);
    const prefix = albumFolder(session.user.id, album.id);

    await Promise.allSettled([
      client.api.delete_resources_by_prefix(prefix, { resource_type: "image" }),
      client.api.delete_resources_by_prefix(prefix, { resource_type: "video" })
    ]);
    await client.api.delete_folder(prefix).catch(() => undefined);
  }

  await db.album.delete({
    where: { id: album.id }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/albums");
  revalidatePath("/dashboard/media");
}
