import { BookOpen } from "lucide-react";
import { auth } from "@/auth";
import { AlbumCard } from "@/components/dashboard/album-card";
import { CreateAlbumForm } from "@/components/dashboard/create-album-form";
import { getDashboardSnapshot } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export default async function AlbumsPage() {
  const session = await auth();
  const snapshot = await getDashboardSnapshot(session?.user?.id);

  return (
    <div className="grid gap-7 xl:grid-cols-[420px_1fr]">
      {/* Create form */}
      <CreateAlbumForm />

      {/* Album library */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-plum/8">
            <BookOpen className="size-4 text-plum/60" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-plum">Album library</h2>
          <span className="rounded-full border border-plum/12 bg-plum/6 px-2.5 py-0.5 text-xs font-medium text-plum/52">
            {snapshot.albums.length}
          </span>
        </div>

        {snapshot.albums.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {snapshot.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-plum/12 bg-white/50 p-14 text-center">
            <BookOpen className="mx-auto size-10 text-plum/24" />
            <p className="mt-4 font-medium text-plum/56">No albums yet</p>
            <p className="mt-1.5 text-sm text-plum/36">
              Use the form on the left to create your first wedding album.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
