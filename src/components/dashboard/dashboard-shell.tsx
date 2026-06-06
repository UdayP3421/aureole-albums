"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Cloud,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard",            label: "Overview",    icon: LayoutDashboard },
  { href: "/dashboard/albums",     label: "Albums",      icon: BookOpen },
  { href: "/dashboard/media",      label: "Media",       icon: ImagePlus },
  { href: "/dashboard/cloudinary", label: "Cloudinary",  icon: Cloud },
  { href: "/dashboard/settings",   label: "Settings",    icon: Settings }
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const activePage = navigation.find(
    (item) => item.href === pathname || pathname.startsWith(item.href + "/")
  );

  return (
    <div className="min-h-screen bg-[#f8f2ea]">
      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-plum/8 bg-white/76 backdrop-blur-2xl lg:flex">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 px-6 py-6 transition hover:opacity-80"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-plum shadow-glass">
            <Sparkles className="size-4 text-champagne" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-plum">Aureole</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-plum/38">
              Wedding studio
            </p>
          </div>
        </Link>

        <div className="mx-4 h-px bg-plum/6" />

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 pt-4">
          {navigation.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "text-ivory"
                    : "text-plum/60 hover:bg-plum/6 hover:text-plum"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-plum"
                    transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  />
                )}
                <item.icon className="relative z-10 size-4 shrink-0" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 space-y-2">
          <Link
            href="/albums/rhea-arjun"
            className="flex h-9 items-center gap-2.5 rounded-lg border border-plum/12 bg-champagne/14 px-3 text-sm text-plum/70 transition hover:bg-champagne/24 hover:text-plum"
          >
            <Eye className="size-4" />
            Preview 3D album
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm text-plum/50 transition hover:bg-rose/8 hover:text-rose"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="lg:pl-[264px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-plum/8 bg-[#f8f2ea]/82 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-rose">Studio workspace</p>
              <h1 className="font-display text-2xl font-semibold text-plum">
                {activePage?.label ?? "Dashboard"}
              </h1>
            </div>

            {/* Mobile nav */}
            <nav className="flex gap-1.5 overflow-x-auto lg:hidden">
              {navigation.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition",
                      active ? "bg-plum text-ivory" : "bg-white/66 text-plum/62 hover:bg-white"
                    )}
                  >
                    <item.icon className="size-3.5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 py-8 lg:px-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
