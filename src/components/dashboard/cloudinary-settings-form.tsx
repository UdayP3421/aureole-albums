"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Eye,
  EyeOff,
  PlugZap,
  RefreshCw,
  Trash2
} from "lucide-react";
import { useState } from "react";
import {
  updateCloudinarySettings,
  type CloudinaryActionState
} from "@/actions/cloudinary-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InitialSettings = {
  cloudName?: string | null;
  apiKey?: string | null;
  connected?: boolean;
} | null;

const initialState: CloudinaryActionState = { status: "idle", message: "" };

export function CloudinarySettingsForm({ settings }: { settings: InitialSettings }) {
  const [state, action, pending] = useActionState(updateCloudinarySettings, initialState);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="rounded-xl border border-white/72 bg-white/82 p-7 shadow-glass">
      {/* Header */}
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`grid size-10 place-items-center rounded-lg ${
              settings?.connected ? "bg-sage/14" : "bg-champagne/20"
            }`}
          >
            <Cloud className={`size-4 ${settings?.connected ? "text-sage" : "text-plum/50"}`} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-plum">
              Cloudinary credentials
            </h2>
            <p className="text-xs text-plum/46">
              AES-256 encrypted at rest · never exposed to clients
            </p>
          </div>
        </div>
        <Badge
          variant={settings?.connected ? "success" : "outline"}
          className={`shrink-0 gap-1.5 ${settings?.connected ? "" : "border-champagne/40 bg-champagne/16 text-plum/60"}`}
        >
          <div
            className={`size-1.5 rounded-full ${settings?.connected ? "bg-sage animate-pulse" : "bg-champagne"}`}
          />
          {settings?.connected ? "Connected" : "Not connected"}
        </Badge>
      </div>

      <form action={action} className="space-y-5">
        {/* Cloud Name */}
        <div className="space-y-2">
          <Label htmlFor="cloudName" className="text-sm text-plum/68">
            Cloud name
          </Label>
          <Input
            id="cloudName"
            name="cloudName"
            placeholder="my-wedding-studio"
            defaultValue={settings?.cloudName ?? ""}
            required
            className="border-plum/14 bg-white/80 font-mono text-sm focus:border-rose/40"
          />
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="text-sm text-plum/68">
            API key
          </Label>
          <Input
            id="apiKey"
            name="apiKey"
            placeholder="123456789012345"
            defaultValue={settings?.apiKey ?? ""}
            required
            className="border-plum/14 bg-white/80 font-mono text-sm focus:border-rose/40"
          />
        </div>

        {/* API Secret — masked */}
        <div className="space-y-2">
          <Label htmlFor="apiSecret" className="text-sm text-plum/68">
            API secret
          </Label>
          <div className="relative">
            <Input
              id="apiSecret"
              name="apiSecret"
              type={showSecret ? "text" : "password"}
              placeholder={settings?.connected ? "••••••••••••  (leave blank to keep current)" : "Your API secret"}
              required={!settings?.connected}
              className="border-plum/14 bg-white/80 font-mono text-sm pr-10 focus:border-rose/40"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-plum/36 transition hover:text-plum"
            >
              {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="text-xs text-plum/36">
            Secrets are encrypted with AES-256-GCM before storage. Your API secret never leaves
            server-side code.
          </p>
        </div>

        {/* Status message */}
        <AnimatePresence>
          {state.message ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${
                state.status === "error"
                  ? "bg-destructive/8 text-destructive"
                  : "bg-sage/8 text-sage"
              }`}
            >
              {state.status === "error" ? (
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              ) : (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              )}
              {state.message}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            type="submit"
            name="intent"
            value="save"
            disabled={pending}
            className="premium-ring bg-plum text-ivory shadow-glass hover:bg-plum/90 disabled:opacity-60"
          >
            <PlugZap className="size-4" />
            {pending ? "Saving…" : "Save and verify"}
          </Button>
          <Button
            type="submit"
            name="intent"
            value="test"
            variant="outline"
            disabled={pending}
            className="border-plum/16 bg-white/80 text-plum hover:bg-champagne/14"
          >
            <RefreshCw className={`size-4 ${pending ? "animate-spin" : ""}`} />
            Test connection
          </Button>
          <Button
            type="submit"
            name="intent"
            value="delete"
            variant="outline"
            disabled={pending}
            formNoValidate
            className="border-rose/20 bg-white/80 text-rose hover:bg-rose hover:text-ivory"
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </form>

      {/* Security note */}
      <div className="mt-6 rounded-lg border border-champagne/30 bg-champagne/8 px-4 py-3">
        <p className="text-xs leading-5 text-plum/56">
          <strong className="text-plum/70">Multi-tenant isolation:</strong> These credentials
          belong exclusively to your account. Uploads are signed server-side and routed to{" "}
          <code className="rounded bg-plum/6 px-1 font-mono text-[10px]">
            wedding-albums/&lt;your-user-id&gt;/&lt;album-id&gt;/
          </code>
        </p>
      </div>
    </div>
  );
}
