"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Spinner } from "@/components/ui/Spinner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) router.replace("/admin/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="h-6 w-6 text-teal-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <div className="hidden w-60 shrink-0 lg:block">
        <div className="fixed h-screen w-60">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 max-w-[80%]">
            <AdminSidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <span className="text-sm font-semibold text-slate-800">Admin</span>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}