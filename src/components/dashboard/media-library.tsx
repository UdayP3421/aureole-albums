import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronDown, Grid2X2, ImageIcon, Save, Star, Trash2 } from "lucide-react";
import {
  deleteMedia,
  moveMedia,
  setAlbumCover,
  updateMediaCategory
} from "@/actions/media-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timelineStages } from "@/lib/demo-data";
import { formatBytes } from "@/lib/utils";

type MediaLibraryProps = {
  media: Array<{
    id: string;
    imageUrl: string;
    secureUrl?: string | null;
    mediaType: string;
    category: string;
    order: number;
    width?: number | null;
    height?: number | null;
    bytes?: number | null;
    duration?: number | null;
    albumTitle: string;
    albumSlug: string;
  }>;
};

export function MediaLibrary({ media }: MediaLibraryProps) {
  return (
    <div className="rounded-xl border border-white/72 bg-white/82 p-6 shadow-glass">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-champagne/24">
            <Grid2X2 className="size-4 text-plum/60" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-plum">Media library</h2>
            <p className="text-xs text-plum/46">
              Tag scenes · choose covers · reorder memories
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {media.length} items
        </Badge>
      </div>

      {media.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {media.map((item) => {
            const src = item.secureUrl ?? item.imageUrl;
            const isVideo = item.mediaType === "VIDEO";

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-plum/8 bg-white/70 transition hover:shadow-glass"
              >
                {/* Media preview */}
                <div className="relative aspect-[4/3] overflow-hidden bg-plum/6">
                  {isVideo ? (
                    <video
                      src={src}
                      className="h-full w-full object-cover"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={`${item.category} memory from ${item.albumTitle}`}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(min-width: 1280px) 36vw, (min-width: 768px) 50vw, 100vw"
                    />
                  )}

                  {/* Overlay badges */}
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Badge variant="secondary" className="backdrop-blur text-xs">
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="backdrop-blur bg-black/20 border-white/20 text-white text-xs">
                      {item.mediaType.toLowerCase()}
                    </Badge>
                  </div>

                  {/* Order badge */}
                  <div className="absolute right-3 top-3">
                    <span className="rounded-lg bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                      #{item.order + 1}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/albums/${item.albumSlug}`}
                        className="font-medium text-plum transition hover:text-rose"
                      >
                        {item.albumTitle}
                      </Link>
                      <p className="mt-0.5 text-xs text-plum/42">
                        {item.width && item.height
                          ? `${item.width} × ${item.height}`
                          : "Optimized asset"}{" "}
                        · {formatBytes(item.bytes ?? 0)}
                      </p>
                    </div>
                    <ImageIcon className="mt-0.5 size-4 shrink-0 text-plum/28" />
                  </div>

                  {/* Category form */}
                  <form action={updateMediaCategory} className="flex gap-2">
                    <input type="hidden" name="mediaId" value={item.id} />
                    <div className="relative flex-1">
                      <select
                        name="category"
                        defaultValue={item.category}
                        className="h-9 w-full appearance-none rounded-lg border border-plum/12 bg-white/80 pl-3 pr-7 text-xs text-plum focus:border-rose/40 focus:outline-none"
                      >
                        {timelineStages.map((stage) => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-plum/36" />
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 shrink-0 border-plum/14 bg-white/70"
                      title="Save category"
                    >
                      <Save className="size-3.5" />
                    </Button>
                  </form>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 border-t border-plum/6 pt-3">
                    <form action={setAlbumCover}>
                      <input type="hidden" name="mediaId" value={item.id} />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1.5 border-champagne/40 bg-champagne/12 text-xs text-plum hover:bg-champagne/28"
                      >
                        <Star className="size-3" />
                        Set cover
                      </Button>
                    </form>
                    <form action={moveMedia}>
                      <input type="hidden" name="mediaId" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-plum/14 bg-white/70"
                        title="Move earlier"
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                    </form>
                    <form action={moveMedia}>
                      <input type="hidden" name="mediaId" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-plum/14 bg-white/70"
                        title="Move later"
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                    </form>
                    <form action={deleteMedia} className="ml-auto">
                      <input type="hidden" name="mediaId" value={item.id} />
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-rose/20 bg-white/70 text-rose hover:bg-rose hover:text-ivory"
                        title="Delete media"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-plum/12 bg-[#fffaf0]/60 p-12 text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-plum/6">
            <ImageIcon className="size-6 text-plum/32" />
          </div>
          <p className="font-medium text-plum/62">No uploaded memories yet</p>
          <p className="mt-2 text-sm text-plum/38">
            Create an album · connect Cloudinary · then upload the first scene
          </p>
        </div>
      )}
    </div>
  );
}
