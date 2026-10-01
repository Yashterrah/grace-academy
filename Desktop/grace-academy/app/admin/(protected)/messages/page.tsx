"use client";

import * as React from "react";
import { Mail, Phone, CheckCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { listContactMessages, updateContactMessageStatus } from "@/firebase/firestore";
import type { ContactMessage } from "@/types";

export default function AdminMessagesPage() {
  const [loading, setLoading] = React.useState(true);
  const [messages, setMessages] = React.useState<(ContactMessage & { id: string })[]>([]);

  React.useEffect(() => {
    listContactMessages().then((m) => {
      setMessages(m);
      setLoading(false);
    });
  }, []);

  const markResponded = async (id: string) => {
    await updateContactMessageStatus(id, "responded");
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: "responded" } : m)));
  };

  React.useEffect(() => {
    // Mark "new" messages as "read" once the admin has opened this page and
    // had a moment to see them — doesn't overwrite already-responded ones.
    const unread = messages.filter((m) => m.status === "new");
    if (unread.length === 0) return;
    const timer = setTimeout(() => {
      unread.forEach((m) => updateContactMessageStatus(m.id, "read"));
      setMessages((prev) => prev.map((m) => (m.status === "new" ? { ...m, status: "read" } : m)));
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div>
      <AdminPageHeader title="Messages" description={`${messages.length} contact form submissions`} />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-6 w-6 text-teal-600" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState title="No messages yet" />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl2 border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {m.email}
                    </span>
                    {m.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {m.phone}
                      </span>
                    )}
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </div>
              <p className="mt-3 font-medium text-slate-900">{m.subject}</p>
              <p className="mt-1 text-sm text-slate-600">{m.message}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {new Date(m.createdAt).toLocaleString("en-KE")}
                </p>
                {m.status !== "responded" && (
                  <button
                    onClick={() => markResponded(m.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark responded
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
