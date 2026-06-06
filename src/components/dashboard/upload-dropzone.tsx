"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  Film,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { timelineStages } from "@/lib/demo-data";
import { useStudioStore } from "@/stores/studio-store";
import { cn } from "@/lib/utils";

type AlbumOption = { id: string; title: string };
type UploadState = {
  file: string;
  type: string;
  size: number;
  status: "queued" | "uploading" | "done" | "error";
  progress: number;
};

function formatSize(bytes: number) {
  if (bytes < 1_000_000) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export function UploadDropzone({ albums }: { albums: AlbumOption[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [dragging, setDragging] = useState(false);
  const { selectedAlbumId, selectedCategory, setSelectedAlbumId, setSelectedCategory } =
    useStudioStore();

  const albumId = selectedAlbumId || albums[0]?.id || "";
  const hasAlbums = albums.length > 0;
  const accepted = useMemo(() => "image/*,video/*", []);

  useEffect(() => {
    if (!selectedAlbumId && albums[0]?.id) setSelectedAlbumId(albums[0].id);
  }, [albums, selectedAlbumId, setSelectedAlbumId]);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (!albumId) return;
      const items = Array.from(files);

      setUploads(
        items.map((f) => ({
          file: f.name,
          type: f.type,
          size: f.size,
          status: "queued",
          progress: 0
        }))
      );

      for (const file of items) {
        const name = file.name;

        setUploads((cur) =>
          cur.map((u) => (u.file === name ? { ...u, status: "uploading", progress: 15 } : u))
        );

        try {
          const signRes = await fetch("/api/cloudinary/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ albumId, resourceType: "auto" })
          });

          if (!signRes.ok) throw new Error("Signing failed");
          const signed = await signRes.json();

          setUploads((cur) =>
            cur.map((u) => (u.file === name ? { ...u, progress: 35 } : u))
          );

          const fd = new FormData();
          fd.append("file", file);
          fd.append("api_key", signed.apiKey);
          fd.append("timestamp", String(signed.timestamp));
          fd.append("signature", signed.signature);
          fd.append("folder", signed.folder);
          fd.append("overwrite", "false");
          fd.append("use_filename", "true");
          fd.append("unique_filename", "true");

          const upRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`,
            { method: "POST", body: fd }
          );

          if (!upRes.ok) throw new Error("Upload failed");
          const cl = await upRes.json();

          setUploads((cur) =>
            cur.map((u) => (u.file === name ? { ...u, progress: 80 } : u))
          );

          await fetch("/api/media/upload-complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              albumId,
              publicId: cl.public_id,
              secureUrl: cl.secure_url,
              resourceType: cl.resource_type,
              width: cl.width,
              height: cl.height,
              bytes: cl.bytes,
              duration: cl.duration,
              category: selectedCategory
            })
          });

          setUploads((cur) =>
            cur.map((u) => (u.file === name ? { ...u, status: "done", progress: 100 } : u))
          );
        } catch {
          setUploads((cur) =>
            cur.map((u) => (u.file === name ? { ...u, status: "error", progress: 0 } : u))
          );
        }
      }
    },
    [albumId, selectedCategory]
  );

  return (
    <div className="rounded-xl border border-white/72 bg-white/82 p-6 shadow-glass">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-rose/10">
            <CloudUpload className="size-4 text-rose" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-plum">Upload memories</h2>
            <p className="text-xs text-plum/46">
              Signed server-side · isolated CDN path
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">WebP / AVIF</Badge>
      </div>

      {/* Selectors */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        {/* Album select */}
        <div className="relative">
          <select
            value={albumId}
            onChange={(e) => setSelectedAlbumId(e.target.value)}
            disabled={!hasAlbums}
            className="h-10 w-full appearance-none rounded-lg border border-plum/14 bg-white/80 pl-3 pr-8 text-sm text-plum focus:border-rose/40 focus:outline-none focus:ring-2 focus:ring-rose/20 disabled:opacity-50"
          >
            {hasAlbums ? (
              albums.map((a) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))
            ) : (
              <option value="">No albums — create one first</option>
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-plum/38" />
        </div>

        {/* Category select */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!hasAlbums}
            className="h-10 w-full appearance-none rounded-lg border border-plum/14 bg-white/80 pl-3 pr-8 text-sm text-plum focus:border-rose/40 focus:outline-none focus:ring-2 focus:ring-rose/20 disabled:opacity-50"
          >
            {timelineStages.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-plum/38" />
        </div>
      </div>

      {/* Drop zone */}
      <button
        type="button"
        disabled={!hasAlbums}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void uploadFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={cn(
          "relative grid min-h-[200px] w-full place-items-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
          dragging
            ? "border-rose/60 bg-rose/6 scale-[1.01]"
            : "border-plum/16 bg-[#fffaf0]/60 hover:border-plum/28 hover:bg-white/60"
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={dragging ? { scale: 1.1 } : { scale: 1 }}
            className="grid size-14 place-items-center rounded-xl bg-plum shadow-glass"
          >
            <CloudUpload className="size-6 text-champagne" />
          </motion.div>
          <div>
            <p className="text-base font-semibold text-plum">
              {dragging ? "Drop to upload" : "Drop wedding photos or films"}
            </p>
            <p className="mt-1.5 text-sm text-plum/46">
              or click to browse · images and video supported
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-plum/32">
            <span className="flex items-center gap-1"><ImageIcon className="size-3" /> JPG · PNG · WEBP</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Film className="size-3" /> MP4 · MOV · WEBM</span>
          </div>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accepted}
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) void uploadFiles(e.target.files); }}
      />

      {/* Upload list */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {uploads.map((u) => (
              <motion.div
                key={u.file}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="overflow-hidden rounded-lg border border-plum/10 bg-white/70"
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  {u.type.startsWith("video") ? (
                    <Film className="size-4 shrink-0 text-rose" />
                  ) : (
                    <ImageIcon className="size-4 shrink-0 text-rose" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-plum">{u.file}</p>
                    <p className="text-[10px] text-plum/38">{formatSize(u.size)}</p>
                  </div>
                  {u.status === "uploading" && (
                    <Loader2 className="size-4 shrink-0 animate-spin text-rose" />
                  )}
                  {u.status === "done" && (
                    <CheckCircle2 className="size-4 shrink-0 text-sage" />
                  )}
                  {u.status === "error" && (
                    <AlertCircle className="size-4 shrink-0 text-destructive" />
                  )}
                </div>
                {/* Progress bar */}
                {u.status === "uploading" && (
                  <div className="h-0.5 w-full bg-plum/8">
                    <motion.div
                      className="h-full bg-rose"
                      initial={{ width: "0%" }}
                      animate={{ width: `${u.progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!hasAlbums && (
        <p className="mt-4 text-center text-sm text-plum/44">
          Create an album first, then upload memories.
        </p>
      )}
    </div>
  );
}
