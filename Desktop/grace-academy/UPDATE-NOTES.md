# UPDATE NOTES — read before deploying

This folder is the **complete project**: everything built since day one, merged
with your latest repo (commit `fec71e7`), and verified on **Next.js 16.3.0**
using your own `package.json` and `package-lock.json`.

Verified: `npm run typecheck` clean · `npm run lint` clean · `next build` passes
(36 routes) · built site checked for new prices, till number, blog, admin login
and certificate escaping.

---

## 1. Put it into your project

Copy everything in this folder over your local `grace-academy` folder (keep your
`.git` folder), then:

```bash
npm ci
npm run dev        # quick local look
git add .
git commit -m "New pricing, assessments, exams, settings, blog, email alerts"
git push
```

## 2. Settings that MUST be right on Vercel
(Project → Settings → Environment Variables, then Redeploy)

| Variable | Value | Why |
|---|---|---|
| `NEXT_PUBLIC_MPESA_TILL_NUMBER` | `4349699` | An env var **overrides** the code default. If Vercel still holds the old number, parents are shown the wrong till. |
| `NEXT_PUBLIC_SITE_URL` | `https://tutor-grace.vercel.app` | The live site currently advertises `https://gracemuigaimusicacademy.com` in its share previews and canonical links. That is not your domain. |
| `RESEND_API_KEY` | from resend.com (free) | Email alerts to Grace. Leave blank to switch alerts off; nothing breaks. |
| `NOTIFICATION_EMAIL` | `cbc.grace76@gmail.com` | Where alerts go. |

## 3. Deploy the database rules (required)

```bash
firebase deploy --only firestore:rules
```

Without this, `/admin/assessments`, `/admin/exams` and `/blog` hit
"permission denied".

## 4. Add Grace's video

Upload to YouTube as **Unlisted**, then in `lib/constants.ts`:

```ts
export const FEATURED_VIDEO = {
  url: "https://youtu.be/XXXXXXXXXXX",
  studentName: "…", grade: "Grade 8", piece: "…",
} as const;
```

The homepage section appears automatically. Get the parent's consent first.

## 5. What changed (summary)

- **Pricing**: per-holiday and 3-holiday bundle per grade; parents pick a plan at
  booking; the STK Push charges the plan's amount. Till is 4349699.
- **Assessments** after every lesson + **end-of-holiday exams** + printable
  **certificates** (Admin → Assessments / Holiday Exams).
- **Admin Settings** now really drive the homepage countdown, the start-date
  labels, the "enrollment closed" notice on /register, and the announcement
  banner. Changes show within about 5 minutes.
- **Email alerts** to Grace: new registration, new contact message, and payments
  (manual upload and automatic M-Pesa confirmation).
- **Fixes found while merging**: your live `tailwind.config.ts` was half-converted
  to navy/burgundy (gradients navy, buttons teal); restored to the client's
  chosen teal/gold. `npm run lint` was broken on Next 16 (`next lint` was
  removed); now uses ESLint directly. Blog pages disagreed on their data shape
  and would not compile; unified. Email bodies and the blog renderer now escape
  user text.

## 6. Known gaps (be upfront with the client)

1. **Parents cannot see shared assessments yet.** "Share with parent" only flags
   the record. Share results by WhatsApp until a parent page is built.
2. **Bundle tracking**: the system records the bundle payment but not which of
   the three holidays have been used.
3. **Certificates are generated from the URL**, so they are for printing from the
   admin portal, not verifiable. Add a certificate ID checked against Firestore if
   verification matters.
4. **The email alert endpoints are open to the public** (anyone who knows the URL
   could spam Grace's inbox). Low risk now; add rate limiting before heavy traffic.
5. **Existing bookings** made before this update have no plan label. That is
   harmless.
6. **M-Pesa STK Push is still sandbox-tested only.** Going live needs Safaricom
   Go-Live approval and production credentials.
