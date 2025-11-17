"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
  accentColor: string;
  visualType: 'chaos' | 'sort' | 'reject' | 'rediscover';
  tag: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Dump',
    description: 'Drop everything into your Stream. Text, voice, images—no formatting needed.',
    accentColor: '#FF6B6B', // Klutr coral
    visualType: 'chaos',
    tag: 'CAPTURE',
  },
  {
    number: 2,
    title: 'We sort',
    description: 'Automatic tagging and clustering. No organizational energy required from you.',
    accentColor: '#00C896', // Klutr mint
    visualType: 'sort',
    tag: 'ORGANIZE',
  },
  {
    number: 3,
    title: 'Nope the noise',
    description: "Quick rejection without guilt. Swipe away what doesn't serve you.",
    accentColor: '#FF6B6B', // Klutr coral
    visualType: 'reject',
    tag: 'FILTER',
  },
  {
    number: 4,
    title: 'Rediscover gems',
    description: 'Gentle resurfacing brings back forgotten ideas when you need them.',
    accentColor: '#00C896', // Klutr mint
    visualType: 'rediscover',
    tag: 'RESURFACE',
  },
];

const FloatingCard = ({ delay, x, y, accentColor }: { delay: number; x: number; y: number; accentColor: string }) => (
  <motion.div
    className="absolute w-8 h-8 rounded"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      backgroundColor: accentColor,
      opacity: 0.15,
    }}
    animate={{
      y: [0, -6, 0],
      opacity: [0.15, 0.3, 0.15],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

const ChaosVisual = ({ accentColor }: { accentColor: string }) => (
  <div className="relative w-full h-40 overflow-hidden">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-5 h-5 rounded"
        style={{
          left: `${15 + i * 7}%`,
          top: `${5 + (i % 4) * 12}%`,
          backgroundColor: accentColor,
          opacity: 0.4,
        }}
        animate={{
          y: [0, 50, 50],
          x: [0, (i % 2 === 0 ? -15 : 15), 0],
          opacity: [0.2, 0.7, 0.2],
          rotate: [0, (i % 2 === 0 ? 360 : -360)],
        }}
        transition={{
          duration: 2.5,
          delay: i * 0.1,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    ))}
  </div>
);

const SortVisual = ({ accentColor }: { accentColor: string }) => (
  <div className="relative w-full h-40 overflow-hidden">
    {[...Array(9)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-6 h-6 rounded"
        style={{
          left: `${10 + (i % 3) * 30}%`,
          top: `${15 + Math.floor(i / 3) * 30}%`,
          backgroundColor: accentColor,
          opacity: 0.3,
        }}
        animate={{
          scale: [0.5, 1, 1],
          opacity: [0.1, 0.7, 0.7],
          rotate: [45, 0, 0],
        }}
        transition={{
          duration: 1.8,
          delay: i * 0.12,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
    ))}
  </div>
);

const RejectVisual = ({ accentColor }: { accentColor: string }) => (
  <div className="relative w-full h-40 overflow-hidden">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-8 h-8 rounded"
        style={{
          left: `${15 + i * 12}%`,
          top: '45%',
          backgroundColor: accentColor,
          opacity: 0.5,
        }}
        animate={{
          x: [0, 120],
          opacity: [0.5, 0],
          rotate: [0, 30],
          scale: [1, 0.5],
        }}
        transition={{
          duration: 1.5,
          delay: i * 0.15,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
    ))}
  </div>
);

const RediscoverVisual = ({ accentColor }: { accentColor: string }) => (
  <div className="relative w-full h-40 overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-5 h-5 rounded"
        style={{
          left: `${8 + (i % 4) * 22}%`,
          top: `${15 + Math.floor(i / 4) * 25}%`,
          backgroundColor: accentColor,
          opacity: i === 5 ? 0.9 : 0.2,
        }}
        animate={
          i === 5
            ? {
                scale: [1, 1.5, 1.5],
                y: [0, -15, -15],
                opacity: [0.9, 1, 1],
                rotate: [0, 180, 180],
              }
            : {
                opacity: [0.2, 0.1, 0.1],
              }
        }
        transition={{
          duration: 2.2,
          delay: i === 5 ? 0.5 : 0,
          repeat: Infinity,
          repeatDelay: 1.8,
        }}
      />
    ))}
  </div>
);

