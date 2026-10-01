"use client";

import * as React from "react";
import { Save, CheckCircle2, AlertCircle, Calendar, Bell, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { getSiteSettings, saveSiteSettings, type SiteSettings } from "@/firebase/firestore";

const DEFAULT_SETTINGS: SiteSettings = {
  onlineClassesStart: "2026-10-10",
  enrollmentOpen: true,
  announcement: "",
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [settings, setSettings] = React.useState<SiteSettings>(DEFAULT_SETTINGS);

  React.useEffect(() => {
    getSiteSettings()
      .then((s) => { setSettings(s); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="h-6 w-6 text-teal-600" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage term dates, enrollment status, and site announcements"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <h2 className="font-semibold text-slate-900">Online Classes Start Date</h2>
          </div>
          <p className="mb-3 text-sm text-slate-500">
            Drives the countdown timer on the homepage. Update at the start of each new term.
          </p>
          <input
            type="date"
            value={settings.onlineClassesStart}
            onChange={(e) => setSettings((s) => ({ ...s, onlineClassesStart: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <p className="mt-2 text-xs text-slate-400">
            Currently: <strong>{new Date(settings.onlineClassesStart).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</strong>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            {settings.enrollmentOpen
              ? <ToggleRight className="h-5 w-5 text-teal-600" />
              : <ToggleLeft className="h-5 w-5 text-slate-400" />}
            <h2 className="font-semibold text-slate-900">Enrollment Status</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500">
            When closed, a banner tells visitors that enrollment is not currently open.
          </p>
          <button
            type="button"
            onClick={() => setSettings((s) => ({ ...s, enrollmentOpen: !s.enrollmentOpen }))}
            className={`flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold transition-colors ${
              settings.enrollmentOpen ? "bg-teal-600 text-white hover:bg-teal-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {settings.enrollmentOpen ? "Enrollment is OPEN" : "Enrollment is CLOSED"}
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal-600" />
            <h2 className="font-semibold text-slate-900">Site Announcement Banner</h2>
          </div>
          <p className="mb-3 text-sm text-slate-500">
            Appears at the top of every page. Leave blank to hide. Use for term notices, holiday closures, or events.
          </p>
          <textarea
            rows={3}
            value={settings.announcement}
            onChange={(e) => setSettings((s) => ({ ...s, announcement: e.target.value }))}
            placeholder='e.g. "Enrolment for Term 3 is now open! Classes begin 7 August."'
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          {settings.announcement && (
            <div className="mt-3 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
              <span className="font-semibold">Preview: </span>{settings.announcement}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {saving ? <Spinner className="h-4 w-4" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
        {error && (
          <p className="flex items-center gap-2 text-sm font-medium text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}
      </div>
    </div>
  );
}
