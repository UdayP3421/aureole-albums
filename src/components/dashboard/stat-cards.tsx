import { BarChart3, Cloud, Database, Images } from "lucide-react";
import { formatBytes } from "@/lib/utils";

type Stats = {
  albums: number;
  media: number;
  storageBytes: number;
  cloudinaryConnected: boolean;
};

const items = (stats: Stats) => [
  {
    label: "Albums",
    value: String(stats.albums),
    icon: Images,
    iconBg: "bg-champagne/26",
    accent: "from-champagne/12 to-transparent",
    desc: "Wedding collections"
  },
  {
    label: "Media assets",
    value: String(stats.media),
    icon: BarChart3,
    iconBg: "bg-rose/10",
    accent: "from-rose/8 to-transparent",
    desc: "Photos and films"
  },
  {
    label: "Tracked storage",
    value: formatBytes(stats.storageBytes),
    icon: Database,
    iconBg: "bg-plum/8",
    accent: "from-plum/5 to-transparent",
    desc: "Cloudinary bytes"
  },
  {
    label: "Cloudinary",
    value: stats.cloudinaryConnected ? "Connected" : "Pending",
    icon: Cloud,
    iconBg: stats.cloudinaryConnected ? "bg-sage/14" : "bg-champagne/20",
    accent: stats.cloudinaryConnected ? "from-sage/8 to-transparent" : "from-champagne/10 to-transparent",
    desc: stats.cloudinaryConnected ? "Vault active" : "Setup required",
    connected: stats.cloudinaryConnected
  }
];

export function StatCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items(stats).map((item) => (
        <div
          key={item.label}
          className="relative overflow-hidden rounded-xl border border-white/70 bg-white/78 p-5 shadow-glass backdrop-blur"
        >
          {/* Gradient tint */}
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.accent}`}
          />

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-plum/46">{item.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-plum">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-plum/36">{item.desc}</p>
            </div>
            <div
              className={`grid size-10 shrink-0 place-items-center rounded-lg ${item.iconBg}`}
            >
              <item.icon className="size-4.5 text-plum/60" />
            </div>
          </div>

          {/* Connected indicator */}
          {"connected" in item && (
            <div className="relative mt-4 flex items-center gap-1.5">
              <div
                className={`size-2 rounded-full ${
                  item.connected ? "bg-sage animate-pulse" : "bg-champagne"
                }`}
              />
              <span className="text-[10px] text-plum/42">
                {item.connected ? "Live" : "Connect in settings"}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
