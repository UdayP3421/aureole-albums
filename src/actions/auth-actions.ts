"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { generateOtp, generateResetToken, hashOtp, sendOtpEmail } from "@/lib/otp";
import { hashPassword, hashResetToken, verifyToken } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { registerSchema, resetPasswordSchema } from "@/lib/validators";

export type ActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function registerUser(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const limited = rateLimit(`register:${email}`, 4, 10 * 60_000);

  if (!limited.ok) {
    return { status: "error", message: "Too many attempts. Try again in a few minutes." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email,
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });

  if (existing) {
    return { status: "error", message: "An account already exists for this email." };
  }

  const password = await hashPassword(parsed.data.password);
  const code = generateOtp();
  const codeHash = await hashOtp(code);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      provider: "credentials",
      otpCodes: {
        create: {
          codeHash,
          expiresAt: new Date(Date.now() + 10 * 60_000)
        }
      }
    }
  });

  await sendOtpEmail(parsed.data.email, code);
  redirect(`/verify-otp?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function verifyEmailOtp(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const code = String(formData.get("code") ?? "");

  const user = await db.user.findUnique({
    where: { email },
    include: {
      otpCodes: {
        where: {
          purpose: "EMAIL_VERIFY",
          usedAt: null,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  });

  const otp = user?.otpCodes[0];

  if (!user || !otp) {
    return { status: "error", message: "That code is expired or invalid." };
  }

  const valid = await verifyToken(code, otp.codeHash);

  if (!valid) {
    return { status: "error", message: "That code is expired or invalid." };
  }

  await db.$transaction([
    db.otpCode.update({
      where: { id: otp.id },
      data: { usedAt: new Date() }
    }),
    db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    })
  ]);

  return { status: "success", message: "Email verified. You can sign in now." };
}

export async function requestPasswordReset(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const limited = rateLimit(`reset:${email}`, 3, 10 * 60_000);

  if (!limited.ok) {
    return { status: "error", message: "Too many reset attempts. Try again soon." };
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return { status: "success", message: "If that email exists, a reset link has been prepared." };
  }

  const token = generateResetToken();
  const tokenHash = hashResetToken(token);

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 60_000)
    }
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`[Aureole Reset] ${email}: /reset-password?token=${token}`);
  }

  return { status: "success", message: "If that email exists, a reset link has been prepared." };
}

export async function resetPassword(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check your new password." };
  }

  const limited = rateLimit(`reset-token:${parsed.data.token.slice(0, 16)}`, 5, 10 * 60_000);

  if (!limited.ok) {
    return { status: "error", message: "Too many reset attempts. Try again soon." };
  }

  const tokenHash = hashResetToken(parsed.data.token);
  const reset = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (!reset || reset.usedAt || reset.expiresAt <= new Date()) {
    return { status: "error", message: "That reset link is expired or invalid." };
  }

  const password = await hashPassword(parsed.data.password);

  await db.$transaction([
    db.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() }
    }),
    db.user.update({
      where: { id: reset.userId },
      data: {
        password,
        provider: reset.user.provider ?? "credentials"
      }
    })
  ]);

  return { status: "success", message: "Password updated. You can sign in with the new password." };
}
