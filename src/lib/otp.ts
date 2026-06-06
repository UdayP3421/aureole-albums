import crypto from "node:crypto";
import { hashToken } from "@/lib/password";

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function hashOtp(code: string) {
  return hashToken(code);
}

export async function sendOtpEmail(email: string, code: string) {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[Aureole OTP] ${email}: ${code}`);
  }

  return true;
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
