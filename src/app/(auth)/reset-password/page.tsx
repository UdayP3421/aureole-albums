"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { resetPassword, type ActionState } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { status: "idle", message: "" };

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, action, pending] = useActionState(resetPassword, initialState);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl p-8"
    >
      <div className="mb-8">
        <div className="mb-4 inline-grid size-10 place-items-center rounded-xl bg-plum">
          <KeyRound className="size-4 text-champagne" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-plum">Reset your password</h1>
        <p className="mt-2 text-sm text-plum/52">
          Choose a strong new password for your studio.
        </p>
      </div>

      {state.status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-sage/20 bg-sage/8 p-6 text-center"
        >
          <p className="font-medium text-sage">Password updated!</p>
          <p className="mt-2 text-sm text-plum/60">{state.message}</p>
          <Button asChild className="mt-5 w-full bg-plum text-ivory">
            <Link href="/login">
              Sign in
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      ) : (
        <form action={action} className="space-y-5">
          <input type="hidden" name="token" value={token} />
          <div className="space-y-2">
            <Label htmlFor="password" className="text-plum/70 text-sm">
              New password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              required
              className="border-plum/16 bg-white/80 focus:border-rose/40"
            />
          </div>

          {state.message && state.status === "error" ? (
            <p className="rounded-lg bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {state.message}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={pending}
            className="premium-ring w-full bg-plum text-ivory shadow-glass hover:bg-plum/90 disabled:opacity-60"
          >
            <KeyRound className="size-4" />
            {pending ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
