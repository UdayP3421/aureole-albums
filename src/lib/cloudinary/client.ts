import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { decryptSecret } from "@/lib/security/crypto";

export type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export async function getUserCloudinaryCredentials(userId: string) {
  const settings = await db.cloudinarySettings.findUnique({
    where: { userId }
  });

  if (!settings) {
    return null;
  }

  return {
    cloudName: settings.cloudName,
    apiKey: settings.apiKey,
    apiSecret: decryptSecret(settings.encryptedApiSecret),
    connected: settings.connected
  };
}

export function configureCloudinary(credentials: CloudinaryCredentials) {
  cloudinary.config({
    cloud_name: credentials.cloudName,
    api_key: credentials.apiKey,
    api_secret: credentials.apiSecret,
    secure: true
  });

  return cloudinary;
}

export async function testCloudinaryConnection(credentials: CloudinaryCredentials) {
  const client = configureCloudinary(credentials);
  await client.api.ping();
  return true;
}

export function signedUploadParams(
  credentials: CloudinaryCredentials,
  params: Record<string, string | number | boolean>
) {
  const signature = cloudinary.utils.api_sign_request(params, credentials.apiSecret);

  return {
    ...params,
    signature,
    apiKey: credentials.apiKey,
    cloudName: credentials.cloudName
  };
}
