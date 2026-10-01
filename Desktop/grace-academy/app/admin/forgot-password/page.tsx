"use client";

import * as React from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/firebase/config";
import { Music2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { FieldWrapper, Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { SITE } from "@/lib/constants";

type Status = "idle" | "sending" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);

    if (!isFirebaseConfigured || !auth) {
      setError("Firebase isn't configured yet. Check your environment variables.");
      setStatus("error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStatus("sent");
    } catch (err: unknown) {
      // Don't reveal whether the email exists — always show "sent" to
      // prevent account enumeration. Only surface real config errors.
      const code = (err as { code?: string }).code;
      if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
        setStatus("error");
      } else {
        // For auth/user-not-found and all other cases, show "sent" anyway
        setStatus("sent");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
            <Music2 className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-slate-900">{SITE.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Reset your password</p>
        </div>

        {status === "sent" ? (
          <div className="mt-8 rounded-xl bg-teal-50 p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-teal-600" />
            <p className="mt-3 font-semibold text-slate-900">Check your email</p>
            <p className="mt-2 text-sm text-slate-600">
              If an account exists for <strong>{email}</strong>, a password reset
              link has been sent. Check your spam folder if you don&apos;t see it
              within a few minutes.
            </p>
            <Link
              href="/admin/login"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <p className="text-sm text-slate-600">
              Enter your admin email address and we&apos;ll send you a link to
              reset your password.
            </p>
            <FieldWrapper label="Email address" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FieldWrapper>

            <Button
              type="submit"
              disabled={status === "sending"}
              className="w-full justify-center"
            >
              {status === "sending" && <Spinner className="h-4 w-4" />}
              {status === "sending" ? "Sending..." : "Send Reset Link"}
            </Button>

            {status === "error" && error && (
              <p
                role="alert"
                className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <div className="text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
