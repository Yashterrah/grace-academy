# Grace Muigai Music Academy

Official website for **Grace Muigai Music Academy** — live online CBC & 8-4-4 music
lessons with Tr. Grace Muigai, Grades 4 to 9.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Firebase, Framer Motion,
React Hook Form, and Zod. Deploys to Vercel.

---

## ✨ Features

- **Homepage, About, Courses, Gallery, Resources, Testimonials, Contact** — fully
  responsive, animated, SEO-optimized pages
- **Student Registration → Lesson Booking → Payment Confirmation Upload** — a full
  3-step student portal flow with automatic grade → time → fee mapping
- **Firebase Firestore + Storage** — typed read/write helpers, security rules, and
  composite indexes included
- **WhatsApp integration** — deep links pre-filled with context-aware messages
  throughout the site, plus a floating WhatsApp button
- **Admin-ready architecture** — Firestore/Storage rules already gate writes behind a
  `request.auth.token.admin` custom claim, ready for an admin dashboard
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

| Grade | Time | Fee |
|---|---|---|
| Grade 4 | 9:00 AM | KSh 2,000 |
| Grade 5 | 10:00 AM | KSh 2,500 |
| Grade 6 | 11:00 AM | KSh 3,000 |
| Grade 7 | 2:00 PM | KSh 4,500 |
| Grade 8 | 3:00 PM | KSh 4,500 |
| Grade 9 | 4:00 PM | KSh 4,500 |

- **M-Pesa Buy Goods Till:** `4319699` (Business name: **Grace**)
- **Online classes begin:** 7 August

To change any of these, edit `GRADE_SCHEDULE`, `MPESA`, or `TERM` in
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

Until you build an admin dashboard, the **Gallery**, **Resources**, and
**Testimonials** pages automatically fall back to on-brand seed content in
`lib/seed-data.ts` whenever Firestore is empty or not yet configured, so the site
never looks broken. Add real documents to those collections (via the Firebase
Console, a script, or a future admin UI) and they'll take over automatically.

---

## 🛠 Admin-Ready Architecture

There's no admin dashboard yet, but the foundation is in place:

- Firestore/Storage rules already check for `request.auth.token.admin == true`
- All collections are modeled with clear, typed shapes (`types/index.ts`)
- Read helpers (`getApprovedTestimonials`, `getGalleryItems`, `getResources`) and
  write helpers (`createStudent`, `createBooking`, `createPayment`, …) are already
  centralized in `firebase/firestore.ts`, ready to be reused by an admin UI

**To add an admin dashboard next:** enable Firebase Auth, sign in an admin account,
set a custom claim of `admin: true` on it (via the Firebase Admin SDK, e.g. a small
Node script or Cloud Function), then build authenticated pages under `app/admin/`
that call the existing helpers to list/approve/reject records.

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

---

## 📄 License

Built for Grace Muigai Music Academy. All rights reserved.
