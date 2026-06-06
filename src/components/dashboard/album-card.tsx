import Image from "next/image";
import Link from "next/link";
import { Eye, Link2, LockKeyhole, Trash2, Globe, EyeOff, type LucideIcon } from "lucide-react";
import { deleteAlbum } from "@/actions/album-actions";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AlbumCardProps = {
  album: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    coverImage?: string | null;
    privacy: string;
    mediaCount?: number;
  };
};

type PrivacyVariant = NonNullable<BadgeProps["variant"]>;
const privacyConfig: Record<string, { icon: LucideIcon; label: string; variant: PrivacyVariant }> = {
  PUBLIC:    { icon: Globe,       label: "Public",    variant: "success" as PrivacyVariant },
  UNLISTED:  { icon: Link2,       label: "Unlisted",  variant: "secondary" as PrivacyVariant },
  PASSWORD:  { icon: LockKeyhole, label: "Protected", variant: "outline" as PrivacyVariant },
  PRIVATE:   { icon: EyeOff,      label: "Private",   variant: "outline" as PrivacyVariant }
};

export function AlbumCard({ album }: AlbumCardProps) {
  const privacy = privacyConfig[album.privacy] ?? privacyConfig.PRIVATE;
  const PrivacyIcon = privacy.icon;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/72 bg-white/82 shadow-glass transition-all duration-300 hover:-translate-y-1 hover:shadow-luxury">
      {/* Cover image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-plum/6">
        <Image
          src={album.coverImage ?? "/media/wedding-hero.png"}
          alt={`${album.title} wedding album cover`}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum/50 via-transparent to-transparent" />

        {/* Privacy badge */}
        <div className="absolute left-3 top-3">
          <Badge variant={privacy.variant} className="gap-1.5 backdrop-blur">
            <PrivacyIcon className="size-2.5" />
            {privacy.label}
          </Badge>
        </div>

        {/* Media count */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-lg bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {album.mediaCount ?? 0} memories
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-2xl font-semibold text-plum">{album.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-plum/52">
          {album.description ?? "A cinematic wedding memory collection."}
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 border-t border-plum/6 pt-4">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="flex-1 border-plum/16 bg-white/70 text-plum hover:bg-plum hover:text-ivory"
          >
            <Link href={`/albums/${album.slug}`}>
              <Eye className="size-3.5" />
              View
            </Link>
          </Button>
          <Button
            asChild
            size="icon"
            variant="outline"
            className="border-plum/16 bg-white/70 hover:bg-champagne/20"
            title="Copy share link"
          >
            <Link href={`/albums/${album.slug}`}>
              <Link2 className="size-4" />
            </Link>
          </Button>
          <form action={deleteAlbum}>
            <input type="hidden" name="albumId" value={album.id} />
            <Button
              size="icon"
              variant="outline"
              className="border-rose/20 bg-white/70 text-rose hover:bg-rose hover:text-ivory"
              title="Delete album"
            >
              <Trash2 className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </article>
  );
}
