import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters.")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const cloudinarySettingsSchema = z.object({
  cloudName: z.string().min(2, "Cloud name is required."),
  apiKey: z.string().min(4, "API key is required."),
  apiSecret: z.string().min(8, "API secret is required.")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32, "Reset token is missing."),
  password: z.string().min(8, "Use at least 8 characters.")
});

export const profileSchema = z.object({
  name: z.string().min(2, "Enter your name.").max(80, "Name is too long."),
  image: z.union([z.string().url("Enter a valid image URL."), z.literal("")]).optional()
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm the new password.")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export const albumSchema = z
  .object({
    title: z.string().min(2, "Album title is required."),
    description: z.string().max(320).optional(),
    privacy: z.enum(["PRIVATE", "UNLISTED", "PASSWORD", "PUBLIC"]).default("PRIVATE"),
    password: z.string().optional()
  })
  .refine((data) => data.privacy !== "PASSWORD" || Boolean(data.password?.trim()), {
    message: "Password albums need a password.",
    path: ["password"]
  });

export const albumIdSchema = z.object({
  albumId: z.string().min(1, "Album is required.")
});

export const mediaIdSchema = z.object({
  mediaId: z.string().min(1, "Media item is required.")
});

export const mediaCategorySchema = mediaIdSchema.extend({
  category: z.string().min(2, "Category is required.").max(40, "Category is too long.")
});

export const mediaMoveSchema = mediaIdSchema.extend({
  direction: z.enum(["up", "down"])
});

export const uploadCompleteSchema = z.object({
  albumId: z.string().min(1),
  publicId: z.string().min(1),
  secureUrl: z.string().url(),
  resourceType: z.enum(["image", "video", "raw"]).default("image"),
  width: z.number().optional(),
  height: z.number().optional(),
  bytes: z.number().optional(),
  duration: z.number().optional(),
  category: z.string().default("Wedding")
});
