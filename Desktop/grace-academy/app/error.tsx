"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-ink-faint">
        Sorry about that — an unexpected error occurred while loading this page. You can try
        again, or reach us directly on WhatsApp if the problem continues.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Button href="/contact" variant="secondary">
          Contact Us
        </Button>
      </div>
    </div>
  );
}
