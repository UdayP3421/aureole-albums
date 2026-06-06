"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { timelineStages } from "@/lib/demo-data";

const AlbumStage = dynamic(() => import("@/components/three/album-stage"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 animate-pulse bg-white/5" />
});

type Media = {
  id: string;
  imageUrl: string;
  secureUrl?: string | null;
  mediaType: string;
  category: string;
};

type AlbumExperienceProps = {
  album: {
    title: string;
    description?: string | null;
    coverImage?: string | null;
    media: Media[];
  };
};

/* ── Slideshow overlay ── */
function SlideshowOverlay({
  media,
  onClose
}: {
  media: Media[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % media.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, playing, media.length]);

  const current = media[index];
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/96"
      onClick={onClose}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-[70vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={current.secureUrl ?? current.imageUrl}
          alt={current.category}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm font-medium text-white/70">{current.category}</p>
          <p className="mt-1 text-xs text-white/36">{index + 1} / {media.length}</p>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => (i - 1 + media.length) % media.length);
          }}
          className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronRight className="rotate-180 size-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(!playing);
          }}
          className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIndex((i) => (i + 1) % media.length);
          }}
          className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
    </motion.div>
  );
}

export function AlbumExperience({ album }: AlbumExperienceProps) {
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const mediaRef = useRef<HTMLElement>(null);

  // Use actual media or demo placeholders
  const media = album.media.length ? album.media : [];
  const filteredMedia = activeCategory
    ? media.filter((m) => m.category === activeCategory)
    : media;

  // GSAP scroll reveals
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const elements = gsap.utils.toArray<HTMLElement>("[data-album-reveal]");
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true }
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <>
      <AnimatePresence>
        {slideshowOpen && media.length > 0 && (
          <SlideshowOverlay
            media={media}
            onClose={() => setSlideshowOpen(false)}
          />
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-[#0a0408] text-ivory">
        {/* ── HERO ── */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Cover image */}
          <Image
            src={album.coverImage ?? "/media/wedding-hero.png"}
            alt={`${album.title} cover`}
            fill
            priority
            className="object-cover opacity-28"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0408]/50 via-[#0a0408]/70 to-[#0a0408]" />

          {/* 3D Canvas */}
          <AlbumStage />

          {/* Content overlay */}
          <div className="section-shell relative z-10 flex min-h-screen flex-col justify-between py-7">
            {/* Nav */}
            <nav className="flex items-center justify-between">
              <Button
                asChild
                variant="outline"
                className="glass-dark border-white/14 text-ivory hover:bg-white/12"
              >
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Aureole
                </Link>
              </Button>
              <Badge
                variant="outline"
                className="border-white/14 bg-white/6 text-ivory/72 backdrop-blur"
              >
                <Sparkles className="mr-1.5 size-3 text-champagne" />
                Immersive album
              </Badge>
            </nav>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl pb-12"
            >
              <p className="mb-4 text-xs uppercase tracking-[0.36em] text-champagne/70">
                Cinematic memory theatre
              </p>
              <h1 className="font-display text-7xl font-semibold leading-[0.92] md:text-8xl lg:text-9xl">
                {album.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ivory/58">
                {album.description ??
                  "An editorial wedding album with floating memories, dynamic light, and soft page-turn ambience."}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button
                  onClick={() => setSlideshowOpen(true)}
                  className="premium-ring bg-ivory text-plum hover:bg-champagne shadow-luxury"
                >
                  <Play className="size-4" />
                  Begin slideshow
                </Button>
                <Button
                  variant="outline"
                  className="border-white/16 bg-white/6 text-ivory hover:bg-white/12"
                  onClick={() => {
                    mediaRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Sparkles className="size-4" />
                  Browse memories
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="section-shell py-24">
          <div data-album-reveal className="grid gap-12 lg:grid-cols-[0.68fr_1.32fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-champagne/60">
                Memory timeline
              </p>
              <h2 className="mt-5 font-display text-5xl leading-[1.06]">
                Rituals arranged like scenes.
              </h2>
              <p className="mt-5 text-ivory/48 leading-7 text-sm">
                Each ceremony phase is curated for its own light, mood, and media flow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {timelineStages.map((stage, i) => {
                const stageMedia = media.filter((m) => m.category === stage);
                const isActive = activeCategory === stage;

                return (
                  <button
                    key={stage}
                    onClick={() => setActiveCategory(isActive ? null : stage)}
                    data-album-reveal
                    className={`rounded-xl border p-5 text-left transition-all duration-300 ${
                      isActive
                        ? "border-champagne/40 bg-champagne/10 scale-[1.02]"
                        : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-3xl text-champagne/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-ivory/50">
                        {stageMedia.length} photos
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-medium">{stage}</h3>
                    <p className="mt-2 text-xs leading-5 text-ivory/44">
                      Curated media, motion pacing, and light particles.
                    </p>
                    {isActive && (
                      <div className="mt-3 h-0.5 w-full bg-gradient-to-r from-champagne/60 to-transparent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MEDIA GRID ── */}
        <section ref={mediaRef} className="bg-[#fffaf0] py-24 text-plum">
          <div className="section-shell">
            <div data-album-reveal className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-rose">
                  {activeCategory ?? "All memories"}
                </p>
                <h2 className="mt-4 font-display text-5xl">
                  {activeCategory ? `${activeCategory} ceremony` : "Selected memories"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {activeCategory && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveCategory(null)}
                    className="text-xs"
                  >
                    <X className="size-3" />
                    Clear filter
                  </Button>
                )}
                <Badge variant="secondary">
                  {filteredMedia.length} photos
                </Badge>
              </div>
            </div>

            {filteredMedia.length > 0 ? (
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {filteredMedia.map((memory, i) => (
                  <div
                    key={memory.id}
                    data-album-reveal
                    className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl border border-white/70 bg-white shadow-glass transition hover:-translate-y-1 hover:shadow-luxury"
                    onClick={() => {
                      setSlideshowOpen(true);
                    }}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        i % 3 === 0 ? "h-80" : i % 3 === 1 ? "h-56" : "h-64"
                      }`}
                    >
                      {memory.mediaType === "VIDEO" ? (
                        <video
                          src={memory.secureUrl ?? memory.imageUrl}
                          className="h-full w-full object-cover"
                          muted
                          playsInline
                          loop
                          autoPlay
                        />
                      ) : (
                        <Image
                          src={memory.secureUrl ?? memory.imageUrl}
                          alt={`${memory.category} memory`}
                          fill
                          className="object-cover transition duration-700 hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/60 to-transparent p-4 text-ivory">
                        <p className="text-xs font-medium">{memory.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-plum/12 bg-white/50 p-12 text-center">
                <p className="text-plum/50">
                  {activeCategory
                    ? `No ${activeCategory} photos in this album yet.`
                    : "No media uploaded yet."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
