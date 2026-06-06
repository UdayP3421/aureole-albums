import { BadgeCheck, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { ProfileSettingsForm } from "@/components/dashboard/profile-settings-form";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getUserProfile(userId?: string) {
  if (!userId || !process.env.DATABASE_URL) return null;

  try {
    return db.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        provider: true,
        role: true,
        createdAt: true
      }
    });
  } catch {
    return null;
  }
}

export default async function SettingsPage() {
  const session = await auth();
  const profile = await getUserProfile(session?.user?.id);

  const user = {
    name:     profile?.name     ?? session?.user?.name,
    email:    profile?.email    ?? session?.user?.email,
    image:    profile?.image    ?? session?.user?.image,
    provider: profile?.provider ?? "credentials"
  };

  return (
    <div className="space-y-7">
      <ProfileSettingsForm user={user} />

      {/* Architecture posture */}
      <div className="rounded-xl border border-white/72 bg-white/82 p-7 shadow-glass">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-plum/8">
            <ShieldCheck className="size-4 text-plum/50" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-plum">Architecture posture</h3>
            <p className="text-xs text-plum/44">
              Prepared for studio teams, client reviewers, billing gates, and admin roles.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              badge: "RBAC ready",
              title: "Role-based access",
              desc: "User roles are modeled (USER / ADMIN) and available in JWT sessions for gate-based routing.",
              color: "border-champagne/30 bg-champagne/8"
            },
            {
              badge: "Tenant isolated",
              title: "Multi-tenant data",
              desc: "Albums, media, and Cloudinary settings are scoped by user ID in every database query.",
              color: "border-rose/20 bg-rose/6"
            },
            {
              badge: "Vercel-ready",
              title: "Edge deployable",
              desc: "PostgreSQL, Auth.js, and all required environment variables are documented in .env.example.",
              color: "border-sage/20 bg-sage/6"
            }
          ].map((item) => (
            <div
              key={item.badge}
              className={`rounded-xl border p-5 ${item.color}`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
                <BadgeCheck className="size-4 text-plum/24" />
              </div>
              <h4 className="mt-4 font-semibold text-plum">{item.title}</h4>
              <p className="mt-2 text-xs leading-5 text-plum/54">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
