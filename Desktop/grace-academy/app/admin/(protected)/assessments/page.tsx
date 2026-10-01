"use client";

import * as React from "react";
import { Plus, Share2, CheckCircle2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  listAllAssessments,
  createLessonAssessment,
  shareAssessmentWithParent,
} from "@/firebase/firestore.assessments";
import { listStudents } from "@/firebase/firestore";
import type { LessonAssessment } from "@/types/assessment.types";
import type { Student } from "@/types";

const SCORE_COLORS: Record<number, string> = {
  10: "bg-teal-600", 9: "bg-teal-500", 8: "bg-teal-400",
  7: "bg-azure-400", 6: "bg-azure-300", 5: "bg-gold-400",
  4: "bg-gold-500", 3: "bg-red-400", 2: "bg-red-500", 1: "bg-red-600",
};

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = React.useState<(LessonAssessment & { id: string })[]>([]);
  const [students, setStudents] = React.useState<(Student & { id: string })[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [sharingId, setSharingId] = React.useState<string | null>(null);

  // New assessment form state
  const [form, setForm] = React.useState({
    studentId: "", studentName: "", studentReference: "", grade: "",
    lessonNumber: 1, holiday: "Holiday 1, 2026",
    date: new Date().toISOString().slice(0, 10),
    score: 7, topic: "", strengths: "", areasToImprove: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    Promise.all([listAllAssessments(), listStudents()]).then(([a, s]) => {
      setAssessments(a);
      setStudents(s);
      setLoading(false);
    });
  }, []);

  const filtered = assessments.filter((a) =>
    [a.studentName, a.grade, a.holiday, a.topic]
      .some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStudentSelect = (studentId: string) => {
    const s = students.find((st) => st.id === studentId);
    if (!s) return;
    setForm((prev) => ({
      ...prev,
      studentId: s.id,
      studentName: s.fullName,
      studentReference: s.reference,
      grade: s.grade ?? "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.topic) return;
    setSubmitting(true);
    try {
      await createLessonAssessment({
        ...form,
        sharedWithParent: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const updated = await listAllAssessments();
      setAssessments(updated);
      setShowForm(false);
      setForm((prev) => ({ ...prev, topic: "", strengths: "", areasToImprove: "", score: 7, lessonNumber: prev.lessonNumber + 1 }));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async (id: string) => {
    setSharingId(id);
    try {
      await shareAssessmentWithParent(id);
      setAssessments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, sharedWithParent: true } : a))
      );
    } finally {
      setSharingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Lesson Assessments"
        description={`${assessments.length} assessments recorded`}
        action={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Record Assessment
          </button>
        }
      />

      {/* New assessment form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-teal-100 bg-teal-50 p-5 space-y-4"
        >
          <h3 className="font-semibold text-slate-900">New Lesson Assessment</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Student *</label>
              <select
                required
                value={form.studentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} — {s.grade ?? "Adult"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Holiday / Term *</label>
              <input
                required
                value={form.holiday}
                onChange={(e) => setForm((p) => ({ ...p, holiday: e.target.value }))}
                placeholder="e.g. Holiday 1, 2026"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Lesson Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Lesson #</label>
              <input
                type="number"
                min={1}
                value={form.lessonNumber}
                onChange={(e) => setForm((p) => ({ ...p, lessonNumber: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Topic covered *</label>
            <input
              required
              value={form.topic}
              onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
              placeholder="e.g. Set piece bars 1–16, recorder fingering for G major"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Score slider */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Score *</span>
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${SCORE_COLORS[form.score] ?? "bg-slate-400"}`}
              >
                {form.score}
              </span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={form.score}
              onChange={(e) => setForm((p) => ({ ...p, score: Number(e.target.value) }))}
              className="w-full accent-teal-600"
            />
            <div className="mt-1 flex justify-between text-[0.65rem] text-slate-400">
              <span>1 — Needs work</span>
              <span>5 — Average</span>
              <span>10 — Excellent</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Strengths</label>
              <textarea
                rows={3}
                value={form.strengths}
                onChange={(e) => setForm((p) => ({ ...p, strengths: e.target.value }))}
                placeholder="What the student did well..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Areas to improve</label>
              <textarea
                rows={3}
                value={form.areasToImprove}
                onChange={(e) => setForm((p) => ({ ...p, areasToImprove: e.target.value }))}
                placeholder="What to focus on next lesson..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {submitting ? <Spinner className="h-4 w-4" /> : null}
              {submitting ? "Saving..." : "Save Assessment"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, grade, topic..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner className="h-6 w-6 text-teal-600" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No assessments yet"
          description='Click "Record Assessment" above to add the first one.'
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id ?? null)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-slate-50"
              >
                {/* Score badge */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${SCORE_COLORS[a.score] ?? "bg-slate-400"}`}
                >
                  {a.score}
                </span>

                <div className="min-w-0 flex-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div>
                    <p className="truncate font-medium text-slate-900">{a.studentName}</p>
                    <p className="text-xs text-slate-500">{a.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">Lesson {a.lessonNumber}</p>
                    <p className="text-xs text-slate-400">{a.holiday}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="truncate text-sm text-slate-700">{a.topic}</p>
                    <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString("en-KE")}</p>
                  </div>
                  <div className="hidden sm:flex items-center">
                    {a.sharedWithParent ? (
                      <span className="inline-flex items-center gap-1 text-xs text-teal-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Shared with parent
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Private</span>
                    )}
                  </div>
                </div>

                {expandedId === a.id
                  ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                  : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />}
              </button>

              {expandedId === a.id && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {a.strengths && (
                      <div>
                        <p className="mb-1 text-xs font-semibold text-teal-700">Strengths</p>
                        <p className="text-sm text-slate-700">{a.strengths}</p>
                      </div>
                    )}
                    {a.areasToImprove && (
                      <div>
                        <p className="mb-1 text-xs font-semibold text-gold-600">Areas to improve</p>
                        <p className="text-sm text-slate-700">{a.areasToImprove}</p>
                      </div>
                    )}
                  </div>

                  {!a.sharedWithParent && (
                    <button
                      type="button"
                      disabled={sharingId === a.id}
                      onClick={() => a.id && handleShare(a.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 disabled:opacity-60"
                    >
                      {sharingId === a.id ? <Spinner className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                      Share with parent / student
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
