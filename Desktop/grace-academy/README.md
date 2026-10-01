# Grace Muigai Music Academy

Official website for **Grace Muigai Music Academy** — live online CBC & 8-4-4 music
lessons with Tr. Grace Muigai, Grades 4 to 9.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Firebase, Framer Motion,
React Hook Form, and Zod. Deploys to Vercel.

---

## ✨ Features

- **Homepage, About, Courses, Gallery, Resources, Testimonials, Contact** — fully
  responsive, animated, SEO-optimized pages
- **Live countdown timer** on the homepage counting down to the term start date —
  automatically flips to counting *up* ("X days since classes began") once it passes
- **Two program tracks**: School Students (CBC/8-4-4, Grades 4–9, grade-based
  schedule/fee) and Adult Classes (non-CBC, flat 12-session package) — selectable via
  a toggle on both Registration and Booking
- **Student Registration → Lesson Booking → Payment** — a full 3-step student portal
  flow with automatic grade → time → fee mapping, and reference-number lookups that
  auto-fill returning students' details
- **Two ways to pay**: instant **M-Pesa STK Push** (Daraja API — prompts the parent's
  phone directly) when configured, or manual payment-screenshot upload as a
  fallback that always works
- **Admin Portal** (`/admin`) — Firebase Auth–gated dashboard to review students,
  manage bookings, approve/reject payments (with screenshot preview), and read
  contact messages, without touching the Firebase Console
- **Firebase Firestore** (+ Firebase Admin SDK for trusted server routes) — typed
  read/write helpers, security rules, and composite indexes included
- **WhatsApp integration** — deep links pre-filled with context-aware messages
  throughout the site, plus a floating WhatsApp button
- **Accessibility** — semantic HTML, visible focus states, skip-to-content link,
  `aria-*` attributes on interactive components, honors `prefers-reduced-motion`
- **SEO** — per-page metadata, Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`,
  and JSON-LD structured data

---

## 🗂 Project Structure

```
grace-academy/
├── app/                    # App Router pages, layouts, API routes
│   ├── about/ courses/ gallery/ resources/ testimonials/ contact/
│   ├── register/           # Step 1 — student registration
│   ├── booking/            # Step 2 — lesson booking
│   │   ├── payment/        # Step 3 — payment confirmation upload
│   │   └── success/        # Success / next-steps page
│   ├── api/contact/        # Server-validated contact form route
│   ├── layout.tsx          # Root layout, fonts, metadata, JSON-LD
│   ├── sitemap.ts robots.ts
├── components/
│   ├── layout/              # Navbar, Footer, PageHero, WhatsAppButton
│   ├── ui/                  # Button, Card, Badge, FormField, FileUpload, etc.
│   ├── motion/               # Reveal + the signature StaffLineDivider motif
│   ├── home/ about/ courses/ gallery/ resources/ testimonials/ contact/
│   └── forms/                # RegistrationForm, BookingForm, PaymentUploadForm, ContactForm
├── firebase/                # Client SDK config + Firestore/Storage helpers
├── firebase_rules/          # firestore.rules, storage.rules, indexes
├── lib/                     # constants.ts (business rules), validators.ts (Zod), utils.ts
├── hooks/                   # useMediaQuery, useScrollDirection, useCountUp
├── types/                   # Shared domain types (Student, Booking, Payment, etc.)
├── utils/                   # whatsapp.ts, seo.ts
├── public/                  # images/ gallery/ icons/ + manifest.json
└── scripts/                 # generate-placeholders.py (on-brand placeholder imagery)
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase (database only — free Spark plan)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (Build → Firestore Database → Create database →
   production mode). You do **not** need to enable Firebase Storage — this project
   uses Cloudinary for image uploads instead (see step 3), so it stays on the free
   Spark plan with no card required.
3. Add a Web App (Project settings → General → Your apps → Add app → Web) and copy
   its config values
