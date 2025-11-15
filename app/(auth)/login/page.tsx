"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lightbulb, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/app";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back! Organizing your chaos...");
      router.push(redirect);
    } catch (error: any) {
      toast.error(
        error.message || "Couldn't sign you in. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      toast.error("Enter your email address first");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      });

      if (error) throw error;

      toast.success("Check your email for a sign-in link");
    } catch (error: any) {
      toast.error(error.message || "Couldn't send magic link. Try again?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--klutr-background)] via-[var(--klutr-background)] to-[var(--klutr-mint)]/5 dark:from-[var(--klutr-surface-dark)] dark:via-[var(--klutr-surface-dark)] dark:to-[var(--klutr-mint)]/10 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration and branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col items-center justify-center space-y-8"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--klutr-coral)]/20 to-[var(--klutr-mint)]/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white dark:bg-[var(--klutr-surface-dark)] rounded-3xl p-12 shadow-2xl border border-[var(--klutr-outline)]/20">
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    filter: [
                      "drop-shadow(0 0 8px rgba(255, 107, 107, 0.4))",
                      "drop-shadow(0 0 16px rgba(255, 107, 107, 0.6))",
                      "drop-shadow(0 0 8px rgba(255, 107, 107, 0.4))",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--klutr-coral)]/20 to-[var(--klutr-mint)]/20 flex items-center justify-center"
                >
                  <Lightbulb className="w-12 h-12 text-[var(--klutr-coral)]" />
                </motion.div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Welcome to Klutr
                  </h2>
                  <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 font-body">
                    Your organized workspace awaits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="border-[var(--klutr-outline)]/20 shadow-xl bg-white/80 dark:bg-[var(--klutr-surface-dark)]/80 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image
                  src="/logos/klutr-logo-light-noslogan.svg"
                  alt="Klutr"
                  width={120}
                  height={40}
                  className="h-8 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/logos/klutr-logo-dark-noslogan.svg"
                  alt="Klutr"
                  width={120}
                  height={40}
                  className="h-8 w-auto hidden dark:block"
                  priority
                />
              </div>
              <CardTitle className="text-3xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Welcome back
              </CardTitle>
              <CardDescription className="text-base font-body">
                Sign in to continue organizing your chaos
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--klutr-text-primary-light)]/40 dark:text-[var(--klutr-text-primary-dark)]/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      href="/reset-password"
                      className="text-sm text-[var(--klutr-coral)] hover:text-[var(--klutr-coral)]/80 transition-colors font-body"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--klutr-text-primary-light)]/40 dark:text-[var(--klutr-text-primary-dark)]/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white rounded-2xl shadow-lg h-11 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[var(--klutr-outline)]/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[var(--klutr-surface-dark)] px-2 text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/50">
                      Or
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[var(--klutr-outline)]/30 rounded-2xl h-11 font-medium"
                  onClick={handleMagicLink}
                  disabled={loading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send magic link
                </Button>
                <div className="text-sm text-center text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 font-body">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-[var(--klutr-coral)] hover:text-[var(--klutr-coral)]/80 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2 text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
