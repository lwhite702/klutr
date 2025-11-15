'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export default function ConfirmResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Verify we have the necessary tokens from the reset link
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (!accessToken || type !== 'recovery') {
      toast.error('Invalid or expired reset link')
      router.push('/reset-password')
    }
  }, [router])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords don\'t match. Try again?')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')

      if (!accessToken) {
        throw new Error('Missing reset token')
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      toast.success('Password updated successfully!')
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || 'Couldn\'t reset password. Try again?')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
                <CheckCircle2 className="w-8 h-8 text-[var(--klutr-mint)]" />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Password updated!
              </CardTitle>
              <CardDescription className="text-base font-body">
                Your password has been reset successfully. Redirecting to sign in...
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className="w-full bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white rounded-2xl"
                onClick={() => router.push('/login')}
              >
                Go to sign in
              </Button>
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
                  <Lock className="w-12 h-12 text-[var(--klutr-mint)]" />
                </motion.div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Set new password
                  </h2>
                  <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 font-body">
                    Choose a strong password to keep your account secure
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
                Reset password
              </CardTitle>
              <CardDescription className="text-base font-body">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleReset}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--klutr-text-primary-light)]/40 dark:text-[var(--klutr-text-primary-dark)]/40" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--klutr-text-primary-light)]/40 dark:text-[var(--klutr-text-primary-dark)]/40" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
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
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Update password
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
                <Link
                  href="/login"
                  className="text-sm text-center text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 font-body"
                >
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