const StepVisual = ({ type, accentColor }: { type: string; accentColor: string }) => {
  switch (type) {
    case 'chaos':
      return <ChaosVisual accentColor={accentColor} />;
    case 'sort':
      return <SortVisual accentColor={accentColor} />;
    case 'reject':
      return <RejectVisual accentColor={accentColor} />;
    case 'rediscover':
      return <RediscoverVisual accentColor={accentColor} />;
    default:
      return null;
  }
};

const BackgroundFragments = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <FloatingCard delay={0} x={10} y={15} accentColor="#FF6B6B" />
    <FloatingCard delay={0.8} x={85} y={25} accentColor="#00C896" />
    <FloatingCard delay={1.2} x={20} y={70} accentColor="#00C896" />
    <FloatingCard delay={1.8} x={75} y={80} accentColor="#FF6B6B" />
    <FloatingCard delay={2.2} x={50} y={10} accentColor="#FF6B6B" />
    <FloatingCard delay={2.8} x={40} y={90} accentColor="#00C896" />
    <FloatingCard delay={0.5} x={60} y={40} accentColor="#FF6B6B" />
    <FloatingCard delay={1.5} x={30} y={50} accentColor="#00C896" />
  </div>
);

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoPlayInterval = 4000;

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setActiveStep((prev) => (prev + 1) % steps.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress]);

  return (
    <section className="relative w-full min-h-screen py-20 px-4 bg-[var(--klutr-surface-light)] dark:bg-[var(--klutr-surface-dark)] overflow-hidden flex items-center">
      <BackgroundFragments />
      
      <div className="relative max-w-7xl mx-auto w-full">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)] mb-6">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-[var(--klutr-text-primary-light)]/60 dark:text-[var(--klutr-text-primary-dark)]/60 font-light">
            Four simple steps to organize your chaos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => {
                  setActiveStep(index);
                  setProgress(0);
                }}
              >
                <div
                  className={cn(
                    "relative p-6 rounded-xl border-2 transition-all duration-500",
                    index === activeStep
                      ? "bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] scale-105"
                      : "bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)] hover:bg-[var(--klutr-surface-light)] dark:hover:bg-[var(--klutr-surface-dark)]/80"
                  )}
                  style={{
                    borderColor: index === activeStep ? step.accentColor : 'rgba(43, 46, 63, 0.1)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                      style={{ 
                        backgroundColor: step.accentColor,
                        boxShadow: index === activeStep ? `0 0 30px ${step.accentColor}50` : 'none',
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {index <= activeStep ? '✓' : step.number}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          className="px-3 py-1 text-xs font-semibold border-0"
                          style={{
                            backgroundColor: `${step.accentColor}20`,
                            color: step.accentColor,
                          }}
                        >
                          {step.tag}
                        </Badge>
                        <h3 className="text-2xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="text-[var(--klutr-text-primary-light)]/70 dark:text-[var(--klutr-text-primary-dark)]/70 text-base leading-relaxed">
                        {step.description}
                      </p>

                      {/* Progress bar for active step */}
                      {index === activeStep && (
                        <motion.div
                          className="mt-4 h-1 rounded-full overflow-hidden"
                          style={{ backgroundColor: `${step.accentColor}20` }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ 
                              backgroundColor: step.accentColor,
                              width: `${progress}%`,
                            }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual Display */}
          <div className="relative">
            <motion.div
              className="sticky top-24"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card
                className={cn(
                  "relative border-2 p-8 rounded-3xl overflow-hidden min-h-[500px] flex items-center justify-center",
                  "bg-[var(--klutr-background)] dark:bg-[var(--klutr-surface-dark)]"
                )}
                style={{
                  borderColor: steps[activeStep].accentColor,
                  boxShadow: `0 0 50px ${steps[activeStep].accentColor}30`,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    className="w-full"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StepVisual 
                      type={steps[activeStep].visualType} 
                      accentColor={steps[activeStep].accentColor} 
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Ambient glow */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
                  style={{ backgroundColor: steps[activeStep].accentColor }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </Card>

              {/* Step indicator */}
              <div className="flex justify-center gap-3 mt-8">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveStep(index);
                      setProgress(0);
                    }}
                    className="relative w-12 h-1.5 rounded-full overflow-hidden transition-all"
                    style={{ 
                      backgroundColor: index === activeStep 
                        ? steps[index].accentColor 
                        : 'rgba(43, 46, 63, 0.2)',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

