# Aureole Albums — Free Deployment Guide

## Services Used (all free)
| Service    | Purpose              | Free Tier           |
|------------|----------------------|---------------------|
| GitHub     | Source control       | Free                |
| Vercel     | Next.js hosting      | Hobby — free forever|
| Neon       | PostgreSQL database  | 0.5 GB — free       |
| Cloudinary | Media CDN + storage  | 25 GB — free        |

---

## Step 1 — Set up Neon database

1. Go to https://neon.tech → Sign up (free)
2. New Project → name: `aureole-albums`
3. Dashboard → Connection Details → select **Prisma** mode
4. Copy the connection string (starts with `postgresql://`)
5. Paste it into your `.env` file as `DATABASE_URL`

---

## Step 2 — Push the database schema

After setting DATABASE_URL in .env:

```bash
npx prisma db push
```

This creates all tables. You should see:
```
✓ Your database is now in sync with your Prisma schema.
```

---

## Step 3 — Get Cloudinary credentials (each user does this)

1. Go to https://cloudinary.com → Sign up free
2. Dashboard → Copy: Cloud Name, API Key, API Secret
3. After you register on the site, go to /onboarding/cloudinary and paste them in

---

## Step 4 — Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm i -g vercel
vercel
```

Follow the prompts, then add env vars:

```bash
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add NEXTAUTH_URL          # set to your vercel URL e.g. https://aureole.vercel.app
vercel env add CLOUDINARY_ENCRYPTION_KEY
vercel env add GOOGLE_CLIENT_ID      # optional
vercel env add GOOGLE_CLIENT_SECRET  # optional
```

Then deploy to production:
```bash
vercel --prod
```

### Option B — Vercel Dashboard (easiest)

1. Go to https://vercel.com → New Project → Import from GitHub
2. Select your `aureole-albums` repo
3. Framework: **Next.js** (auto-detected)
4. Click **Environment Variables** and add:

   | Key                        | Value                                      |
   |----------------------------|--------------------------------------------|
   | DATABASE_URL               | Your Neon connection string                |
   | AUTH_SECRET                | The secret from .env                       |
   | NEXTAUTH_URL               | https://your-app.vercel.app                |
   | CLOUDINARY_ENCRYPTION_KEY  | The key from .env                          |
   | GOOGLE_CLIENT_ID           | (optional) from Google Cloud Console       |
   | GOOGLE_CLIENT_SECRET       | (optional) from Google Cloud Console       |

5. Click **Deploy**

---

## Step 5 — Run database migration on production

After first deploy, run schema push against production DB:

```bash
DATABASE_URL="your-neon-url" npx prisma db push
```

Or just set DATABASE_URL locally and run:
```bash
npx prisma db push
```

---

## Step 6 — Set up Google OAuth (optional)

1. Go to https://console.cloud.google.com
2. New Project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`
5. Copy Client ID and Secret to Vercel env vars

---

## After deploy — First time user flow

1. Visit your Vercel URL
2. Click **Get started** → Register with email
3. Verify OTP (check server logs for code in dev, wire up email for prod)
4. Go to **/onboarding/cloudinary**
5. Enter your Cloudinary Cloud Name, API Key, API Secret → Save and verify
6. Go to **Dashboard → Albums** → Create first album
7. Go to **Dashboard → Media** → Upload wedding photos
8. View the 3D album at **/albums/your-album-slug**
