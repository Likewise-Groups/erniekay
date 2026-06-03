"use client";

import { useEffect, useRef, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
}

export default function FadeIn({ children, className = "", delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("fade-in-hidden");

    const timeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.remove("fade-in-hidden");
            el.classList.add("fade-in-visible");
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
