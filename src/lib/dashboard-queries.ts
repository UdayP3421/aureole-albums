import { db } from "@/lib/db";
import { demoAlbums, demoMedia } from "@/lib/demo-data";

export async function getDashboardSnapshot(userId?: string) {
  if (!userId || !process.env.DATABASE_URL) {
    return {
      stats: {
        albums: demoAlbums.length,
        media: demoAlbums.reduce((total, album) => total + album.mediaCount, 0),
        storageBytes: 18_400_000_000,
        cloudinaryConnected: false
      },
      albums: demoAlbums
    };
  }

  try {
    const [albums, mediaCount, mediaAggregate, settings] = await Promise.all([
      db.album.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { media: true }
          }
        }
      }),
      db.media.count({
        where: { album: { userId } }
      }),
      db.media.aggregate({
        where: { album: { userId } },
        _sum: { bytes: true }
      }),
      db.cloudinarySettings.findUnique({
        where: { userId },
        select: { connected: true }
      })
    ]);

    return {
      stats: {
        albums: albums.length,
        media: mediaCount,
        storageBytes: mediaAggregate._sum.bytes ?? 0,
        cloudinaryConnected: Boolean(settings?.connected)
      },
      albums: albums.map((album) => ({
        id: album.id,
        title: album.title,
        slug: album.slug,
        description: album.description,
        coverImage: album.coverImage,
        privacy: album.privacy,
        createdAt: album.createdAt.toISOString(),
        mediaCount: album._count.media
      }))
    };
  } catch {
    return {
      stats: {
        albums: demoAlbums.length,
        media: demoAlbums.reduce((total, album) => total + album.mediaCount, 0),
        storageBytes: 18_400_000_000,
        cloudinaryConnected: false
      },
      albums: demoAlbums
    };
  }
}

export async function getCloudinarySettings(userId?: string) {
  if (!userId || !process.env.DATABASE_URL) {
    return null;
  }

  try {
    return db.cloudinarySettings.findUnique({
      where: { userId },
      select: {
        cloudName: true,
        apiKey: true,
        connected: true
      }
    });
  } catch {
    return null;
  }
}

export async function getMediaLibrary(userId?: string) {
  if (!userId || !process.env.DATABASE_URL) {
    return demoMedia.map((media) => ({
      ...media,
      bytes: 2_400_000,
      width: 1800,
      height: 1200,
      duration: null,
      albumId: demoAlbums[0].id,
      albumTitle: demoAlbums[0].title,
      albumSlug: demoAlbums[0].slug
    }));
  }

  try {
    const media = await db.media.findMany({
      where: {
        album: { userId }
      },
      include: {
        album: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: [
        { albumId: "asc" },
        { order: "asc" },
        { createdAt: "desc" }
      ]
    });

    return media.map((item) => ({
      id: item.id,
      cloudinaryPublicId: item.cloudinaryPublicId,
      imageUrl: item.imageUrl,
      secureUrl: item.secureUrl,
      mediaType: item.mediaType,
      category: item.category,
      order: item.order,
      width: item.width,
      height: item.height,
      bytes: item.bytes,
      duration: item.duration,
      albumId: item.album.id,
      albumTitle: item.album.title,
      albumSlug: item.album.slug
    }));
  } catch {
    return demoMedia.map((media) => ({
      ...media,
      bytes: 2_400_000,
      width: 1800,
      height: 1200,
      duration: null,
      albumId: demoAlbums[0].id,
      albumTitle: demoAlbums[0].title,
      albumSlug: demoAlbums[0].slug
    }));
  }
}
