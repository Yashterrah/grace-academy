"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Music2, AlertCircle } from "lucide-react";
import { AdminAuthProvider, useAdminAuth } from "@/hooks/useAdminAuth";
import { FieldWrapper, Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { SITE } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const { user, loading, signIn } = useAdminAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch {
      setError("Incorrect email or password. Please try again.");
    } finally {
      setSubmitting(false);
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
          <p className="mt-1 text-sm text-slate-500">Admin Portal — Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <FieldWrapper label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FieldWrapper>
          <FieldWrapper label="Password" htmlFor="password" required>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FieldWrapper>

          <div className="flex justify-end">
            <Link
              href="/admin/forgot-password"
              className="text-xs text-slate-500 hover:text-teal-600"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full justify-center"
          >
            {submitting && <Spinner className="h-4 w-4" />}
            {submitting ? "Signing in..." : "Sign In"}
          </Button>

          {error && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Accounts are created manually in Firebase Console. Contact your
          developer if you need access.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <LoginForm />
    </AdminAuthProvider>
  );
}
