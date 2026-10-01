"use client";

import * as React from "react";
import { Search, ChevronDown, ChevronUp, Save, CheckCircle2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { listStudents, updateStudentNotes } from "@/firebase/firestore";
import { getGradeSchedule } from "@/lib/constants";
import type { Student } from "@/types";

export default function AdminStudentsPage() {
  const [loading, setLoading] = React.useState(true);
  const [students, setStudents] = React.useState<(Student & { id: string })[]>([]);
  const [search, setSearch] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [savedId, setSavedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    listStudents().then((s) => {
      setStudents(s);
      // Pre-populate the notes state with existing notes from Firestore
      const initialNotes: Record<string, string> = {};
      s.forEach((student) => {
        if (student.id) {
          initialNotes[student.id] = student.progressNotes ?? "";
        }
      });
      setNotes(initialNotes);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter((s) =>
    [s.fullName, s.parentName, s.parentPhone, s.reference, s.school]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSaveNotes = async (student: Student & { id: string }) => {
    setSavingId(student.id);
    try {
      await updateStudentNotes(student.id, notes[student.id] ?? "");
      setSavedId(student.id);
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Students"
        description={`${students.length} registered — School & Adult Classes combined`}
      />

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or reference..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-6 w-6 text-teal-600" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No students found" description="Try a different search term." />
      ) : (
        <div className="space-y-2">
          {filtered.map((s) => {
            const isExpanded = expandedId === s.id;
            return (
              <div
                key={s.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Row header - always visible */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
                >
                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="truncate font-medium text-slate-900">{s.fullName}</p>
                      <p className="text-xs text-slate-500">Age {s.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">
                        {s.program === "adult"
                          ? "Adult Classes"
                          : getGradeSchedule(s.grade)?.label ?? s.grade}
                      </p>
                      <p className="text-xs text-slate-400">{s.county}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm text-slate-700">{s.parentPhone}</p>
                      <p className="text-xs text-slate-400">{s.parentName}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-mono text-sm font-medium text-teal-700">{s.reference}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(s.createdAt).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
                  ) : (
                    <ChevronDown className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
                  )}
                </button>

                {/* Expanded detail panel with progress notes */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Student details */}
                      <div className="space-y-2 text-sm">
                        <p className="font-semibold text-slate-700">Student details</p>
                        <p className="text-slate-600">
                          <span className="text-slate-400">School: </span>
                          {s.school ?? "—"}
                        </p>
                        <p className="text-slate-600">
                          <span className="text-slate-400">Email: </span>
                          {s.parentEmail ?? "—"}
                        </p>
                        {s.notes && (
                          <p className="text-slate-600">
                            <span className="text-slate-400">Registration note: </span>
                            {s.notes}
                          </p>
                        )}
                      </div>

                      {/* Progress notes — admin-only, never visible to parents */}
                      <div>
                        <label
                          htmlFor={`notes-${s.id}`}
                          className="mb-1.5 block text-sm font-semibold text-slate-700"
                        >
                          Progress notes
                          <span className="ml-2 text-xs font-normal text-slate-400">
                            (admin only — not visible to parents)
                          </span>
                        </label>
                        <textarea
                          id={`notes-${s.id}`}
                          rows={4}
                          placeholder="e.g. Strong on folksongs, needs recorder fingering work. Preparing for zonal festival..."
                          value={notes[s.id] ?? ""}
                          onChange={(e) =>
                            setNotes((prev) => ({ ...prev, [s.id]: e.target.value }))
                          }
                          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(s)}
                          disabled={savingId === s.id}
                          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
                        >
                          {savingId === s.id ? (
                            <Spinner className="h-3.5 w-3.5" />
                          ) : savedId === s.id ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <Save className="h-3.5 w-3.5" />
                          )}
                          {savedId === s.id ? "Saved!" : "Save Notes"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
