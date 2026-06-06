import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BadgeCheck, Cloud, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { CloudinarySettingsForm } from "@/components/dashboard/cloudinary-settings-form";
import { Button } from "@/components/ui/button";
import { getCloudinarySettings } from "@/lib/dashboard-queries";

export const dynamic = "force-dynamic";

const steps = [
  {
    step: "01",
    title: "Enter credentials",
    body: "Add your Cloud Name, API Key, and API Secret from your Cloudinary dashboard."
  },
  {
    step: "02",
    title: "Verify connection",
    body: "We ping the Cloudinary API to confirm your credentials are valid."
  },
  {
    step: "03",
    title: "Start uploading",
    body: "All media goes directly to your isolated CDN path — wedding-albums/<user-id>/<album-id>/"
  }
];

export default async function CloudinaryOnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/onboarding/cloudinary");
  }

  const settings = await getCloudinarySettings(session?.user?.id);

  return (
    <main className="min-h-screen bg-[#fffaf0]">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(242,211,138,0.22),transparent),radial-gradient(ellipse_40%_60%_at_100%_100%,rgba(185,108,116,0.12),transparent)]" />

      <div className="relative z-10 px-5 py-8 lg:px-8">
        {/* Nav */}
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-xl font-semibold text-plum transition hover:opacity-80"
          >
            <div className="grid size-8 place-items-center rounded-lg bg-plum shadow-glass">
              <Sparkles className="size-3.5 text-champagne" />
            </div>
            Aureole
          </Link>
        </div>

        <section className="mx-auto mt-10 max-w-6xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-plum shadow-luxury">
              <Cloud className="size-6 text-champagne" />
            </div>
            <h1 className="font-display text-5xl font-semibold leading-none text-plum md:text-6xl">
              Connect your Cloudinary vault.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-plum/58 leading-7">
              Aureole signs uploads for you only. Once credentials verify, every album and memory
              stores in your own Cloudinary account — never ours.
            </p>
          </div>

          {/* How it works */}
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-white/72 bg-white/78 p-6 shadow-glass"
              >
                <span className="font-display text-4xl text-champagne/50">{item.step}</span>
                <h3 className="mt-5 font-semibold text-plum">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-plum/54">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Form + success path */}
          <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
            <CloudinarySettingsForm settings={settings} />

            {/* Skip / next steps */}
            <div className="space-y-5">
              {settings?.connected && (
                <div className="rounded-xl border border-sage/24 bg-sage/8 p-6">
                  <div className="flex items-center gap-2.5 text-sage">
                    <BadgeCheck className="size-5" />
                    <p className="font-semibold">Cloudinary connected!</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-plum/56">
                    Your vault is active. You can now create albums and upload wedding memories.
                  </p>
                  <Button asChild className="mt-5 w-full bg-plum text-ivory">
                    <Link href="/dashboard/albums">
                      Create first album
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              )}

              <div className="rounded-xl border border-white/72 bg-white/78 p-6 shadow-glass">
                <h3 className="font-semibold text-plum">Skip for now</h3>
                <p className="mt-2 text-sm text-plum/52 leading-6">
                  You can add Cloudinary credentials later from the dashboard.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 w-full border-plum/16 bg-white/80"
                >
                  <Link href="/dashboard">
                    Go to dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
