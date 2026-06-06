import { AlbumExperience } from "@/components/album/album-experience";
import { db } from "@/lib/db";
import { demoAlbums, demoMedia } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

async function getAlbum(slug: string) {
  if (process.env.DATABASE_URL) {
    try {
      const album = await db.album.findFirst({
        where: {
          slug,
          privacy: {
            in: ["PUBLIC", "UNLISTED"]
          }
        },
        include: {
          media: {
            orderBy: { order: "asc" }
          }
        }
      });

      if (album) {
        return {
          title: album.title,
          description: album.description,
          coverImage: album.coverImage,
          media: album.media.map((media) => ({
            id: media.id,
            imageUrl: media.imageUrl,
            secureUrl: media.secureUrl,
            mediaType: media.mediaType,
            category: media.category
          }))
        };
      }
    } catch {
      // Demo fallback keeps the public experience previewable without a database.
    }
  }

  const demo = demoAlbums.find((album) => album.slug === slug) ?? demoAlbums[0];

  return {
    title: demo.title,
    description: demo.description,
    coverImage: demo.coverImage,
    media: demoMedia
  };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = await getAlbum(slug);

  return <AlbumExperience album={album} />;
}
