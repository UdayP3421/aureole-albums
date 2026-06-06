import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cinematic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf0] via-[#fff7f1] to-[#f5ede8]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(242,211,138,0.28),transparent),radial-gradient(ellipse_40%_40%_at_0%_100%,rgba(185,108,116,0.16),transparent)]" />

      {/* Subtle background photo */}
      <div className="absolute inset-0 opacity-[0.06]">
        <Image
          src="/media/wedding-hero.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* Decorative rings */}
      <div className="pointer-events-none absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-20">
        {[400, 600, 800].map((size) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/40"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      {/* Nav */}
      <Link
        href="/"
        className="absolute left-6 top-6 z-20 flex items-center gap-2 font-display text-2xl font-semibold text-plum transition hover:opacity-80"
      >
        <div className="grid size-8 place-items-center rounded-lg bg-plum shadow-glass">
          <Sparkles className="size-3.5 text-champagne" />
        </div>
        Aureole
      </Link>

      {/* Centered card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      {/* Bottom tagline */}
      <p className="absolute bottom-5 left-0 right-0 z-10 text-center text-xs text-plum/30">
        Cinematic wedding memories — encrypted, isolated, immersive
      </p>
    </main>
  );
}
