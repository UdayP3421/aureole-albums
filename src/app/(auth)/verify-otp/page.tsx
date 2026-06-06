"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { verifyEmailOtp, type ActionState } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = { status: "idle", message: "" };

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpForm />
    </Suspense>
  );
}

function OtpForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [state, action, pending] = useActionState(verifyEmailOtp, initialState);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl p-8"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-plum">
          <ShieldCheck className="size-5 text-champagne" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-plum">Verify your email</h1>
        <p className="mt-2 text-sm text-plum/52">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-plum">{email}</span>
        </p>
      </div>

      {state.status === "success" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-sage/20 bg-sage/8 p-6 text-center"
        >
          <p className="font-medium text-sage">Email verified!</p>
          <p className="mt-2 text-sm text-plum/60">{state.message}</p>
          <Button asChild className="mt-5 w-full bg-plum text-ivory">
            <Link href="/login">
              Sign in now
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      ) : (
        <form action={action} className="space-y-5">
          <input type="hidden" name="email" value={email} />
          <div className="space-y-2">
            <Label htmlFor="code" className="text-plum/70 text-sm">
              Verification code
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              required
              className="border-plum/16 bg-white/80 text-center text-xl font-semibold tracking-[0.5em] focus:border-rose/40"
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
            <ShieldCheck className="size-4" />
            {pending ? "Verifying…" : "Verify email"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-xs text-plum/38">
        Didn&apos;t receive a code?{" "}
        <Link href="/register" className="text-rose hover:text-plum">
          Start over
        </Link>
      </p>
    </motion.div>
  );
}
