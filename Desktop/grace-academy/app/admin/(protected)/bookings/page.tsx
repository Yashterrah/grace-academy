"use client";

import * as React from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { listBookings, updateBookingStatus } from "@/firebase/firestore";
import { formatKes } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

const STATUS_OPTIONS: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [bookings, setBookings] = React.useState<(Booking & { id: string })[]>([]);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    listBookings().then((b) => {
      setBookings(b);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    setUpdatingId(id);
    await updateBookingStatus(id, status);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    setUpdatingId(null);
  };

  return (
    <div>
      <AdminPageHeader title="Bookings" description={`${bookings.length} total bookings`} />

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-6 w-6 text-teal-600" />
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-slate-200 bg-white shadow-card">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-teal-700">{b.reference}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{b.studentName}</p>
                    <p className="text-xs text-slate-500">Ref: {b.studentReference}</p>
                  </td>
                  <td className="px-4 py-3">
                    {b.gradeLabel}
                    <p className="text-xs text-slate-500">
                      {b.time} · {b.day}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatKes(b.fee)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      disabled={updatingId === b.id}
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
