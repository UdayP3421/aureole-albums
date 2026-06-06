"use client";

import { useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, KeyRound, Save, UserRound } from "lucide-react";
import {
  updatePassword,
  updateProfile,
  type UserActionState
} from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: UserActionState = { status: "idle", message: "" };

type ProfileSettingsFormProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string | null;
  };
};

function StatusMessage({ state }: { state: UserActionState }) {
  if (!state.message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
          state.status === "error"
            ? "bg-destructive/8 text-destructive"
            : "bg-sage/8 text-sage"
        }`}
      >
        {state.status === "success" && <CheckCircle2 className="size-4 shrink-0" />}
        {state.message}
      </motion.div>
    </AnimatePresence>
  );
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfile,
    initialState
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updatePassword,
    initialState
  );

  const isOAuthOnly = user.provider === "google" && !user.email?.includes("@");

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Profile card */}
      <div className="rounded-xl border border-white/72 bg-white/82 p-7 shadow-glass">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-rose/10">
            <UserRound className="size-4 text-rose" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-plum">Studio profile</h2>
            <p className="text-xs text-plum/46">Shown across dashboard and shared albums</p>
          </div>
        </div>

        <form action={profileAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-plum/68">
              Display name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={user.name ?? ""}
              autoComplete="name"
              required
              className="border-plum/14 bg-white/80 focus:border-rose/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-plum/68">
              Email address
            </Label>
            <Input
              id="email"
              value={user.email ?? ""}
              disabled
              className="border-plum/10 bg-plum/4 text-plum/50"
            />
            <p className="text-xs text-plum/36">Email cannot be changed from this page.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm text-plum/68">
              Profile image URL{" "}
              <span className="text-plum/32">(optional)</span>
            </Label>
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={user.image ?? ""}
              placeholder="https://example.com/photo.jpg"
              className="border-plum/14 bg-white/80 focus:border-rose/40"
            />
          </div>

          <StatusMessage state={profileState} />

          <Button
            type="submit"
            disabled={profilePending}
            className="premium-ring bg-plum text-ivory shadow-glass hover:bg-plum/90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {profilePending ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </div>

      {/* Password card */}
      <div className="rounded-xl border border-white/72 bg-white/82 p-7 shadow-glass">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-champagne/22">
            <KeyRound className="size-4 text-plum/60" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-plum">Password</h2>
            <p className="text-xs text-plum/46">
              {isOAuthOnly
                ? "Add a password to enable email login alongside Google."
                : "Change the password for email login."}
            </p>
          </div>
        </div>

        <form action={passwordAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm text-plum/68">
              Current password
            </Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder="Your current password"
              className="border-plum/14 bg-white/80 focus:border-rose/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-plum/68">
              New password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              required
              className="border-plum/14 bg-white/80 focus:border-rose/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm text-plum/68">
              Confirm new password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat the password"
              required
              className="border-plum/14 bg-white/80 focus:border-rose/40"
            />
          </div>

          <StatusMessage state={passwordState} />

          <Button
            type="submit"
            disabled={passwordPending}
            className="premium-ring bg-plum text-ivory shadow-glass hover:bg-plum/90 disabled:opacity-60"
          >
            <KeyRound className="size-4" />
            {passwordPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
