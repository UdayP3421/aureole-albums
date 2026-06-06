export const demoAlbums = [
  {
    id: "demo-album-1",
    title: "Rhea & Arjun",
    slug: "rhea-arjun",
    description: "A candlelit Jaipur celebration told through stills, vows, and velvet night air.",
    coverImage: "/media/wedding-hero.png",
    privacy: "UNLISTED",
    createdAt: new Date().toISOString(),
    mediaCount: 42
  },
  {
    id: "demo-album-2",
    title: "Maya & Dev",
    slug: "maya-dev",
    description: "A coastal wedding album with haldi sunlight, sangeet movement, and reception sparkle.",
    coverImage: "/media/wedding-hero.png",
    privacy: "PASSWORD",
    createdAt: new Date().toISOString(),
    mediaCount: 68
  }
];

export const demoMedia = [
  {
    id: "memory-1",
    cloudinaryPublicId: "demo/memory-1",
    imageUrl: "/media/wedding-hero.png",
    secureUrl: "/media/wedding-hero.png",
    mediaType: "IMAGE",
    category: "Engagement",
    order: 0
  },
  {
    id: "memory-2",
    cloudinaryPublicId: "demo/memory-2",
    imageUrl: "/media/wedding-hero.png",
    secureUrl: "/media/wedding-hero.png",
    mediaType: "IMAGE",
    category: "Mehendi",
    order: 1
  },
  {
    id: "memory-3",
    cloudinaryPublicId: "demo/memory-3",
    imageUrl: "/media/wedding-hero.png",
    secureUrl: "/media/wedding-hero.png",
    mediaType: "IMAGE",
    category: "Wedding",
    order: 2
  }
];

export const timelineStages = ["Engagement", "Haldi", "Mehendi", "Sangeet", "Wedding", "Reception"];
