"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { testCloudinaryConnection } from "@/lib/cloudinary/client";
import { encryptSecret } from "@/lib/security/crypto";
import { cloudinarySettingsSchema } from "@/lib/validators";

export type CloudinaryActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateCloudinarySettings(
  _: CloudinaryActionState,
  formData: FormData
): Promise<CloudinaryActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", message: "Sign in to manage Cloudinary." };
  }

  const intent = String(formData.get("intent") ?? "save");

  if (intent === "delete") {
    await db.cloudinarySettings.deleteMany({
      where: { userId: session.user.id }
    });
    revalidatePath("/dashboard/cloudinary");
    revalidatePath("/onboarding/cloudinary");
    return { status: "success", message: "Cloudinary credentials deleted." };
  }

  const parsed = cloudinarySettingsSchema.safeParse({
    cloudName: formData.get("cloudName"),
    apiKey: formData.get("apiKey"),
    apiSecret: formData.get("apiSecret")
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check your Cloudinary credentials."
    };
  }

  try {
    await testCloudinaryConnection({
      cloudName: parsed.data.cloudName,
      apiKey: parsed.data.apiKey,
      apiSecret: parsed.data.apiSecret
    });
  } catch {
    return { status: "error", message: "Cloudinary rejected these credentials." };
  }

  if (intent === "test") {
    return { status: "success", message: "Cloudinary connection verified." };
  }

  await db.cloudinarySettings.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      cloudName: parsed.data.cloudName,
      apiKey: parsed.data.apiKey,
      encryptedApiSecret: encryptSecret(parsed.data.apiSecret),
      connected: true
    },
    update: {
      cloudName: parsed.data.cloudName,
      apiKey: parsed.data.apiKey,
      encryptedApiSecret: encryptSecret(parsed.data.apiSecret),
      connected: true
    }
  });

  revalidatePath("/dashboard/cloudinary");
  revalidatePath("/onboarding/cloudinary");

  return { status: "success", message: "Cloudinary is connected and encrypted." };
}
