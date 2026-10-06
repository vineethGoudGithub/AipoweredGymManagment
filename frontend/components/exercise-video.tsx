"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Play, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseVideoProps {
  path: string;
  className?: string;
  poster?: string;
}

export function ExerciseVideo({ path, className, poster }: ExerciseVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = entry.isIntersecting;
        setIsVisible(isIntersecting);

        if (isIntersecting && !hasLoadedOnce) {
          setHasLoadedOnce(true);
        }

        if (containerRef.current) {
          const videoEl = containerRef.current.querySelector("video");
          if (videoEl) {
            if (isIntersecting) {
              videoEl.play().catch(() => {});
            } else {
              videoEl.pause();
            }
          }
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasLoadedOnce]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden bg-slate-900 group", className)}>
      {/* Header Badge */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
        <Play className="h-3 w-3 text-primary" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Tutorial Available</span>
      </div>

      {/* Main Video */}
      {!hasError ? (
        hasLoadedOnce ? (
          <video
            src={`/videos/exercises/${path.replace(/^\/+/, '')}`}
            controls={true}
            autoPlay={isVisible}
            loop={true}
            muted={true}
            playsInline={true}
            crossOrigin="anonymous"
            preload="metadata"
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              console.log("Local video not found yet for:", path);
              setHasError(true);
              setIsLoading(false);
            }}
            className={cn(
              "h-full w-full object-contain transition-opacity duration-1000",
              isLoading ? "opacity-0" : "opacity-100"
            )}
          />
        ) : (
          <div className="h-full w-full bg-slate-900" />
        )
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center bg-secondary/10">
          <div className="relative">
            <AlertCircle className="h-12 w-12 text-primary/20" />
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary/80">Local Sync in Progress</p>
            <p className="mt-1 text-[10px] text-muted-foreground/60 px-6 max-w-[250px] mx-auto leading-relaxed">
              We are currently downloading this form demonstration directly to the local library. Please check back in a moment!
            </p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !hasError && hasLoadedOnce && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">Optimizing Video...</span>
        </div>
      )}
    </div>
  );
}
