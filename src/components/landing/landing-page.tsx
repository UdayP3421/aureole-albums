"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  Cloud,
  Film,
  Gem,
  Heart,
  LockKeyhole,
  Play,
  Sparkles,
  Star,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timelineStages } from "@/lib/demo-data";

/* ── Lazy 3D canvas ── */
const MemoryConstellation = dynamic(
  () => import("@/components/three/memory-constellation"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-2xl bg-plum/10" />
    )
  }
);

/* ── Data ── */
const features = [
  {
    icon: Cloud,
    accent: "bg-champagne/30 text-plum",
    title: "Tenant-owned Cloudinary vaults",
    body: "Each studio connects their own Cloudinary account. Secrets are AES-256 encrypted. Media lives in an isolated per-user CDN path."
  },
  {
    icon: Film,
    accent: "bg-rose/12 text-rose",
    title: "Cinematic 3D album theatre",
    body: "Realistic book-opening, floating polaroids, soft light particles, and event timelines turn galleries into a filmic keepsake."
  },
  {
    icon: LockKeyhole,
    accent: "bg-plum/10 text-plum",
    title: "Private by design",
    body: "JWT sessions, signed uploads, protected routes, password-locked albums, and an RBAC-ready schema foundation."
  },
  {
    icon: Camera,
    accent: "bg-champagne/30 text-plum",
    title: "Drag-and-drop uploads",
    body: "Multi-image and video uploads flow directly to Cloudinary from the browser. Server-side signing keeps API keys invisible to clients."
  },
  {
    icon: Sparkles,
    accent: "bg-rose/12 text-rose",
    title: "6 ceremony timelines",
    body: "Engagement, Haldi, Mehendi, Sangeet, Wedding, Reception — each ritual gets its own curated atmosphere and pacing."
  },
  {
    icon: Wand2,
    accent: "bg-plum/10 text-plum",
    title: "Auto-optimized delivery",
    body: "WebP / AVIF conversion, lazy loading, blur placeholders, and signed CDN delivery — all handled by Cloudinary automatically."
  }
];

const testimonials = [
  {
    quote: "It felt less like a gallery and more like walking back into our wedding week.",
    author: "Priya & Rohit",
    role: "Couple, Jaipur 2024"
  },
  {
    quote: "Our films, photos, and private albums finally live in one elegant place.",
    author: "Studio Lumière",
    role: "Wedding photography studio"
  },
  {
    quote: "The Cloudinary handoff means every client keeps ownership of their memories.",
    author: "Aryan Sharma",
    role: "Independent wedding filmmaker"
  }
];

const pricingPlans = [
  {
    name: "Studio",
    tag: "Launch",
    price: "49",
    features: [
      "Unlimited wedding albums",
      "Cloudinary vault integration",
      "3D cinematic viewer",
      "Password-protected albums",
      "Shareable album links",
      "6 ceremony timelines"
    ]
  },
  {
    name: "Atelier",
    tag: "Scale",
    price: "149",
    popular: true,
    features: [
      "Everything in Studio",
      "Multi-user team access",
      "Custom branding",
      "Priority support",
      "Watermark controls",
      "Advanced analytics"
    ]
  }
];

/* ── Reveal animation hook ── */
function useScrollReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const elements = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true
          }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);
}

/* ── Main Landing Page ── */
export function LandingPage() {
  useScrollReveal();

  return (
    <main className="min-h-screen overflow-hidden">
      <HeroSection />
      <LogoBar />
      <StorySection />
      <FeatureGrid />
      <GallerySection />
      <TestimonialsSection />
      <PricingSection />
      <CtaBanner />
      <FooterSection />
    </main>
  );
}

