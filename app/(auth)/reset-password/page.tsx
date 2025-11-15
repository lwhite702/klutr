'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Sparkles, ArrowLeft, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) throw error

      setSent(true)
      toast.success('Check your email for a password reset link')
    } catch (error: any) {
      toast.error(error.message || 'Couldn\'t send reset link. Try again?')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--klutr-background)] via-[var(--klutr-background)] to-[var(--klutr-mint)]/5 dark:from-[var(--klutr-surface-dark)] dark:via-[var(--klutr-surface-dark)] dark:to-[var(--klutr-mint)]/10 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
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
              <div className="w-16 h-16 rounded-full bg-[var(--klutr-mint)]/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[var(--klutr-mint)]" />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Check your email
              </CardTitle>
              <CardDescription className="text-base font-body">
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 font-body text-center">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                variant="outline"
                className="w-full border-[var(--klutr-outline)]/30 rounded-2xl"
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
              >
                Send another email
              </Button>
              <Link
                href="/login"
                className="text-sm text-center text-[var(--klutr-coral)] hover:text-[var(--klutr-coral)]/80 font-medium transition-colors font-body"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--klutr-background)] via-[var(--klutr-background)] to-[var(--klutr-mint)]/5 dark:from-[var(--klutr-surface-dark)] dark:via-[var(--klutr-surface-dark)] dark:to-[var(--klutr-mint)]/10 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col items-center justify-center space-y-8"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--klutr-mint)]/20 to-[var(--klutr-coral)]/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white dark:bg-[var(--klutr-surface-dark)] rounded-3xl p-12 shadow-2xl border border-[var(--klutr-outline)]/20">
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--klutr-mint)]/20 to-[var(--klutr-coral)]/20 flex items-center justify-center"
                >
                  <KeyRound className="w-12 h-12 text-[var(--klutr-mint)]" />
                </motion.div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Reset your password
                  </h2>
                  <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 font-body">
                    We'll send you a secure link
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Form */}
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
                Forgot password?
              </CardTitle>
              <CardDescription className="text-base font-body">
                Enter your email and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleReset}>
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send reset link
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
                <Link
                  href="/login"
                  className="text-sm text-center text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 font-body"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Back to sign in
                </Link>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}



