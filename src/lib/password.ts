import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function verifyToken(token: string, hash: string) {
  return bcrypt.compare(token, hash);
}

export function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function verifyResetToken(token: string, hash: string) {
  const tokenHash = hashResetToken(token);

  try {
    return crypto.timingSafeEqual(Buffer.from(tokenHash), Buffer.from(hash));
  } catch {
    return false;
  }
}
