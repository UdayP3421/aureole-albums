"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { changePasswordSchema, profileSchema } from "@/lib/validators";

export type UserActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateProfile(_: UserActionState, formData: FormData): Promise<UserActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", message: "Sign in to update your profile." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    image: formData.get("image") ?? ""
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your profile details." };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      image: parsed.data.image || null
    }
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");

  return { status: "success", message: "Profile updated." };
}

export async function updatePassword(_: UserActionState, formData: FormData): Promise<UserActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", message: "Sign in to update your password." };
  }

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword") || undefined,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your password details." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { password: true }
  });

  if (!user) {
    return { status: "error", message: "Account not found." };
  }

  if (user.password) {
    const valid = await verifyPassword(parsed.data.currentPassword ?? "", user.password);

    if (!valid) {
      return { status: "error", message: "Current password is incorrect." };
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      password: await hashPassword(parsed.data.password),
      provider: "credentials"
    }
  });

  return { status: "success", message: "Password updated." };
}
