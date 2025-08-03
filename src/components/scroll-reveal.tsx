"use client";

import { ReactNode, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const [mounted, setMounted] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // Animate only once
    threshold: threshold,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by ensuring consistent initial state
  const shouldAnimate = mounted && inView;

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-in-out",
        shouldAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
