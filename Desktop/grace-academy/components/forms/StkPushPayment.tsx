"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { FieldWrapper, Input } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatKes } from "@/lib/utils";

type Stage = "idle" | "sending" | "waiting" | "confirmed" | "rejected" | "error";

interface BookingPreview {
  studentName: string;
  gradeLabel: string;
  fee: number;
}

export function StkPushPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingReference, setBookingReference] = React.useState(searchParams.get("ref") ?? "");
  const [phone, setPhone] = React.useState("");
  const [preview, setPreview] = React.useState<BookingPreview | null>(null);
  const [previewState, setPreviewState] = React.useState<"idle" | "checking" | "found" | "not-found">("idle");
  const [stage, setStage] = React.useState<Stage>("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [paymentId, setPaymentId] = React.useState<string | null>(null);
  const [paymentReference, setPaymentReference] = React.useState<string | null>(null);
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const pollAttempts = React.useRef(0);

  const lookupBooking = async (ref: string) => {
    if (!ref || ref.trim().length < 4) return;
    setPreviewState("checking");
    try {
      const res = await fetch(`/api/lookup/booking?ref=${encodeURIComponent(ref.trim())}`);
      const data = await res.json();
      if (data.found) {
        setPreview({ studentName: data.studentName, gradeLabel: data.gradeLabel, fee: data.fee });
        setPreviewState("found");
      } else {
        setPreview(null);
        setPreviewState("not-found");
      }
    } catch {
      setPreviewState("idle");
    }
  };

  React.useEffect(() => {
    if (bookingReference) lookupBooking(bookingReference);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  };

  React.useEffect(() => () => stopPolling(), []);

  const startPolling = (id: string, ref: string) => {
    pollAttempts.current = 0;
    pollRef.current = setInterval(async () => {
      pollAttempts.current += 1;
      try {
        const res = await fetch(`/api/mpesa/status?paymentId=${id}`);
        const data = await res.json();
        if (data.status === "confirmed") {
          stopPolling();
          setStage("confirmed");
          setTimeout(() => {
            router.push(`/booking/success?ref=${ref}&booking=${encodeURIComponent(bookingReference)}`);
          }, 1500);
        } else if (data.status === "rejected") {
          stopPolling();
          setStage("rejected");
          setErrorMessage(data.mpesaMessage || "The payment wasn't completed on your phone.");
        }
      } catch {
        // transient network hiccup — keep polling
      }
      // Stop after ~2 minutes (60 attempts x 2s) so the UI doesn't spin forever
      if (pollAttempts.current > 60) {
        stopPolling();
        setStage("error");
        setErrorMessage(
          "This is taking longer than expected. If you completed the payment, it will still be recorded — otherwise please try again or use manual upload."
        );
      }
    }, 2000);
  };

  const handleSend = async () => {
    setErrorMessage(null);
    if (!bookingReference.trim()) {
      setErrorMessage("Enter your booking reference first.");
      return;
    }
    if (phone.trim().length < 9) {
      setErrorMessage("Enter a valid phone number to receive the payment prompt.");
      return;
    }

    setStage("sending");
    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingReference: bookingReference.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start the payment prompt.");

      setPaymentId(data.paymentId);
      setPaymentReference(data.paymentReference);
      setStage("waiting");
      startPolling(data.paymentId, data.paymentReference);
    } catch (err) {
      setStage("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (stage === "confirmed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 rounded-xl2 bg-teal-50 p-8 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-teal-600" />
        <p className="font-display text-xl text-ink">Payment confirmed!</p>
        <p className="text-sm text-ink-soft">Taking you to your confirmation page...</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <FieldWrapper label="Booking reference" htmlFor="stk-ref" required hint="e.g. BOOK-9K2P1">
        <Input
          id="stk-ref"
          value={bookingReference}
          onChange={(e) => setBookingReference(e.target.value)}
          onBlur={(e) => lookupBooking(e.target.value)}
          disabled={stage === "waiting" || stage === "sending"}
        />
      </FieldWrapper>

      {previewState === "checking" && (
        <p className="flex items-center gap-2 text-xs text-ink-faint">
          <Spinner className="h-3.5 w-3.5" /> Looking up booking...
        </p>
      )}
      {previewState === "not-found" && (
        <p className="text-xs font-medium text-gold-600">
          We couldn&apos;t find that booking reference.
        </p>
      )}
      {preview && previewState === "found" && (
        <div className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-800">
          <span>
            {preview.studentName} — {preview.gradeLabel}
          </span>
          <span className="font-semibold">{formatKes(preview.fee)}</span>
        </div>
      )}

      <FieldWrapper
        label="M-Pesa phone number"
        htmlFor="stk-phone"
        required
        hint="The prompt will be sent to this number — e.g. 0712345678"
      >
        <Input
          id="stk-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={stage === "waiting" || stage === "sending"}
        />
      </FieldWrapper>

      <Button
        type="button"
        onClick={handleSend}
        disabled={stage === "sending" || stage === "waiting"}
        size="lg"
        className="w-full sm:w-auto"
      >
        {(stage === "sending" || stage === "waiting") && <Spinner className="h-4 w-4" />}
        {stage === "sending"
          ? "Sending prompt..."
          : stage === "waiting"
            ? "Waiting for you to approve on your phone..."
            : "Send Payment Request"}
      </Button>

      <AnimatePresence>
        {stage === "waiting" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 overflow-hidden rounded-xl bg-teal-50 p-4 text-sm text-teal-800"
          >
            <Smartphone className="h-5 w-5 shrink-0 animate-pulse" />
            An M-Pesa prompt has been sent to {phone}. Enter your PIN to complete the payment —
            this page will update automatically.
          </motion.div>
        )}
        {stage === "rejected" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="alert"
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            <XCircle className="h-4 w-4 shrink-0" /> {errorMessage}
          </motion.p>
        )}
        {(stage === "error" || errorMessage) && stage !== "rejected" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="alert"
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {paymentReference && stage === "waiting" && (
        <p className="text-center text-xs text-ink-faint">Payment reference: {paymentReference}</p>
      )}
    </div>
  );
}
