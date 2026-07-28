import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StaffLineDivider } from "@/components/motion/StaffLineDivider";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
        <Music2 className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        This page hit a wrong note.
      </h1>
      <p className="mt-3 max-w-md text-ink-faint">
        We couldn&apos;t find the page you were looking for. Let&apos;s get you back on tempo.
      </p>
      <div className="mt-6 w-full max-w-xs">
        <StaffLineDivider tone="teal" />
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button href="/">Back to Home</Button>
        <Button href="/contact" variant="secondary">
          Contact Us
        </Button>
      </div>
    </div>
  );
}
