"use client";

import * as React from "react";
import Link from "next/link";
import { Users, CalendarCheck, Wallet, MessageSquare, ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import {
  listStudents,
  listBookings,
  listPayments,
  listContactMessages,
} from "@/firebase/firestore";
import { formatKes } from "@/lib/utils";
import type { Booking, ContactMessage, Payment, Student } from "@/types";

export default function AdminDashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [students, setStudents] = React.useState<(Student & { id: string })[]>([]);
  const [bookings, setBookings] = React.useState<(Booking & { id: string })[]>([]);
  const [payments, setPayments] = React.useState<(Payment & { id: string })[]>([]);
  const [messages, setMessages] = React.useState<(ContactMessage & { id: string })[]>([]);

  React.useEffect(() => {
    (async () => {
      const [s, b, p, m] = await Promise.all([
        listStudents(),
        listBookings(),
        listPayments(),
        listContactMessages(),
      ]);
      setStudents(s);
      setBookings(b);
      setPayments(p);
      setMessages(m);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-6 w-6 text-teal-600" />
      </div>
    );
  }

  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const unreadMessages = messages.filter((m) => m.status === "new").length;
  const confirmedRevenue = payments
    .filter((p) => p.status === "confirmed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, href: "/admin/students" },
    { label: "Total Bookings", value: bookings.length, icon: CalendarCheck, href: "/admin/bookings" },
    { label: "Pending Payments", value: pendingPayments, icon: Wallet, href: "/admin/payments" },
    { label: "Unread Messages", value: unreadMessages, icon: MessageSquare, href: "/admin/messages" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description={`Confirmed revenue to date: ${formatKes(confirmedRevenue)}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl2 border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </div>
              <p className="mt-4 font-body text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl2 border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="font-body text-base font-semibold text-slate-900">Recent bookings</h2>
          <div className="mt-4 space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-900">{b.studentName}</p>
                  <p className="text-xs text-slate-500">{b.gradeLabel}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
            {bookings.length === 0 && <p className="text-sm text-slate-500">No bookings yet.</p>}
          </div>
        </div>

        <div className="rounded-xl2 border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="font-body text-base font-semibold text-slate-900">Recent messages</h2>
          <div className="mt-4 space-y-3">
            {messages.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{m.name}</p>
                  <p className="truncate text-xs text-slate-500">{m.subject}</p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-slate-500">No messages yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