4. Deploy the included security rules:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # select your project
   firebase deploy --only firestore:rules,firestore:indexes
   ```

### 3. Set up Cloudinary (free image uploads)

Firebase Storage now requires the paid Blaze plan to enable, even though Firestore
itself is free. To avoid needing a card at all, payment-proof screenshots upload to
[Cloudinary](https://cloudinary.com) instead — free forever, no billing required
(25GB storage + 25GB bandwidth/month).

1. Create a free account at [cloudinary.com](https://cloudinary.com/users/register/free)
2. On your Dashboard, copy the **Cloud name** shown near the top
3. Go to **Settings (gear icon) → Upload → Upload presets → Add upload preset**
4. Set **Signing Mode** to **Unsigned**, give it any name, and Save
5. You now have both values needed for `.env.local` in step 4

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Firebase and Cloudinary config values, and confirm the business details
(M-Pesa till, phone numbers, WhatsApp number) match reality.

### 5. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 6. Type-check & lint

```bash
npm run typecheck
npm run lint
```

### 7. Build for production

```bash
npm run build
npm run start
```

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add every variable from `.env.example` under **Project → Settings →
   Environment Variables**
4. Deploy — Vercel builds Next.js automatically

Vercel gives you free hosting, automatic HTTPS, and a global CDN out of the box, as
requested. Add a custom domain later under **Project → Settings → Domains**.

---

## 🧠 Business Rules (single source of truth)

All business rules live in **`lib/constants.ts`** and propagate everywhere
automatically — the booking form, fee tables, receipts, and footer all read from this
one file:

| Grade | Time | Per holiday | 3-holiday bundle (one-time offer) |
|---|---|---|---|
| Grade 4 | 9:00 AM | KSh 2,000 | KSh 5,000 |
| Grade 5 | 10:00 AM | KSh 2,500 | KSh 6,000 |
| Grade 6 | 11:00 AM | KSh 3,000 | KSh 8,000 |
| Grade 7 | 2:00 PM | KSh 4,500 | KSh 11,000 |
| Grade 8 | 3:00 PM | KSh 4,500 | KSh 11,000 |
| Grade 9 | 4:00 PM | KSh 4,500 | KSh 11,000 |

Grades 7–9 cost more because a recording of the student's piece is included.
Every lesson is assessed, there is an end-of-holiday exam, and certificates are
issued on passing.

**Adult Classes** (non-CBC): KSh 4,000 flat for a 12-session package, schedule
arranged directly with Tr. Grace — see `ADULT_PROGRAM` in `lib/constants.ts`.

- **M-Pesa Buy Goods Till:** `4349699` (business name: **Grace**) — confirmed by the client.
- **Online classes begin:** 7 August

To change any of these, edit `GRADE_SCHEDULE`, `ADULT_PROGRAM`, `MPESA`, or `TERM` in
`lib/constants.ts` — no need to touch individual pages or components.

---

## 🔥 Firestore Collections

| Collection | Written by | Read by |
|---|---|---|
| `students` | Registration form (public create) | Admin only |
| `bookings` | Booking form (public create) | Admin only |
| `payments` | Payment upload form (public create) | Admin only |
| `contactMessages` | `/api/contact` route (public create) | Admin only |
| `testimonials` | Admin | Public (where `approved == true`) |
| `gallery` | Admin | Public |
| `resources` | Admin | Public |
| `settings` | Admin | Public |

Security rules for all of the above live in `firebase_rules/firestore.rules`.
Payment proof screenshots are uploaded to **Cloudinary** (free tier, no billing
required) under the folder `payment-proofs/{bookingReference}/…`, with just the
resulting URL saved on the `payments` Firestore document. See `lib/cloudinary.ts`.
(Firebase Storage rules are kept in `firebase_rules/storage.rules` in case you
upgrade to the Blaze plan later and want to switch back — see the comment at the top
of that file.)

### Seeding content

The **Gallery**, **Resources**, and **Testimonials** pages automatically fall back to
on-brand seed content in `lib/seed-data.ts` whenever Firestore is empty, so the site
never looks broken while you're adding real content. Once you add real documents to
those collections (via Firebase Console for now — the admin portal doesn't manage
these three yet, see below), they take over automatically.

---

## 🛠 Admin Portal

A working admin dashboard lives at **`/admin`** — Grace or you can log in to review
registrations, manage bookings, approve/reject payments (with screenshot preview),
and read contact messages, without ever opening the Firebase Console.

### Create the first admin account

There is **no public sign-up** anywhere on the site — that's intentional, so that
"signed in at all" can safely mean "is an admin" (see the comment at the top of
`firebase_rules/firestore.rules` for the full reasoning). To create an account:

1. Firebase Console → **Build → Authentication → Get started**
2. Enable the **Email/Password** sign-in method
3. Go to the **Users** tab → **Add user** → enter Grace's (or your) email + a password
4. Go to **`https://yoursite.vercel.app/admin/login`** and sign in with those
   credentials

