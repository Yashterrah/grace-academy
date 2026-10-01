"use client";

import * as React from "react";
import Image from "next/image";
import { Check, X, ImageOff, Smartphone, Upload } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { listPayments, updatePaymentStatus } from "@/firebase/firestore";
import { formatKes } from "@/lib/utils";
import type { Payment } from "@/types";

export default function AdminPaymentsPage() {
  const [loading, setLoading] = React.useState(true);
  const [payments, setPayments] = React.useState<(Payment & { id: string })[]>([]);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "pending">("pending");

  React.useEffect(() => {
    listPayments().then((p) => {
      setPayments(p);
      setLoading(false);
    });
  }, []);

  const handleDecision = async (id: string, status: "confirmed" | "rejected") => {
    setUpdatingId(id);
    await updatePaymentStatus(id, status);
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    setUpdatingId(null);
  };

  const filtered = filter === "pending" ? payments.filter((p) => p.status === "pending") : payments;

  return (
    <div>
      <AdminPageHeader
        title="Payments"
        description={`${payments.filter((p) => p.status === "pending").length} awaiting review`}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("pending")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ${filter === "pending" ? "bg-teal-600 text-cream-50" : "bg-white text-slate-600 ring-1 ring-ink/10"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ${filter === "all" ? "bg-teal-600 text-cream-50" : "bg-white text-slate-600 ring-1 ring-ink/10"}`}
            >
              All
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-6 w-6 text-teal-600" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing here" description="No payments match this filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-card">
              <button
                type="button"
                onClick={() => p.proofUrl && setPreview(p.proofUrl)}
                className="flex h-40 w-full items-center justify-center bg-slate-50"
              >
                {p.proofUrl ? (
                  <Image
                    src={p.proofUrl}
                    alt={`Payment proof for ${p.studentName}`}
                    width={300}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    {p.method === "stk_push" ? (
                      <Smartphone className="h-6 w-6" />
                    ) : (
                      <ImageOff className="h-6 w-6" />
                    )}
                    <span className="text-xs">
                      {p.method === "stk_push" ? "STK Push payment" : "No screenshot"}
                    </span>
                  </div>
                )}
              </button>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{p.studentName}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">Booking: {p.bookingReference}</p>
                <p className="mt-2 font-body text-lg font-bold text-teal-700">{formatKes(p.amount)}</p>
                {p.mpesaReceiptNumber && (
                  <p className="mt-1 text-xs text-slate-500">Receipt: {p.mpesaReceiptNumber}</p>
                )}
                {p.mpesaMessage && (
                  <p className="mt-1 truncate text-xs text-slate-500" title={p.mpesaMessage}>
                    &ldquo;{p.mpesaMessage}&rdquo;
                  </p>
                )}
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  {p.method === "stk_push" ? (
                    <>
                      <Smartphone className="h-3 w-3" /> STK Push
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3" /> Manual upload
                    </>
                  )}
                </p>

                {p.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      disabled={updatingId === p.id}
                      onClick={() => handleDecision(p.id, "confirmed")}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-cream-50 hover:bg-teal-700 disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" /> Confirm
                    </button>
                    <button
                      disabled={updatingId === p.id}
                      onClick={() => handleDecision(p.id, "rejected")}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <Image
            src={preview}
            alt="Payment proof, full size"
            width={800}
            height={1000}
            className="max-h-[85vh] w-auto rounded-xl2 object-contain"
          />
        </div>
      )}
    </div>
  );
}
