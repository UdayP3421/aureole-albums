# Aureole Wedding Albums

A premium multi-tenant wedding album SaaS scaffold built with Next.js 15 App Router, Auth.js, Prisma/PostgreSQL, encrypted per-user Cloudinary settings, Framer Motion, GSAP ScrollTrigger, Lenis, and React Three Fiber.

## What Is Included

- Cinematic landing page with generated bitmap hero art, 3D memory cards, scroll-triggered storytelling, gallery, pricing, testimonials, and footer.
- Auth.js setup with Google OAuth, email/password credentials, JWT sessions, protected middleware, OTP verification primitives, forgot password primitives, and profile-ready user schema.
- Prisma schema for users, Cloudinary settings, albums, media, OTP codes, password resets, and Auth.js adapter tables.
- Encrypted tenant Cloudinary credentials, connection testing, signed upload parameters, per-user folder isolation, and media persistence hooks.
- Premium dashboard shell with album management, Cloudinary settings, storage/analytics surfaces, upload dropzone, and share/privacy-ready album records.
- 3D album experience with an opening book, floating memories, particles, dynamic lighting, and demo fallback data.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run db:generate
npm run dev
```

For a database-backed run, set `DATABASE_URL`, `AUTH_SECRET`, and Google OAuth variables, then run:

```bash
npm run db:push
```

The UI still renders without a configured database by using demo read models, but account creation, uploads, and saved albums require PostgreSQL.

## Multi-Tenant Cloudinary Model

Each user stores their own Cloudinary credentials in `CloudinarySettings`. The API secret is encrypted before persistence. Upload signatures are generated server-side after loading and decrypting the authenticated user's settings. Uploaded assets are isolated under:

```text
wedding-albums/{userId}/{albumId}
```

Changing Cloudinary credentials for a user points the same platform instance at that user's own media account.
