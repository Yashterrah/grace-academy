import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8 text-teal-600" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
