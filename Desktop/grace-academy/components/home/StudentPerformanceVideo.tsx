"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

interface StudentPerformanceVideoProps {
  /** YouTube URL (https://youtu.be/xxx or https://www.youtube.com/watch?v=xxx)
   *  OR Vimeo URL (https://vimeo.com/xxx)
   *  OR a direct Cloudinary video URL (https://res.cloudinary.com/...) */
  videoUrl: string;
  studentName: string;
  grade: string;
  piece: string;
}

function getEmbedUrl(url: string): { type: "youtube" | "vimeo" | "direct"; src: string } {
  // YouTube short link
  const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (ytShort) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytShort[1]}?rel=0&modestbranding=1`,
    };
  }
  // YouTube full link
  const ytFull = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (ytFull) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${ytFull[1]}?rel=0&modestbranding=1`,
    };
  }
  // Vimeo
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeo[1]}?dnt=1`,
    };
  }
  // Cloudinary or any other direct video file
  return { type: "direct", src: url };
}

export function StudentPerformanceVideo({
  videoUrl,
  studentName,
  grade,
  piece,
}: StudentPerformanceVideoProps) {
  const [playing, setPlaying] = React.useState(false);
  const embed = getEmbedUrl(videoUrl);

  return (
    <Reveal>
      <div className="overflow-hidden rounded-xl2 border border-ink/[0.06] bg-white shadow-card">
        {/* Video player */}
        <div className="relative aspect-video w-full bg-surface-night">
          {!playing && (
            <button
              type="button"
              aria-label="Play student performance video"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-night/80 transition-colors hover:bg-surface-night/60"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-teal-900 shadow-glow transition-transform hover:scale-105">
                <Play className="h-7 w-7 fill-current" />
              </span>
              <span className="text-sm font-medium text-cream-50">Watch the performance</span>
            </button>
          )}

          {playing &&
            (embed.type === "direct" ? (
              <video
                src={embed.src}
                autoPlay
                controls
                className="h-full w-full object-cover"
                aria-label={`${studentName} performing ${piece}`}
              />
            ) : (
              <iframe
                src={embed.src}
                title={`${studentName} performing ${piece}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            ))}
        </div>

        {/* Caption */}
        <div className="px-5 py-4">
          <p className="font-display text-base text-ink">
            {studentName}
            <span className="mx-2 text-ink-faint">·</span>
            <span className="italic text-ink-soft">{piece}</span>
          </p>
          <p className="mt-1 text-xs text-ink-faint">{grade} · Grace Muigai Music Academy</p>
        </div>
      </div>
    </Reveal>
  );
}