Add more staff accounts the same way any time — no code changes needed. If you later
want a non-admin "view only" role, see the upgrade note in `firestore.rules`.

### What's managed in the portal vs. Firebase Console

| Manage in `/admin` | Still via Firebase Console |
|---|---|
| Students, Bookings, Payments, Messages | Testimonials, Gallery, Resources |

The second group is lower-frequency content (you're not adding a new testimonial
every day), so it's not yet in the portal UI — add/edit those documents directly in
Firestore for now. The read/write helpers for them already exist in
`firebase/firestore.ts` (`createTestimonial`, `createGalleryItem`, `createResource`,
etc.) if you want to build that UI next; it's a straightforward extension of the
existing admin pages.

### Architecture notes

- All collections are modeled with clear, typed shapes (`types/index.ts`)
- Every read/write helper is centralized in `firebase/firestore.ts`
- The M-Pesa callback and lookup routes use the **Firebase Admin SDK**
  (`firebase/admin.ts`), which bypasses security rules entirely — appropriate since
  those are trusted server-only contexts (a Safaricom webhook has no user session to
  authenticate)

---

## 📲 M-Pesa STK Push Setup (optional)

The payment page can send an instant M-Pesa prompt to the parent's phone instead of
requiring a manual screenshot — both options are available; manual upload is always
there as a fallback and is what's live by default.

### 1. Register with Safaricom Daraja

1. Create an account at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create a new App → copy the **Consumer Key** and **Consumer Secret**
3. For sandbox testing, Safaricom provides a public test Shortcode + Passkey (see
   their [STK Push docs](https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate))
4. For production, you'll need to apply for **Go-Live** on your actual Till Number —
   this requires Safaricom's approval process and links to Grace's real Buy Goods
   account

### 2. Configure environment variables

Add these to `.env.local` (and Vercel):

```
NEXT_PUBLIC_MPESA_STK_ENABLED=true
MPESA_ENV=sandbox                 # switch to "production" only after testing
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://yoursite.vercel.app/api/mpesa/callback
```

You'll also need the **Firebase Admin SDK** variables filled in (see above) — the
callback route depends on them to record the payment result.

### 3. Test in sandbox first

