"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

interface FeaturesProps {
  features: {
    id: number;
    icon: string; // Icon name as string (e.g., "MessageSquare", "Layers")
    title: string;
    description: string;
    image: string;
  }[];
  primaryColor?: string;
  progressGradientLight?: string;
  progressGradientDark?: string;
  headerBadge?: string;
  headerTitle?: string;
}

export function Features({
  features,
  primaryColor = "var(--klutr-coral)",
  progressGradientLight = "bg-gradient-to-r from-[var(--klutr-coral)]/80 to-[var(--klutr-coral)]",
  progressGradientDark = "dark:bg-gradient-to-r dark:from-[var(--klutr-coral)]/60 dark:to-[var(--klutr-coral)]/80",
  headerBadge,
  headerTitle,
}: FeaturesProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }, 200);
    }
  }, [progress, features.length]);

  useEffect(() => {
    const activeFeatureElement = featureRefs.current[currentFeature];
    const container = containerRef.current;
    if (activeFeatureElement && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeFeatureElement.getBoundingClientRect();
      container.scrollTo({
        left:
          activeFeatureElement.offsetLeft -
          (containerRect.width - elementRect.width) / 2,
        behavior: "smooth",
      });
    }
  }, [currentFeature]);

  const handleFeatureClick = (index: number) => {
    setCurrentFeature(index);
    setProgress(0);
  };

  return (
    <div className="min-h-screen py-16 px-4 bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(headerBadge || headerTitle) && (
          <div className="text-center mb-16">
            {headerBadge && (
              <span
                className="text-[var(--klutr-coral)] font-semibold text-sm uppercase tracking-wider"
              >
                {headerBadge}
              </span>
            )}
            {headerTitle && (
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] mt-4 mb-6">
                {headerTitle}
              </h2>
            )}
          </div>
        )}
        <div className="grid lg:grid-cols-2 lg:gap-16 gap-8 items-center">
          {/* Left Side - Features with Progress Lines */}
          <div
            ref={containerRef}
            className="lg:space-y-8 md:space-x-6 lg:space-x-0 overflow-x-auto overflow-hidden no-scrollbar lg:overflow-visible flex lg:flex lg:flex-col flex-row order-1 pb-4 scroll-smooth"
          >
            {features.map((feature, index) => {
              // Get icon component from lucide-react by name
              const IconComponent = (LucideIcons as any)[feature.icon] as React.ElementType;
              const Icon = IconComponent || LucideIcons.MessageSquare; // Fallback icon
              const isActive = currentFeature === index;

              return (
                <div
                  key={feature.id}
                  ref={(el) => {
                    featureRefs.current[index] = el;
                  }}
                  className="relative cursor-pointer flex-shrink-0"
                  onClick={() => handleFeatureClick(index)}
                >
                  {/* Feature Content */}
                  <div
                    className={`
                    flex lg:flex-row flex-col items-start space-x-4 p-3 max-w-sm md:max-w-sm lg:max-w-2xl transition-all duration-300
                    ${
                      isActive
                        ? " bg-white dark:bg-[var(--klutr-surface-dark)] md:shadow-xl dark:drop-shadow-lg rounded-xl md:border dark:border-[var(--klutr-outline)]/20 border-[var(--klutr-outline)]/20 "
                        : " "
                    }
                  `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                      p-3 hidden md:block rounded-full transition-all duration-300
                      ${
                        isActive
                          ? `bg-[var(--klutr-coral)] text-white`
                          : `bg-[var(--klutr-coral)]/10 dark:bg-[var(--klutr-surface-dark)] text-[var(--klutr-coral)]`
                      }
                    `}
                    >
                      <Icon size={24} />
                    </div>
                    {/* Content */}
                    <div className="flex-1">
                      <h3
                        className={`
                        text-lg md:mt-4 lg:mt-0 font-semibold mb-2 transition-colors duration-300
                        ${
                          isActive
                            ? "text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]"
                            : "text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/80"
                        }
                      `}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`
                        transition-colors duration-300 text-sm
                        ${
                          isActive
                            ? "text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/60"
                            : "text-[var(--klutr-text-primary-light)]/50 dark:text-[var(--klutr-text-primary-dark)]/40"
                        }
                      `}
                      >
                        {feature.description}
                      </p>
                      <div className="mt-4 bg-white dark:bg-[var(--klutr-surface-dark)] rounded-sm h-1 overflow-hidden">
                        {isActive && (
                          <motion.div
                            className={`h-full ${progressGradientLight} ${progressGradientDark}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1, ease: "linear" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Right Side - Image Display */}
          <div className="relative order-1 max-w-lg mx-auto lg:order-2">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <Image
                className="rounded-2xl border dark:border-[var(--klutr-outline)]/20 border-[var(--klutr-outline)]/20 shadow-lg dark:drop-shadow-lg"
                src={features[currentFeature].image}
                alt={features[currentFeature].title}
                width={600}
                height={400}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

