import { ImagePlus } from "lucide-react";
import { auth } from "@/auth";
import { MediaLibrary } from "@/components/dashboard/media-library";
import { UploadDropzone } from "@/components/dashboard/upload-dropzone";
import { getDashboardSnapshot, getMediaLibrary } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const session = await auth();
  const [snapshot, media] = await Promise.all([
    getDashboardSnapshot(session?.user?.id),
    getMediaLibrary(session?.user?.id)
  ]);

  return (
    <div className="space-y-7">
      {/* Upload area */}
      <div className="grid gap-7 xl:grid-cols-[1fr_340px]">
        <UploadDropzone
          albums={snapshot.albums.map((a) => ({ id: a.id, title: a.title }))}
        />

        {/* Workflow info */}
        <div className="rounded-xl border border-white/72 bg-white/82 p-6 shadow-glass">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-rose/10">
              <ImagePlus className="size-4 text-rose" />
            </div>
            <h3 className="font-display text-xl font-semibold text-plum">Media workflow</h3>
          </div>
          <ul className="space-y-3">
            {[
              "Images and videos upload directly to Cloudinary via signed parameters — API keys stay server-side.",
              "Cloudinary auto-converts to WebP and AVIF for the fastest CDN delivery.",
              "The upload-complete route saves public IDs, secure URLs, dimensions, and byte size to your database.",
              "Tag each photo to a ceremony timeline for a cinematic album flow.",
              "Set any photo as the album cover from the library below."
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-xs leading-5 text-plum/56">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose/50" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Media grid */}
      <MediaLibrary media={media} />
    </div>
  );
}
