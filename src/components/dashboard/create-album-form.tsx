"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, LockKeyhole, Plus } from "lucide-react";
import { createAlbum, type AlbumActionState } from "@/actions/album-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: AlbumActionState = { status: "idle", message: "" };

const privacyOptions = [
  { value: "PRIVATE",  label: "Private — only you",         icon: "🔒" },
  { value: "UNLISTED", label: "Unlisted — shareable link",  icon: "🔗" },
  { value: "PASSWORD", label: "Password protected",          icon: "🛡️" },
  { value: "PUBLIC",   label: "Public — anyone can view",   icon: "🌍" }
];

export function CreateAlbumForm() {
  const [state, action, pending] = useActionState(createAlbum, initialState);
  const [privacy, setPrivacy] = useState("PRIVATE");

  return (
    <div className="rounded-xl border border-white/72 bg-white/82 p-7 shadow-glass">
      {/* Header */}
      <div className="mb-7 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-plum">
          <BookOpen className="size-4 text-champagne" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-plum">Create album</h2>
          <p className="text-xs text-plum/46">
            Set privacy now · upload memories next
          </p>
        </div>
      </div>

      <form action={action} className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm text-plum/68">
            Album title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="Rhea & Arjun, Jaipur 2025"
            required
            className="border-plum/14 bg-white/80 focus:border-rose/40"
          />
        </div>

        {/* Privacy selector */}
        <div className="space-y-2">
          <Label className="text-sm text-plum/68">Privacy</Label>
          <div className="relative">
            <select
              name="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="h-11 w-full appearance-none rounded-lg border border-plum/14 bg-white/80 pl-3 pr-9 text-sm text-plum shadow-sm focus:border-rose/40 focus:outline-none focus:ring-2 focus:ring-rose/20"
            >
              {privacyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-plum/38" />
          </div>
        </div>

        {/* Password field — animated in */}
        <AnimatePresence>
          {privacy === "PASSWORD" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <Label htmlFor="password" className="flex items-center gap-1.5 text-sm text-plum/68">
                <LockKeyhole className="size-3.5" />
                Album password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Strong album password"
                className="border-plum/14 bg-white/80 focus:border-rose/40"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm text-plum/68">
            Description{" "}
            <span className="text-plum/32">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="A candlelit Jaipur celebration told through velvet night air…"
            className="border-plum/14 bg-white/80 focus:border-rose/40"
            rows={3}
          />
        </div>

        {/* Status message */}
        <AnimatePresence>
          {state.message ? (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={
                state.status === "error"
                  ? "rounded-lg bg-destructive/8 px-4 py-3 text-sm text-destructive"
                  : "rounded-lg bg-sage/8 px-4 py-3 text-sm text-sage"
              }
            >
              {state.message}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={pending}
          className="premium-ring w-full bg-plum text-ivory shadow-glass hover:bg-plum/90 disabled:opacity-60"
        >
          <Plus className="size-4" />
          {pending ? "Creating album…" : "Create album"}
        </Button>
      </form>
    </div>
  );
}
