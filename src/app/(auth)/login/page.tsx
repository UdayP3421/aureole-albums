"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleEmailLogin(formData: FormData) {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      callbackUrl
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel rounded-2xl p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold text-plum">Welcome back</h1>
        <p className="mt-2 text-sm text-plum/52">
          Continue building cinematic wedding memories.
        </p>
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-plum/16 bg-white/80 text-plum shadow-glass hover:bg-white"
        onClick={() => signIn("google", { callbackUrl })}
      >
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1 bg-plum/10" />
        <span className="text-xs uppercase tracking-[0.24em] text-plum/32">or</span>
        <Separator className="flex-1 bg-plum/10" />
      </div>

      {/* Email form */}
      <form action={handleEmailLogin} className="space-y-5">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-plum/70 text-sm">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-rose transition hover:text-plum"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="border-plum/16 bg-white/80 focus:border-rose/40"
          />
        </div>

        <Button
          type="submit"
          className="premium-ring w-full bg-plum text-ivory shadow-glass hover:bg-plum/90"
        >
          <Mail className="size-4" />
          Sign in with email
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-plum/50">
        New to Aureole?{" "}
        <Link
          href="/register"
          className="font-medium text-rose transition hover:text-plum"
        >
          Create a studio
          <ArrowRight className="ml-0.5 inline size-3" />
        </Link>
      </p>
    </motion.div>
  );
}