Safaricom's sandbox lets you simulate the full flow without moving real money. Use
their test phone numbers and PINs from the Daraja docs. Confirm:
- The prompt is triggered (check your test phone/simulator)
- The callback route receives the result (check Vercel's function logs)
- The payment shows as "confirmed" in `/admin/payments`

### 4. Go live

Once sandbox testing passes, apply for Go-Live with Safaricom for the real Till
Number, switch `MPESA_ENV=production`, and update the four `MPESA_*` credentials to
the production values Safaricom issues.

**Until all of this is done, leave `NEXT_PUBLIC_MPESA_STK_ENABLED=false` (or unset)**
— the payment page will simply show the manual upload flow, which works today with
zero additional setup.

---

## 🎨 Design System

- **Palette:** deep teal, violet, azure, and warm gold accents — defined as Tailwind
  tokens in `tailwind.config.ts`
- **Typography:** Fraunces (display/serif) for headings, Plus Jakarta Sans for body
  text, loaded via `next/font/google`
- **Signature motif:** an animated five-line music staff (`StaffLineDivider`) used as
  section dividers and hero backdrops across the site — grades are visually placed on
  the staff like notes wherever it appears
- **Motion:** Framer Motion throughout, all respecting `prefers-reduced-motion`

### Changing the color scheme

Every color used across the whole site is defined in **one place**:
`tailwind.config.ts` → `theme.extend.colors`. Nothing is hardcoded per-page, so
changing a value there updates it everywhere automatically (buttons, badges, the
hero gradient, the countdown timer, etc.) — no hunting through components.

The three colors that most define the current look are `teal.600` (primary/buttons),
`violet.500` (secondary accent, used for the Adult Classes branding), and
`gold.400` (CTA highlight color). Below are three ready-to-paste alternative
directions if Grace wants to see other options — swap the values under
`theme.extend.colors` in `tailwind.config.ts` and restart `npm run dev` to preview:

**Option A — Warmer, sunset-inspired** (terracotta + deep plum + amber)
```
teal:   { ...600: "#B5502E", 700: "#8C3D22" }   /* was deep teal, now terracotta */
violet: { ...500: "#5C3350", 600: "#472740" }   /* deep plum */
gold:   { ...400: "#E8A33D" }                    /* unchanged — still reads warm */
```

**Option B — Cooler, more "conservatory/classical"** (navy + burgundy + brass)
```
teal:   { ...600: "#1B2A4A", 700: "#131F38" }   /* deep navy */
violet: { ...500: "#6B2737", 600: "#521D2A" }   /* burgundy */
gold:   { ...400: "#C9A24B" }                    /* muted brass instead of bright gold */
```

**Option C — Fresh, youthful** (emerald + indigo + coral)
```
teal:   { ...600: "#0E7C5A", 700: "#0A5F44" }   /* emerald */
violet: { ...500: "#4338CA", 600: "#3730A3" }   /* indigo */
gold:   { ...400: "#F0654A" }                    /* coral instead of gold */
```

These are starting points, not exact final values — once Grace picks a direction, I'd
tune the full 50–900 shade range for that color (not just the one shade shown above)
so hover states, badges, and subtle backgrounds all stay consistent, the way the
current teal/violet/gold set is fully built out.

---

## 📄 License

Built for Grace Muigai Music Academy. All rights reserved.


---

## 🆕 Recent additions

- **Pricing:** per-holiday and 3-holiday bundle fees per grade (`GRADE_SCHEDULE` in `lib/constants.ts`); parents choose a plan when booking.
- **Assessments & holiday exams** (`/admin/assessments`, `/admin/exams`): Grace records a score after each lesson and an end-of-holiday exam result, and can issue a printable certificate for passes.
- **Featured student video:** set `FEATURED_VIDEO.url` in `lib/constants.ts` (YouTube, Vimeo or a direct file). The homepage section stays hidden until a URL is set. Get the parent's consent before publishing a child's performance.
- **Admin Settings** (`/admin/settings`): term start date (drives the countdown), enrollment open/closed notice, and a site-wide announcement banner. Changes appear within about 5 minutes.
- **Student progress notes** (admin-only) on each student record.
- **Blog** (`/blog`) with starter articles; add your own to the Firestore `blog` collection.
- **Forgot password** on the admin login.
- **Email notifications** via Resend (see `.env.example`).

Not built yet: a parent-facing page for shared assessments. "Share with parent" currently only flags the record; share results by WhatsApp in the meantime.
