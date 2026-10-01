import { NextResponse } from "next/server";

/**
 * GET /api/certificate
 *
 * Holiday exam certificate:
 *   /api/certificate?name=Jane+Doe&grade=Grade+6&holiday=Holiday+1%2C+2026&score=78&date=2026-08-28
 *
 * Adult program certificate:
 *   /api/certificate?name=Jane+Doe&program=Adult+Music+Classes&sessions=12&date=2026-08-28
 *
 * Returns a printable page (the browser's "Save as PDF" produces the file).
 *
 * SECURITY: every value comes from the URL, so all of it is HTML-escaped
 * before being placed in the page. Never interpolate raw query values.
 */

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value: string | null, fallback: string, max = 80): string {
  return esc((value ?? fallback).trim().slice(0, max) || fallback);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = clean(searchParams.get("name"), "Student Name");
  const grade = clean(searchParams.get("grade"), "");
  const holiday = clean(searchParams.get("holiday"), "");
  const program = clean(searchParams.get("program"), "");
  const sessions = clean(searchParams.get("sessions"), "12", 4);
  const scoreRaw = Number(searchParams.get("score"));
  const score = Number.isFinite(scoreRaw) && scoreRaw > 0 ? Math.min(100, Math.round(scoreRaw)) : null;

  const dateRaw = searchParams.get("date") ?? new Date().toISOString().split("T")[0]!;
  const parsedDate = new Date(dateRaw);
  const formattedDate = esc(
    (Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );

  // Body wording depends on which kind of certificate this is
  const isExam = Boolean(holiday || grade) && !program;
  const bodyText = isExam
    ? `Has successfully completed <strong>${grade || "the course"}</strong> music lessons for
       <strong>${holiday || "the holiday programme"}</strong> and passed the end-of-holiday
       examination${score !== null ? ` with a score of <strong>${score}%</strong>` : ""}.`
    : `Has successfully completed the <strong>${program || "Music Program"}</strong> at
       Grace Muigai Music Academy, comprising <strong>${sessions} interactive sessions</strong>.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Certificate of Completion — ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f1f5f9; display: flex; align-items: center; justify-content: center;
      min-height: 100vh; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 32px; }
    .certificate { width: 800px; background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
    .top-band { background: linear-gradient(135deg, #0B4F4A 0%, #093F3B 60%, #2C2266 100%);
      padding: 28px 48px; display: flex; align-items: center; justify-content: space-between; }
    .academy-name { font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #FAF7F1; }
    .academy-tagline { font-size: 12px; color: rgba(250,247,241,0.65); margin-top: 2px; }
    .note { color: rgba(232,163,61,0.85); font-size: 36px; font-family: serif; }
    .body { padding: 44px 48px 36px; text-align: center; }
    .label { font-size: 11px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #0B4F4A; }
    .title { font-family: 'Fraunces', Georgia, serif; font-size: 36px; color: #12181B; margin: 10px 0 24px; }
    .awarded { font-size: 12px; color: #6B767C; text-transform: uppercase; letter-spacing: .15em; margin-bottom: 8px; }
    .student { font-family: 'Fraunces', Georgia, serif; font-size: 40px; font-style: italic; color: #0B4F4A;
      border-bottom: 2px solid #E8A33D; padding: 0 12px 14px; display: inline-block; min-width: 300px; margin-bottom: 26px; }
    .text { font-size: 15px; color: #3A444A; line-height: 1.7; max-width: 520px; margin: 0 auto 30px; }
    .text strong { color: #0B4F4A; }
    .footer { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 24px;
      padding-top: 22px; border-top: 1px solid #f1f5f9; }
    .sig { text-align: center; }
    .sig-line { width: 140px; height: 1px; background: #12181B; margin: 0 auto 4px; }
    .sig-name { font-family: 'Fraunces', Georgia, serif; font-size: 14px; font-style: italic; color: #12181B; }
    .sig-label { font-size: 10px; color: #6B767C; text-transform: uppercase; letter-spacing: .1em; }
    .seal { width: 76px; height: 76px; border-radius: 50%; border: 3px solid #E8A33D; display: flex;
      flex-direction: column; align-items: center; justify-content: center; color: #0B4F4A;
      font-size: 10px; font-weight: 600; letter-spacing: .05em; }
    .seal span { font-size: 22px; color: #E8A33D; line-height: 1; }
    .bar { height: 6px; background: linear-gradient(90deg, #E8A33D, #0B4F4A 55%, #2C2266); }
    @media print { body { background: white; padding: 0; } .certificate { box-shadow: none; border-radius: 0; } }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="top-band">
      <div>
        <div class="academy-name">Grace Muigai Music Academy</div>
        <div class="academy-tagline">Online CBC &amp; 8-4-4 Music Lessons · Kenya</div>
      </div>
      <div class="note">♩</div>
    </div>
    <div class="body">
      <p class="label">This is to certify that</p>
      <div class="title">Certificate of Completion</div>
      <p class="awarded">Awarded to</p>
      <div class="student">${name}</div>
      <p class="text">${bodyText}<br /><br />Awarded on <strong>${formattedDate}</strong>.</p>
      <div class="footer">
        <div class="sig"><div class="sig-line"></div>
          <div class="sig-name">Tr. Grace Muigai</div>
          <div class="sig-label">Music Teacher &amp; Director</div></div>
        <div class="seal"><span>♪</span>GMMA</div>
        <div class="sig"><div class="sig-line"></div>
          <div class="sig-name">${formattedDate}</div>
          <div class="sig-label">Date Awarded</div></div>
      </div>
    </div>
    <div class="bar"></div>
  </div>
  <script>window.onload = function () { setTimeout(function () { window.print(); }, 800); };</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
