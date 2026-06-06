import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Cloud,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { auth } from "@/auth";
import { AlbumCard } from "@/components/dashboard/album-card";
import { StatCards } from "@/components/dashboard/stat-cards";
import { UploadDropzone } from "@/components/dashboard/upload-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardSnapshot } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

const greetings = ["Good morning", "Good afternoon", "Good evening", "Welcome back"];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return greetings[0];
  if (hour < 17) return greetings[1];
  if (hour < 21) return greetings[2];
  return greetings[3];
}

export default async function DashboardPage() {
  const session = await auth();
  const snapshot = await getDashboardSnapshot(session?.user?.id);
  const greeting = getGreeting();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Studio";

  return (
    <div className="space-y-7">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-plum via-[#4b213c] to-[#341a2d] p-7 text-ivory shadow-luxury">
        {/* Decorative sparkle */}
        <div className="pointer-events-none absolute right-6 top-6 opacity-20">
          <Sparkles className="size-20 text-champagne" />
        </div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-champagne/70">{greeting}</p>
            <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
              {firstName}.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ivory/60">
              Your albums, Cloudinary vault, signed uploads, and share controls all live from this
              workspace. Every wedding story begins here.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button
              asChild
              className="bg-champagne text-plum hover:bg-champagne/90 shadow-glass"
            >
              <Link href="/dashboard/albums">
                <BookOpen className="size-4" />
                New album
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/18 bg-white/8 text-ivory hover:bg-white/14"
            >
              <Link href="/dashboard/cloudinary">
                <Cloud className="size-4" />
                Cloudinary
              </Link>
            </Button>
          </div>
        </div>

        {/* Status badges */}
        <div className="relative mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
          {[
            "AES-256 encrypted secrets",
            "JWT session middleware",
            "Signed upload pipeline"
          ].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/6 px-3 py-1.5 text-xs text-ivory/62"
            >
              <BadgeCheck className="size-3 text-champagne" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <StatCards stats={snapshot.stats} />

      {/* Recent albums + upload */}
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Albums */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-plum">Recent albums</h2>
            <Button asChild variant="ghost" size="sm" className="text-plum/56 hover:text-plum">
              <Link href="/dashboard/albums">
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          {snapshot.albums.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {snapshot.albums.slice(0, 2).map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-plum/12 bg-white/50 p-10 text-center">
              <BookOpen className="mx-auto size-10 text-plum/24" />
              <p className="mt-4 font-medium text-plum/56">No albums yet</p>
              <p className="mt-1.5 text-sm text-plum/36">
                Create your first wedding album to get started.
              </p>
              <Button asChild size="sm" className="mt-5 bg-plum text-ivory">
                <Link href="/dashboard/albums">Create album</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Upload */}
        <UploadDropzone
          albums={snapshot.albums.map((a) => ({ id: a.id, title: a.title }))}
        />
      </div>

      {/* Security posture card */}
      <div className="rounded-xl border border-white/72 bg-white/78 p-6 shadow-glass">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-sage/12">
            <ShieldCheck className="size-4 text-sage" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-plum">Security posture</h3>
            <p className="text-xs text-plum/44">
              Credential isolation, signed uploads, and protected routes are active.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Encrypted secrets",
              desc: "Cloudinary API secrets are encrypted with AES-256-GCM before storage.",
              badge: "Active"
            },
            {
              title: "Signed uploads",
              desc: "Upload signatures are generated server-side. API keys never touch the client.",
              badge: "Active"
            },
            {
              title: "Tenant isolation",
              desc: "Albums, media, and settings are scoped to your user ID in every query.",
              badge: "Active"
            }
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-plum/8 bg-[#fffaf0]/60 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-plum">{item.title}</p>
                <Badge variant="success" className="text-xs">{item.badge}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-plum/52">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
