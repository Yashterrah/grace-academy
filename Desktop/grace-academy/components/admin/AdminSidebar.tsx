"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  MessageSquare,
  ClipboardCheck,
  Award,
  Settings,
  LogOut,
  Music2,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { SITE } from "@/lib/constants";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/admin/exams", label: "Holiday Exams", icon: Award },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAdminAuth();

  return (
    <aside className="flex h-full w-full flex-col justify-between overflow-y-auto bg-[#0B1622] p-4 sm:p-5">
      <div>
        <div className="flex items-center gap-2.5 px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500 text-white">
            <Music2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-white">
              {SITE.shortName} Admin
            </p>
            <p className="truncate text-[0.7rem] text-white/40">{user?.email}</p>
          </div>
        </div>

        <nav className="mt-6 space-y-0.5" aria-label="Admin navigation">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white/90"
                )}
              >
                <Icon
                  className={cn("h-4 w-4 shrink-0", active ? "text-teal-400" : "text-white/40")}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-white/10 pt-4">
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/40 hover:bg-white/5 hover:text-white/70"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            View Blog
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-0.5 border-t border-white/10 pt-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 hover:bg-white/5 hover:text-white/90"
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-white/40" />
          View live site
        </Link>
        <button
          onClick={async () => {
            await signOut();
            router.replace("/admin/login");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
