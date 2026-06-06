import { FolderOpen, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { CloudinarySettingsForm } from "@/components/dashboard/cloudinary-settings-form";
import { getCloudinarySettings } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

export default async function CloudinaryPage() {
  const session = await auth();
  const settings = await getCloudinarySettings(session?.user?.id);

  return (
    <div className="grid gap-7 xl:grid-cols-[1fr_380px]">
      <CloudinarySettingsForm settings={settings} />

      {/* Info panel */}
      <div className="space-y-5">
        {/* Folder structure */}
        <div className="rounded-xl border border-white/72 bg-white/82 p-6 shadow-glass">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-champagne/24">
              <FolderOpen className="size-4 text-plum/60" />
            </div>
            <h3 className="font-display text-xl font-semibold text-plum">Tenant folder structure</h3>
          </div>
          <p className="mb-4 text-xs text-plum/46">
            Every upload is routed to an isolated path in your Cloudinary account.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-plum px-5 py-4 text-xs leading-7 text-champagne/80">
{`wedding-albums/
  └── <your-user-id>/
        └── <album-id>/
              ├── image_001.webp
              ├── image_002.avif
              └── film_001.mp4`}
          </pre>
        </div>

        {/* Security notes */}
        <div className="rounded-xl border border-white/72 bg-white/82 p-6 shadow-glass">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-sage/12">
              <ShieldCheck className="size-4 text-sage" />
            </div>
            <h3 className="font-display text-xl font-semibold text-plum">Security notes</h3>
          </div>
          <ul className="space-y-3">
            {[
              "Signed upload payloads are generated in /api/cloudinary/sign — API secrets never leave the server.",
              "Cloudinary API secrets are encrypted with AES-256-GCM using a key derived from CLOUDINARY_ENCRYPTION_KEY.",
              "Album deletion triggers Cloudinary folder cleanup via the user's own credentials.",
              "Each user's uploads are isolated by user ID prefix in the Cloudinary folder hierarchy."
            ].map((note) => (
              <li key={note} className="flex items-start gap-2.5 text-xs leading-5 text-plum/56">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-champagne" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