/* ──────────────────────────────────────────────────────
   HERO
─────────────────────────────────────────────────────── */
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden bg-[#fffaf0]"
    >
      {/* Blurred hero image */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="/media/wedding-hero.png"
          alt="Cinematic wedding photograph"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf0]/96 via-[#fffaf0]/78 to-[#fffaf0]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf0]/30 via-transparent to-[#fffaf0]/80" />
      </motion.div>

      {/* Nav */}
      <nav className="section-shell relative z-20 flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-lg bg-plum shadow-luxury">
            <Sparkles className="size-4 text-champagne" />
          </div>
          <span className="font-display text-2xl font-semibold text-plum">Aureole</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-xl border border-white/60 bg-white/42 p-1 backdrop-blur md:flex">
          {[
            { label: "Story",   href: "#story" },
            { label: "Gallery", href: "#gallery" },
            { label: "Pricing", href: "#pricing" }
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-plum/72 transition hover:bg-white/70 hover:text-plum"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-plum/70">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="premium-ring bg-plum text-ivory hover:bg-plum/90">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="section-shell relative z-10 grid min-h-[calc(100svh-88px)] items-center gap-10 py-10 lg:grid-cols-[1fr_1fr]">
        <motion.div
          style={{ opacity }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 border-champagne/50 bg-champagne/20 text-plum backdrop-blur"
            >
              <Sparkles className="size-3 text-rose" />
              Multi-tenant cinematic wedding platform
            </Badge>
          </motion.div>

          <h1 className="text-balance font-display font-semibold leading-[0.92] text-plum">
            <motion.span
              className="block text-7xl md:text-8xl lg:text-9xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Aureole
            </motion.span>
            <motion.span
              className="mt-1 block text-5xl text-rose md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              Albums
            </motion.span>
          </h1>

          <motion.p
            className="mt-7 max-w-lg text-lg leading-8 text-plum/68 md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            A cinematic SaaS for photographers and couples who want encrypted Cloudinary ownership,
            immersive 3D albums, and a dashboard worthy of the day.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
          >
            <Button
              asChild
              size="lg"
              className="premium-ring bg-plum px-8 text-ivory shadow-luxury hover:bg-plum/90"
            >
              <Link href="/register">
                Start your first album
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-plum/20 bg-white/70 text-plum backdrop-blur hover:bg-white"
            >
              <Link href="/albums/rhea-arjun">
                <Play className="size-4" />
                View live experience
              </Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4 text-xs text-plum/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {["AES-256 encrypted secrets", "Per-user Cloudinary vaults", "Vercel edge-ready"].map(
              (item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <BadgeCheck className="size-3.5 text-sage" />
                  {item}
                </span>
              )
            )}
          </motion.div>
        </motion.div>

        {/* 3D Canvas */}
        <motion.div
          className="relative h-[420px] min-h-[44vh] lg:h-[640px]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <MemoryConstellation />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-xs tracking-[0.24em] text-plum/38 uppercase">Scroll</span>
        <div className="h-12 w-px bg-gradient-to-b from-plum/30 to-transparent" />
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   LOGO BAR
─────────────────────────────────────────────────────── */
function LogoBar() {
  return (
    <div className="border-y border-plum/8 bg-white/52 py-5 backdrop-blur">
      <div className="section-shell flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
        {[
          "Three.js", "React Three Fiber", "Cloudinary", "Prisma",
          "Auth.js", "Framer Motion", "GSAP", "Lenis"
        ].map((tech) => (
          <span key={tech} className="text-sm font-medium text-plum/36 tracking-wide">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────
   STORY / TIMELINE
─────────────────────────────────────────────────────── */
function StorySection() {
  return (
    <section id="story" className="relative overflow-hidden bg-[#21101d] py-28 text-ivory">
      {/* Background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.5) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.5) 40px)"
        }}
      />

      <div className="section-shell relative z-10">
        <div className="grid gap-16 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
          {/* Left copy */}
          <div data-reveal className="lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-[0.32em] text-champagne">
              Storytelling scroll
            </p>
            <h2 className="mt-5 font-display text-5xl leading-[1.05] md:text-6xl lg:text-7xl">
              Every ritual gets its own atmosphere.
            </h2>
            <p className="mt-6 leading-7 text-ivory/60">
              Six ceremony phases. Each mapped to a curated media category, lighting mood, and
              timeline position that flows like a film.
            </p>
            <div className="mt-8 h-px w-20 bg-champagne/30" />
            <div className="mt-6 flex items-center gap-3 text-sm text-ivory/50">
              <Heart className="size-4 text-rose" />
              <span>Intimate storytelling at editorial scale</span>
            </div>
          </div>

          {/* Ritual cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {timelineStages.map((stage, i) => (
              <motion.div
                key={stage}
                data-reveal
                data-delay={String(i * 0.06)}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="premium-ring group rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-champagne/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="grid size-8 place-items-center rounded-lg border border-rose/20 bg-rose/10">
                    <Heart className="size-4 text-rose" />
                  </div>
                </div>
                <h3 className="mt-8 font-display text-2xl font-medium">{stage}</h3>
                <p className="mt-3 text-sm leading-6 text-ivory/54">
                  Light particles, motion pacing, and curated media categories keep the memory
                  flow intimate without losing editorial polish.
                </p>
                <div className="mt-6 h-px w-12 bg-champagne/20 transition-all group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   FEATURE GRID
─────────────────────────────────────────────────────── */
function FeatureGrid() {
  return (
    <section className="py-28">
      <div className="section-shell">
        <div className="mx-auto max-w-2xl text-center" data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-rose">Platform architecture</p>
          <h2 className="mt-5 font-display text-5xl leading-[1.06] text-plum md:text-6xl">
            Luxury on the surface.{" "}
            <em className="not-italic text-rose">Serious</em> tenant boundaries underneath.
          </h2>
          <p className="mt-5 text-plum/60 leading-7">
            Every feature is designed to isolate, protect, and delight — so studios can offer their
            clients an experience that matches the premium photography they deliver.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              data-reveal
              data-delay={String(i * 0.05)}
              whileHover={{ y: -8, rotateX: 2, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="card-hover rounded-xl border border-white/70 bg-white/72 p-7 shadow-glass backdrop-blur"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`inline-grid size-11 place-items-center rounded-lg ${feature.accent}`}>
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-7 text-lg font-semibold text-plum">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-plum/60">{feature.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   GALLERY
─────────────────────────────────────────────────────── */
function GallerySection() {
  const heights = [
    "h-80", "h-56", "h-64", "h-72", "h-56", "h-80"
  ];

  return (
    <section id="gallery" className="bg-[#fffaf0]/60 py-28">
      <div className="section-shell">
        <div
          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          data-reveal
        >
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-rose">Wedding showcase</p>
            <h2 className="mt-5 font-display text-5xl text-plum md:text-6xl">
              A gallery that breathes.
            </h2>
            <p className="mt-4 max-w-lg text-plum/58 leading-7">
              Photos land in a masonry grid with cinematic hover transitions and CDN-optimised
              delivery from your Cloudinary account.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 bg-white/80 shadow-glass">
            <Link href="/dashboard">
              <Camera className="size-4" />
              Open your dashboard
            </Link>
          </Button>
        </div>

        {/* Masonry */}
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {[0, 1, 2, 3, 4, 5].map((_item, i) => (
            <div
              key={i}
              data-reveal
              data-delay={String(i * 0.06)}
              className="mb-5 break-inside-avoid overflow-hidden rounded-xl border border-white/80 bg-white shadow-glass"
            >
              <div className={`relative overflow-hidden ${heights[i]}`}>
                <Image
                  src="/media/wedding-hero.png"
                  alt={`${timelineStages[i]} wedding memory`}
                  fill
                  className="object-cover transition duration-700 hover:scale-106"
                  style={{
                    objectPosition: `${22 + i * 11}% ${30 + i * 8}%`,
                    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)"
                  }}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum/40 via-transparent to-transparent opacity-0 transition duration-500 hover:opacity-100" />
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-display text-lg font-medium text-plum">
                  {timelineStages[i]}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Cloudinary CDN
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   TESTIMONIALS
─────────────────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="py-28">
      <div className="section-shell">
        <div className="mb-14 text-center" data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-rose">Testimonials</p>
          <h2 className="mt-5 font-display text-5xl text-plum md:text-6xl">
            Felt by the people who lived it.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              data-reveal
              data-delay={String(i * 0.08)}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-xl border border-white/72 bg-white/70 p-8 shadow-glass backdrop-blur"
            >
              {/* Quote mark */}
              <div className="absolute -right-3 -top-3 font-display text-[120px] leading-none text-champagne/20 select-none pointer-events-none">
                &ldquo;
              </div>

              <div className="mb-5 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="size-4 fill-champagne text-champagne" />
                ))}
              </div>

              <p className="text-lg leading-8 text-plum">&ldquo;{t.quote}&rdquo;</p>

              <div className="mt-7 flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-champagne/30">
                  <Gem className="size-4 text-plum" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-plum">{t.author}</p>
                  <p className="text-xs text-plum/50">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   PRICING
─────────────────────────────────────────────────────── */
function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-[#21101d] py-28 text-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #f2d38a 0%, transparent 50%), radial-gradient(circle at 80% 80%, #b96c74 0%, transparent 50%)"
        }}
      />

      <div className="section-shell relative z-10">
        <div className="mb-14 text-center" data-reveal>
          <p className="text-xs uppercase tracking-[0.32em] text-champagne">Pricing</p>
          <h2 className="mt-5 font-display text-5xl leading-[1.06] md:text-6xl lg:text-7xl">
            Built for studios,{" "}
            <br className="hidden lg:block" />
            planners &amp; collections.
          </h2>
          <p className="mt-5 text-ivory/52 max-w-lg mx-auto leading-7">
            Storage stays in your Cloudinary. Billing gates, team roles, and client portals are
            schema-ready and extensible.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              data-reveal
              data-delay={String(i * 0.1)}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className={`relative overflow-hidden rounded-xl p-8 ${
                plan.popular
                  ? "border-2 border-champagne/50 bg-white/[0.09]"
                  : "border border-white/12 bg-white/[0.05]"
              } backdrop-blur`}
            >
              {plan.popular && (
                <div className="absolute right-5 top-5">
                  <Badge className="bg-champagne text-plum text-xs">Most popular</Badge>
                </div>
              )}

              <Badge
                variant="outline"
                className="border-white/20 bg-white/8 text-ivory/70 text-xs"
              >
                {plan.tag}
              </Badge>

              <h3 className="mt-7 font-display text-5xl">{plan.name}</h3>

              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-6xl text-champagne">${plan.price}</span>
                <span className="mb-2 text-ivory/46">/mo</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-ivory/74">
                    <Check className="size-4 shrink-0 text-champagne" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`mt-10 w-full ${
                  plan.popular
                    ? "bg-champagne text-plum hover:bg-champagne/90"
                    : "bg-white/10 text-ivory hover:bg-white/18"
                }`}
              >
                <Link href="/register">
                  Choose {plan.name}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   CTA BANNER
─────────────────────────────────────────────────────── */
function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Decorative rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[600, 800, 1000].map((size) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-plum/5"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      <div className="section-shell relative z-10 text-center" data-reveal>
        <Badge variant="outline" className="mb-6 border-rose/30 bg-rose/8 text-rose">
          <Heart className="mr-1.5 size-3" />
          Start crafting cinematic memories
        </Badge>

        <h2 className="font-display text-6xl font-semibold leading-[0.96] text-plum md:text-7xl lg:text-8xl">
          Every love story deserves{" "}
          <em className="not-italic text-rose">its own</em>
          <br />
          cinematic universe.
        </h2>

        <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-plum/62">
          Connect your Cloudinary account in under a minute, create your first album, and deliver
          an experience your couples will return to for decades.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="premium-ring bg-plum px-10 text-ivory shadow-luxury hover:bg-plum/90"
          >
            <Link href="/register">
              Begin the experience
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-plum/20 bg-white/70 text-plum backdrop-blur hover:bg-white"
          >
            <Link href="/dashboard">
              <Wand2 className="size-4" />
              Connect Cloudinary
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────
   FOOTER
─────────────────────────────────────────────────────── */
function FooterSection() {
  return (
    <footer className="bg-[#190b16] py-12 text-ivory">
      <div className="section-shell">
        <div className="divider-gold mb-10" />

        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-plum">
                <Sparkles className="size-3.5 text-champagne" />
              </div>
              <span className="font-display text-xl font-semibold">Aureole Albums</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-ivory/44">
              Cinematic memory infrastructure for modern weddings. Built on Next.js, Three.js,
              and per-user Cloudinary vaults.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-ivory/32">
              <BadgeCheck className="size-3.5 text-champagne" />
              Encrypted · Isolated · Deployable
            </div>
          </div>

          {[
            {
              heading: "Platform",
              links: [
                { label: "Dashboard", href: "/dashboard" },
                { label: "Albums", href: "/dashboard/albums" },
                { label: "Media", href: "/dashboard/media" },
                { label: "Cloudinary", href: "/dashboard/cloudinary" }
              ]
            },
            {
              heading: "Experience",
              links: [
                { label: "View album demo", href: "/albums/rhea-arjun" },
                { label: "Onboarding", href: "/onboarding/cloudinary" },
                { label: "Story", href: "#story" },
                { label: "Gallery", href: "#gallery" }
              ]
            },
            {
              heading: "Account",
              links: [
                { label: "Sign in", href: "/login" },
                { label: "Create account", href: "/register" },
                { label: "Forgot password", href: "/forgot-password" },
                { label: "Settings", href: "/dashboard/settings" }
              ]
            }
          ].map((group) => (
            <div key={group.heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-ivory/38">
                {group.heading}
              </p>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ivory/52 transition hover:text-ivory/90"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-gold my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-ivory/32 md:flex-row">
          <p>© 2025 Aureole Albums. All rights reserved.</p>
          <p>
            Built with Next.js 15 &middot; React Three Fiber &middot; Prisma &middot; Auth.js &middot; Cloudinary
          </p>
        </div>
      </div>
    </footer>
  );
}
