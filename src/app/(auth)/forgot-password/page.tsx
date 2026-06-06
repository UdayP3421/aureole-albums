"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { requestPasswordReset, type ActionState } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { status: "idle", message: "" };

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl p-8"
    >
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-plum/46 transition hover:text-plum"
      >
        <ArrowLeft className="size-3" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <div className="mb-4 inline-grid size-10 place-items-center rounded-xl border border-champagne/50 bg-champagne/20">
          <Mail className="size-4 text-plum" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-plum">Forgot your password?</h1>
        <p className="mt-2 text-sm text-plum/52">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {state.status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-sage/20 bg-sage/8 p-6 text-center"
        >
          <p className="font-medium text-sage">Reset link sent</p>
          <p className="mt-2 text-sm text-plum/60">
            {state.message}
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rose hover:text-plum"
          >
            <ArrowLeft className="size-3" />
            Back to sign in
          </Link>
        </motion.div>
      ) : (
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-plum/70 text-sm">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
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
            <Mail className="size-4" />
            {pending ? "Sending link…" : "Send reset link"}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
