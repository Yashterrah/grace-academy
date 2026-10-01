"use client";

import * as React from "react";
import { Plus, Award, ExternalLink, Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  listAllHolidayExams,
  createHolidayExam,
  markExamCertificateIssued,
} from "@/firebase/firestore.assessments";
import { listStudents } from "@/firebase/firestore";
import type { HolidayExam } from "@/types/assessment.types";
import type { Student } from "@/types";

const RESULT_STYLES = {
  passed: "bg-teal-50 text-teal-700 ring-teal-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  pending: "bg-gold-50 text-gold-700 ring-gold-200",
};

export default function AdminHolidayExamsPage() {
  const [exams, setExams] = React.useState<(HolidayExam & { id: string })[]>([]);
  const [students, setStudents] = React.useState<(Student & { id: string })[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [issuingId, setIssuingId] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    studentId: "", studentName: "", studentReference: "", grade: "",
    holiday: "Holiday 1, 2026",
    examDate: new Date().toISOString().slice(0, 10),
    totalScore: 70, passMark: 50, result: "pending" as HolidayExam["result"],
    notes: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    Promise.all([listAllHolidayExams(), listStudents()]).then(([e, s]) => {
      setExams(e);
      setStudents(s);
      setLoading(false);
    });
  }, []);

  const filtered = exams.filter((e) =>
    [e.studentName, e.grade, e.holiday]
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

  // Automatically derive pass/fail from score vs passMark
  const computedResult = (score: number, passMark: number): HolidayExam["result"] =>
    score >= passMark ? "passed" : "failed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId) return;
    setSubmitting(true);
    const result = computedResult(form.totalScore, form.passMark);
    try {
      await createHolidayExam({
        ...form,
        result,
        certificateIssued: false,
        sharedWithParent: false,
        createdAt: new Date().toISOString(),
      });
      const updated = await listAllHolidayExams();
      setExams(updated);
      setShowForm(false);
      setForm((p) => ({ ...p, notes: "", totalScore: 70, studentId: "" }));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueCertificate = async (exam: HolidayExam & { id: string }) => {
    setIssuingId(exam.id);
    try {
      await markExamCertificateIssued(exam.id);
      setExams((prev) =>
        prev.map((e) => (e.id === exam.id ? { ...e, certificateIssued: true } : e))
      );
      // Open the certificate in a new tab
      const url = `/api/certificate?name=${encodeURIComponent(exam.studentName)}&grade=${encodeURIComponent(exam.grade)}&holiday=${encodeURIComponent(exam.holiday)}&score=${exam.totalScore}&date=${exam.examDate}`;
      window.open(url, "_blank");
    } finally {
      setIssuingId(null);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Holiday Exams"
        description={`${exams.length} exam records · ${exams.filter((e) => e.result === "passed").length} passed`}
        action={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Record Exam
          </button>
        }
      />

      {/* New exam form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-teal-100 bg-teal-50 p-5 space-y-4"
        >
          <h3 className="font-semibold text-slate-900">New Holiday Exam Record</h3>

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
              <label className="mb-1 block text-xs font-semibold text-slate-600">Exam Date *</label>
              <input
                type="date"
                required
                value={form.examDate}
                onChange={(e) => setForm((p) => ({ ...p, examDate: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Score (out of 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={form.totalScore}
                  onChange={(e) => setForm((p) => ({ ...p, totalScore: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Pass mark</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={form.passMark}
                  onChange={(e) => setForm((p) => ({ ...p, passMark: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Auto-computed result preview */}
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm">
            <span className="text-slate-500">Result:</span>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ring-1 ${
                RESULT_STYLES[computedResult(form.totalScore, form.passMark)]
              }`}
            >
              {computedResult(form.totalScore, form.passMark).toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">
              ({form.totalScore} / {form.passMark} pass mark)
            </span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Examiner's notes on the student's performance..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !form.studentId}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {submitting ? <Spinner className="h-4 w-4" /> : null}
              {submitting ? "Saving..." : "Save Exam Record"}
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
          placeholder="Search by student, grade, holiday..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Spinner className="h-6 w-6 text-teal-600" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No exam records yet"
          description='Click "Record Exam" above to add the first end-of-holiday exam.'
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Holiday</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Certificate</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exam) => (
                <tr key={exam.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{exam.studentName}</p>
                    <p className="text-xs text-slate-500">{exam.grade}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{exam.holiday}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900">{exam.totalScore}</span>
                    <span className="text-slate-400"> / 100</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${
                        RESULT_STYLES[exam.result]
                      }`}
                    >
                      {exam.result}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {exam.certificateIssued ? (
                      <span className="text-xs text-teal-700">✓ Issued</span>
                    ) : (
                      <span className="text-xs text-slate-400">Not issued</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {exam.result === "passed" && (
                        <button
                          type="button"
                          disabled={issuingId === exam.id}
                          onClick={() => handleIssueCertificate(exam)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
                        >
                          {issuingId === exam.id ? (
                            <Spinner className="h-3 w-3" />
                          ) : (
                            <Award className="h-3 w-3" />
                          )}
                          {exam.certificateIssued ? "Re-print" : "Issue Certificate"}
                        </button>
                      )}
                      {exam.certificateIssued && (
                        <a
                          href={`/api/certificate?name=${encodeURIComponent(exam.studentName)}&grade=${encodeURIComponent(exam.grade)}&holiday=${encodeURIComponent(exam.holiday)}&score=${exam.totalScore}&date=${exam.examDate}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600"
                        >
                          <ExternalLink className="h-3 w-3" /> View
                        </a>
                      )}
                    </div>
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
