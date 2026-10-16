"use client";

import { IconWifiOff } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { Brand } from "@/components/brand";
import { ProgressSegments } from "@/components/progress-segments";
import { Button } from "@/components/ui/button";
import { SLIDE_COUNT } from "@/lib/constants";
import { readOnboardingSlide, writeOnboardingSlide } from "@/lib/history";
import { SLIDES } from "@/lib/slides";

export interface OnboardingSliderProps {
  onComplete: () => void;
}

/**
 * The brief introduction to the biblical basis for casting lots.
 *
 * Two details matter: Skip is always visible rather than hidden behind a
 * gesture, and the reading frame reserves a fixed slot for the Scripture quote
 * so the layout does not jump as you move between slides with and without a
 * verse.
 */
export function OnboardingSlider({ onComplete }: OnboardingSliderProps) {
  const [index, setIndex] = useState(0);

  // Resumes mid-intro after a refresh, read in an effect so SSR stays stable.
  useEffect(() => {
    setIndex(readOnboardingSlide(SLIDE_COUNT));
  }, []);

  const goTo = useCallback((next: number) => {
    const bounded = Math.min(Math.max(next, 0), SLIDE_COUNT - 1);
    setIndex(bounded);
    writeOnboardingSlide(bounded);
  }, []);

  const slide = SLIDES[index];
  if (!slide) return null;

  const isFirst = index === 0;
  const isLast = index === SLIDE_COUNT - 1;

  return (
    <div className="canvas-gradient flex min-h-dvh w-full flex-col px-5 pb-7 pt-4">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col">
        <div className="flex items-center justify-between">
          <Brand />
          <Button
            variant="ghost"
            size="md"
            className="-mr-2 px-2.5 font-medium"
            onClick={onComplete}
          >
            Skip
          </Button>
        </div>

        <ProgressSegments index={index} total={SLIDE_COUNT} />

        {/* Stable reading frame: the quote slot keeps the same height on every slide. */}
        <div className="rise-in mt-10 max-w-[33ch]" key={index}>
          <h1 className="font-serif text-[24px] font-semibold leading-[30px] tracking-[-0.015em] text-display">
            {slide.title}
          </h1>
          <p className="mt-4 text-[15.5px] leading-[26px] text-muted">
            {slide.body}
          </p>

          <div className="mt-8 min-h-[112px]">
            {slide.verse ? (
              <blockquote className="border-l-2 border-accent pl-3.5">
                <p className="font-serif text-[16.5px] italic leading-7 text-muted">
                  {slide.verse}
                </p>
              </blockquote>
            ) : null}
          </div>
        </div>

        <div className="mt-auto pt-8">
          <p className="flex items-start gap-2.5">
            <span aria-hidden="true">
              <IconWifiOff size={18} stroke={1.75} className="text-muted-soft" />
            </span>
            <span className="text-[13.5px] leading-5 text-muted">
              Works offline. Nothing leaves your device.
            </span>
          </p>

          <Button
            fullWidth
            className="mt-4"
            onClick={() => (isLast ? onComplete() : goTo(index + 1))}
          >
            {isLast ? "Get Started" : "Next"}
          </Button>

          {!isFirst ? (
            <Button
              variant="ghost"
              size="md"
              fullWidth
              className="mt-1 font-medium"
              onClick={() => goTo(index - 1)}
            >
              Previous
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
