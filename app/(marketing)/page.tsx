"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Zap,
  Layers,
  ArrowRight,
  Pen,
  Calendar,
  BookOpen,
  GraduationCap,
  Star,
  Code,
  Mail,
  Phone,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react";

export default function LandingPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "MindStorm",
      description:
        "AI clusters your notes into meaningful groups. Discover connections you didn't know existed—no manual filing required.",
    },
    {
      icon: Zap,
      title: "QuickCapture",
      description:
        "Dump text, images, or voice notes. No friction, no formatting. Just capture your thoughts and we'll handle the chaos.",
    },
    {
      icon: Layers,
      title: "Smart Stacks",
      description:
        "Intelligent collections that grow with your notes. AI builds stacks based on themes, projects, and patterns you didn't even notice.",
    },
    {
      icon: Pen,
      title: "Write Notes",
      description:
        "Write any notes you want. Capture thoughts, ideas, and insights effortlessly with our intuitive interface.",
    },
    {
      icon: Calendar,
      title: "Plan your day",
      description:
        "Make sure your day is well planned. Organize tasks, set reminders, and stay on top of your schedule.",
    },
    {
      icon: BookOpen,
      title: "Learn facts",
      description:
        "It keeps your mind sharp. Store and organize facts, research, and knowledge for easy retrieval.",
    },
  ];

  const testimonials = [
    {
      name: "Jason",
      username: "@jasonbaldmen",
      text: "The goal is to make the website easy to use for the user and drive the necessary growth.",
      rating: 4,
      date: "12 January 2015",
    },
    {
      name: "Morgan",
      username: "@morganNotFreeMan",
      text: "Klutr is a simple, intuitive note-taking app that keeps everything organized and easy to access. Perfect for boosting productivity!",
      rating: 3,
      date: "12 January 2015",
    },
    {
      name: "Daniel",
      username: "@Daniel3Oscar",
      text: "Klutr is a sleek, user-friendly app that makes organizing notes effortless. It's perfect for staying on top of tasks and ideas!",
      rating: 5,
      date: "12 January 2015",
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 border-b border-[var(--klutr-outline)]/20 bg-[var(--klutr-background)]/95 dark:bg-[var(--klutr-surface-dark)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--klutr-background)]/60 dark:supports-[backdrop-filter]:bg-[var(--klutr-surface-dark)]/60">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {mounted && (
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={
                    isDark
                      ? "/logos/klutr-logo-dark-noslogan.svg"
                      : "/logos/klutr-logo-light-noslogan.svg"
                  }
                  alt="Klutr"
                  width={240}
                  height={80}
                  className="h-12 md:h-16 w-auto"
                  priority
                />
              </Link>
            )}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#discover"
                className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
              >
                Discover
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] hover:text-[var(--klutr-coral)] transition-colors"
              >
                About
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login" aria-label="Log in to your account">
                  Log in
                </Link>
              </Button>
              <Button
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                asChild
              >
                <Link href="/login" aria-label="Sign up for free beta">
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section - Redesigned */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="initial"
                animate="animate"
                variants={{
                  initial: { opacity: 0 },
                  animate: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2 },
                  },
                }}
                className="space-y-8"
              >
                <motion.div variants={fadeInUp}>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none">
                    <span className="text-[var(--klutr-coral)]">Clear</span> the
                    clutr.
                    <br />
                    <span className="font-normal">Keep the spark.</span>
                  </h1>
                </motion.div>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/80 dark:text-[var(--klutr-text-primary-dark)]/80 max-w-lg font-light"
                >
                  Klutr is the frictionless inbox for your brain. Dump text,
                  images, or voice notes and we'll organize them into searchable
                  piles so you can stay creative and clutter-free.
                </motion.p>
                <motion.div variants={fadeInUp} className="pt-4">
                  <Button
                    size="lg"
                    className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full"
                    asChild
                  >
                    <Link href="/login" aria-label="Try Klutr for free">
                      Try for Free
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="relative aspect-square max-w-lg mx-auto bg-gradient-to-br from-[var(--klutr-coral)]/10 to-[var(--klutr-mint)]/10 rounded-2xl p-8">
                  <div className="bg-white dark:bg-[var(--klutr-surface-dark)] rounded-xl shadow-2xl p-6 h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">📝</div>
                      <p className="text-sm text-muted-foreground">
                        App Mockup
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid Section - Expanded */}
        <section id="features" className="container mx-auto px-6 py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="space-y-12"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center space-y-4 max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Everything you need to clear the clutr
              </h2>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Capture anything. We organize it. You stay creative.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.title} variants={fadeInUp}>
                    <Card className="h-full hover:shadow-lg transition-shadow border-[var(--klutr-outline)]/20">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-[var(--klutr-coral)]/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-[var(--klutr-coral)]" />
                        </div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-base text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--klutr-coral)] hover:text-[var(--klutr-coral)]/80"
                          asChild
                        >
                          <Link
                            href="/login"
                            aria-label={`Try ${feature.title}`}
                          >
                            Try Now <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Notes from Class Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="space-y-12"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center space-y-4 max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8 text-[var(--klutr-coral)]" />
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Notes from Class
                </h2>
              </div>
              <p className="text-lg text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                Never forget what your teacher says
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-[var(--klutr-outline)]/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">Math</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      Basic arithmetic and introduction to variables.
                    </p>
                    <div className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] p-4 rounded-lg font-mono text-sm">
                      x = 20 y = -4
                      <br />
                      2x + 3y = ?
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-[var(--klutr-outline)]/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">Physics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                      Inertia is the natural tendency of objects in motion to
                      stay in motion.
                    </p>
                    <div className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] p-4 rounded-lg aspect-video flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Physics illustration
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <motion.div variants={fadeInUp} className="text-center pt-4">
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                asChild
              >
                <Link href="/login" aria-label="Try Notes from Class">
                  Try Now
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Trusted by Companies Section */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="text-center space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Trusted by Companies
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 w-24 bg-[var(--klutr-text-primary-light)]/20 dark:bg-[var(--klutr-text-primary-dark)]/20 rounded"
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                What users say
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full border-[var(--klutr-outline)]/20">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-[var(--klutr-coral)]/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-[var(--klutr-coral)]">
                            {testimonial.name[0]}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {testimonial.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.username}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                        {testimonial.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? "fill-[var(--klutr-coral)] text-[var(--klutr-coral)]"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Large CTA Section */}
        <section className="bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="max-w-4xl mx-auto text-center space-y-8"
            >
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-[var(--klutr-coral)]/20 to-[var(--klutr-mint)]/20 rounded-2xl flex items-center justify-center">
                  <Code className="w-16 h-16 text-[var(--klutr-coral)]" />
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Ready to take your notes to the next level?
              </h2>
              <p className="text-lg md:text-xl text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 max-w-2xl mx-auto">
                Join thousands of users who are already clearing the clutr and
                keeping their spark alive.
              </p>
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white text-lg px-8 py-6 rounded-full"
                asChild
              >
                <Link href="/login" aria-label="Get started with Klutr">
                  Try Now
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              initial: { opacity: 0 },
              animate: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
            className="grid md:grid-cols-2 gap-12"
          >
            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm text-[var(--klutr-coral)] font-medium">
                  / get in touch /
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  We are always ready to help you and answer your question
                </h2>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Call Center
                  </h3>
                  <div className="space-y-2 text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      000 987 654 321
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      +(123) 456-789-876
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Email
                  </h3>
                  <p className="flex items-center gap-2 text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                    <Mail className="w-4 h-4" />
                    hello@klutr.com
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                    Social Network
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)]"
                      aria-label="Discord"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="border-[var(--klutr-outline)]/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Tell us your goals and what note taking means to you
                      </Label>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          className="border-[var(--klutr-outline)]/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="border-[var(--klutr-outline)]/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Your message..."
                          className="min-h-32 border-[var(--klutr-outline)]/30"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Beta CTA Banner */}
        <section className="bg-[var(--klutr-mint)] dark:bg-[var(--klutr-mint)] text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                Free Beta now open
              </h2>
              <p className="text-lg md:text-xl opacity-90">
                Join early users and help shape the future of note-taking. No
                credit card required. Just dump your thoughts and watch the
                magic.
              </p>
              <Button
                size="lg"
                className="bg-[var(--klutr-coral)] hover:bg-[var(--klutr-coral)]/90 text-white"
                asChild
              >
                <Link href="/login" aria-label="Get started with free beta">
                  Get Started Free
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background dark:bg-[var(--klutr-surface-dark)] border-t border-[var(--klutr-outline)]/20 py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="space-y-4">
                {mounted && (
                  <Image
                    src={
                      isDark
                        ? "/logos/klutr-logo-dark.svg"
                        : "/logos/klutr-logo-light.svg"
                    }
                    alt="Klutr"
                    width={200}
                    height={67}
                    className="h-10 w-auto"
                  />
                )}
                <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                  Clear the clutr. Keep the spark.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Product
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="#features"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Company
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="#about"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#discover"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                    >
                      Discover
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  Legal
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-[var(--klutr-outline)]/20 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70">
                &copy; {new Date().getFullYear()} Klutr. All rights reserved.
              </p>
              <Link
                href="/privacy"
                className="text-sm text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 hover:text-[var(--klutr-coral)] transition-colors"
              >
                Privacy policy
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
