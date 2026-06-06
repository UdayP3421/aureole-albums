"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { registerUser, type ActionState } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const initialState: ActionState = { status: "idle", message: "" };

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerUser, initialState);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 inline-grid size-10 place-items-center rounded-xl bg-plum">
          <Sparkles className="size-4.5 text-champagne" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-plum">
          Create your studio
        </h1>
        <p className="mt-2 text-sm text-plum/52">
          One account · one Cloudinary vault · unlimited wedding stories.
        </p>
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-plum/16 bg-white/80 text-plum shadow-glass hover:bg-white"
        onClick={() => signIn("google", { callbackUrl: "/onboarding/cloudinary" })}
      >
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1 bg-plum/10" />
        <span className="text-xs uppercase tracking-[0.24em] text-plum/32">or</span>
        <Separator className="flex-1 bg-plum/10" />
      </div>

      {/* Email form */}
      <form action={action} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-plum/70 text-sm">
            Full name
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Priya Sharma"
            required
            className="border-plum/16 bg-white/80 focus:border-rose/40"
          />
        </div>
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
        <div className="space-y-2">
          <Label htmlFor="password" className="text-plum/70 text-sm">
            Password
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

        {state.message ? (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              state.status === "error"
                ? "rounded-lg bg-destructive/8 px-4 py-3 text-sm text-destructive"
                : "rounded-lg bg-sage/8 px-4 py-3 text-sm text-sage"
            }
          >
            {state.message}
          </motion.p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="premium-ring w-full bg-plum text-ivory shadow-glass hover:bg-plum/90 disabled:opacity-60"
        >
          <Sparkles className="size-4" />
          {pending ? "Creating your studio…" : "Create account"}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-plum/50">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-rose transition hover:text-plum">
          Sign in <ArrowRight className="ml-0.5 inline size-3" />
        </Link>
      </p>
    </motion.div>
  );
}
