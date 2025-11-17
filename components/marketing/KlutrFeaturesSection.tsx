"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  iconName: string;
  screenshot: string;
  screenshotAlt: string;
  color: "coral" | "mint";
  badges?: string[];
}

interface KlutrFeaturesSectionProps {
  features: Feature[];
  headline?: string;
  subheadline?: string;
  badgeLabel?: string;
}

interface ScreenshotProps {
  screenshot: string;
  screenshotAlt: string;
  color: "coral" | "mint";
}

const Screenshot: React.FC<ScreenshotProps> = ({ screenshot, screenshotAlt, color }) => {
  // Use Klutr brand colors - coral: #FF6B6B, mint: #00C896
  // For gradients, we'll use slightly darker/lighter variants
  const gradientClass = color === "coral" 
    ? "from-[#FF6B6B] to-[#FF8E53]" 
    : "from-[#00C896] to-[#00A67E]";

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
      {/* Gradient blur background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} blur-xl opacity-20`} />
      
      {/* Main gradient background */}
      <div className={`relative w-full h-full bg-gradient-to-br ${gradientClass} opacity-10 flex items-center justify-center`}>
        {/* Image container */}
        <div className="relative w-full h-full p-8 flex items-center justify-center">
          <Image
            src={screenshot}
            alt={screenshotAlt}
            width={600}
            height={450}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const isEven = index % 2 === 0;
  
  // Gradient backgrounds using Klutr colors
  const gradientClass = feature.color === "coral"
    ? "from-[#FF6B6B]/10 to-[#FF8E53]/10"
    : "from-[#00C896]/10 to-[#00A67E]/10";
  
  const iconBgClass = feature.color === "coral"
    ? "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53]"
    : "bg-gradient-to-br from-[#00C896] to-[#00A67E]";

  // Resolve icon component from string name
  const IconComponent = (LucideIcons as any)[feature.iconName];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className={cn(
        "overflow-hidden border-border/50 bg-gradient-to-br backdrop-blur-sm",
        gradientClass
      )}>
        <CardContent className="p-0">
          <div className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-8 p-8",
            isEven ? '' : 'lg:grid-flow-dense'
          )}>
            {/* Text Content */}
            <div className={cn(
              "flex flex-col justify-center space-y-6",
              isEven ? '' : 'lg:col-start-2'
            )}>
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg",
                  iconBgClass
                )}
              >
                {IconComponent && <IconComponent className="w-6 h-6" />}
              </motion.div>
              
              {/* Title and Description */}
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Badges */}
              {feature.badges && feature.badges.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {feature.badges.map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} variant="secondary" className="px-3 py-1">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Screenshot */}
            <motion.div
              className={cn(
                "flex items-center justify-center",
                isEven ? '' : 'lg:col-start-1 lg:row-start-1'
              )}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Screenshot 
                screenshot={feature.screenshot} 
                screenshotAlt={feature.screenshotAlt}
                color={feature.color} 
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const KlutrFeaturesSection: React.FC<KlutrFeaturesSectionProps> = ({
  features,
  headline,
  subheadline,
  badgeLabel = "Features",
}) => {
  return (
    <section className="w-full py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        {(headline || subheadline) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            {badgeLabel && (
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {badgeLabel}
              </Badge>
            )}
            {headline && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--klutr-text-primary-light)] dark:text-[var(--klutr-text-primary-dark)]">
                {headline.split(" ").map((word, i, arr) => {
                  const isGradient = i === arr.length - 1;
                  return isGradient ? (
                    <span key={i} className="bg-gradient-to-r from-[#FF6B6B] to-[#00C896] bg-clip-text text-transparent">
                      {word}
                    </span>
                  ) : (
                    <React.Fragment key={i}>{word} </React.Fragment>
                  );
                })}
              </h2>
            )}
            {subheadline && (
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Features Grid */}
        <div className="space-y-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default KlutrFeaturesSection;

