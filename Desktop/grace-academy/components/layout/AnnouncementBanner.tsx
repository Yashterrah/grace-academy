"use client";

import * as React from "react";
import { X, Megaphone } from "lucide-react";

interface AnnouncementBannerProps {
  message: string;
}

export function AnnouncementBanner({ message }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    const key = `announcement-dismissed-${message.slice(0, 20)}`;
    if (sessionStorage.getItem(key)) setDismissed(true);
  }, [message]);

  if (!message.trim() || dismissed) return null;

  return (
    <div className="relative z-50 bg-gold-400 px-4 py-2.5">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-teal-900">
          <Megaphone className="h-4 w-4 shrink-0" aria-hidden />
          <span>{message}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            const key = `announcement-dismissed-${message.slice(0, 20)}`;
            sessionStorage.setItem(key, "1");
          }}
          aria-label="Dismiss announcement"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-teal-900/10"
        >
          <X className="h-3.5 w-3.5 text-teal-900" />
        </button>
      </div>
    </div>
  );
}
