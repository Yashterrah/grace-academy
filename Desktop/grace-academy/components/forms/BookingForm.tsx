"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Clock, Banknote, CheckCircle2, Mic } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/validators";
import { createBooking } from "@/firebase/firestore";
import { ADULT_PROGRAM, GRADE_SCHEDULE, getGradeSchedule, TERM } from "@/lib/constants";
import { generateReference, formatKes } from "@/lib/utils";
import { FieldWrapper, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ProgramToggle } from "@/components/forms/ProgramToggle";

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [reference, setReference] = React.useState<string | null>(null);
  const [lookup, setLookup] = React.useState<"idle" | "checking" | "found" | "not-found">("idle");
  // "holiday" = single term, "bundle" = 3-holiday discounted offer
  const [pricingTrack, setPricingTrack] = React.useState<"holiday" | "bundle">("holiday");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      program: "school",
      studentReference: searchParams.get("ref") ?? "",
      preferredStartDate: TERM.onlineClassesStart,
    },
  });

  const program = useWatch({ control, name: "program" }) ?? "school";
  const selectedGrade = useWatch({ control, name: "grade" });
  const studentReference = useWatch({ control, name: "studentReference" });
  const isAdult = program === "adult";
  const schedule = getGradeSchedule(selectedGrade);

  // Clear stale grade when switching to Adult
  React.useEffect(() => {
    if (isAdult) setValue("grade", undefined, { shouldValidate: true });
  }, [isAdult, setValue]);

  const handleReferenceBlur = async () => {
    if (!studentReference || studentReference.trim().length < 4) return;
    setLookup("checking");
    try {
      const res = await fetch(
        `/api/lookup/student?ref=${encodeURIComponent(studentReference.trim())}`
      );
      const data = await res.json();
      if (data.found) {
        setValue("studentName", data.fullName, { shouldValidate: true });
        setValue("program", data.program, { shouldValidate: true });
        if (data.grade) setValue("grade", data.grade, { shouldValidate: true });
        setLookup("found");
      } else {
        setLookup("not-found");
      }
    } catch {
      setLookup("idle");
    }
  };

  const activeFee = schedule
    ? pricingTrack === "bundle"
      ? schedule.bundleFee
      : schedule.holidayFee
    : 0;

  const onSubmit = async (data: BookingInput) => {
    setErrorMessage(null);
    const ref = generateReference("BOOK");

    const bookingDetails =
      data.program === "adult"
        ? {
            grade: undefined,
            gradeLabel: `${ADULT_PROGRAM.label} (${ADULT_PROGRAM.sessions} sessions)`,
            time: ADULT_PROGRAM.time,
            day: ADULT_PROGRAM.day,
            fee: ADULT_PROGRAM.fee,
            pricingTrack: "standard" as const,
          }
        : (() => {
            const gradeInfo = getGradeSchedule(data.grade);
            if (!gradeInfo) return null;
            return {
              grade: data.grade,
              gradeLabel: gradeInfo.label,
              time: gradeInfo.time,
              day: gradeInfo.day,
              fee: pricingTrack === "bundle" ? gradeInfo.bundleFee : gradeInfo.holidayFee,
              pricingTrack,
            };
          })();

    if (!bookingDetails) {
      setErrorMessage("Please select a valid grade.");
      return;
    }

    try {
      await createBooking({
        program: data.program,
        studentReference: data.studentReference,
        studentName: data.studentName,
        ...bookingDetails,
        status: "pending",
        createdAt: new Date().toISOString(),
        reference: ref,
      });
      setReference(ref);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  if (reference) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl2 border border-teal-100 bg-teal-50 p-8 text-center"
      >
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-teal-600">
          Booking confirmed
        </p>
        <p className="mt-3 font-display text-2xl text-ink">Your lesson slot is reserved</p>
        <p className="mt-3 inline-block rounded-full bg-white px-6 py-2 font-display text-lg font-medium text-teal-700 shadow-card">
          {reference}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-ink-faint">
          Next, complete your M-Pesa payment and upload your confirmation to activate the
          booking.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => router.push(`/booking/payment?ref=${reference}`)} size="lg">
            Proceed to Payment <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Program toggle */}
      <FieldWrapper label="Program" htmlFor="program-toggle" required>
        <input type="hidden" {...register("program")} />
        <ProgramToggle
          value={program}
          onChange={(val) => setValue("program", val, { shouldValidate: true })}
        />
      </FieldWrapper>

      {/* Registration reference */}
      <FieldWrapper
        label="Registration reference"
        htmlFor="studentReference"
        required
        hint="From your registration, e.g. GMMA-7F3K2"
        error={errors.studentReference?.message}
      >
        <Input
          id="studentReference"
          invalid={!!errors.studentReference}
          {...register("studentReference", { onBlur: handleReferenceBlur })}
        />
      </FieldWrapper>

      {lookup === "checking" && (
        <p className="flex items-center gap-2 text-xs text-ink-faint">
          <Spinner className="h-3.5 w-3.5" /> Looking up your registration...
        </p>
      )}
      {lookup === "found" && (
        <p className="flex items-center gap-2 text-xs font-medium text-teal-700">
          <CheckCircle2 className="h-3.5 w-3.5" /> Registration found — details filled in below.
        </p>
      )}
      {lookup === "not-found" && (
        <p className="text-xs font-medium text-gold-600">
          We couldn&apos;t find that reference — double check it or fill in the details manually.
        </p>
      )}

      {/* Student name */}
      <FieldWrapper
        label={isAdult ? "Your full name" : "Student's full name"}
        htmlFor="studentName"
        required
        error={errors.studentName?.message}
      >
        <Input id="studentName" invalid={!!errors.studentName} {...register("studentName")} />
      </FieldWrapper>

      {/* School or Adult block */}
      {isAdult ? (
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-violet-50 p-4">
          <div className="flex items-center gap-2 text-sm text-violet-800">
            <Clock className="h-4 w-4 shrink-0" />
            {ADULT_PROGRAM.sessions} sessions · flexible schedule
          </div>
          <div className="flex items-center justify-end gap-2 text-sm font-semibold text-violet-800">
            <Banknote className="h-4 w-4 shrink-0" />
            {ADULT_PROGRAM.feeLabel} total
          </div>
        </div>
      ) : (
        <>
          {/* Grade picker */}
          <FieldWrapper label="Grade" htmlFor="grade" required error={errors.grade?.message}>
            <Select id="grade" invalid={!!errors.grade} defaultValue="" {...register("grade")}>
              <option value="" disabled>Select grade</option>
              {GRADE_SCHEDULE.map((g) => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </Select>
          </FieldWrapper>

          {/* Pricing track selector + summary */}
          {schedule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 overflow-hidden"
            >
              {/* Track toggle */}
              <div
                role="radiogroup"
                aria-label="Payment plan"
                className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              >
                {(
                  [
                    {
                      key: "holiday" as const,
                      title: "Per Holiday",
                      subtitle: "Pay one term at a time",
                      amount: schedule.feeLabel,
                    },
                    {
                      key: "bundle" as const,
                      title: "3-Holiday Bundle",
                      subtitle: `Save ${schedule.bundleSavingLabel} — one-time offer`,
                      amount: schedule.bundleFeeLabel,
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={pricingTrack === opt.key}
                    onClick={() => setPricingTrack(opt.key)}
                    className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                      pricingTrack === opt.key
                        ? "border-teal-600 bg-teal-50"
                        : "border-ink/10 bg-white hover:border-ink/20"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        pricingTrack === opt.key
                          ? "border-teal-600 bg-teal-600"
                          : "border-ink/30"
                      }`}
                    >
                      {pricingTrack === opt.key && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{opt.title}</span>
                      <span className="block text-xs text-ink-faint">{opt.subtitle}</span>
                    </span>
                    <span className="ml-auto text-sm font-bold text-teal-700">{opt.amount}</span>
                  </button>
                ))}
              </div>

              {/* Summary row */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-teal-800">
                  <Clock className="h-4 w-4 shrink-0" />
                  {schedule.day} · {schedule.time}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-teal-800">
                  <Banknote className="h-4 w-4 shrink-0" />
                  {formatKes(activeFee)}
                  {pricingTrack === "bundle" && (
                    <span className="ml-1 rounded-full bg-teal-600 px-2 py-0.5 text-xs font-semibold text-white">
                      3 holidays
                    </span>
                  )}
                </div>
              </div>

              {/* Recording note for Grades 7–9 */}
              {schedule.recordingIncluded && (
                <p className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-xs text-violet-800">
                  <Mic className="h-3.5 w-3.5 shrink-0" />
                  Piece recording is included in {schedule.label} lessons.
                </p>
              )}
            </motion.div>
          )}
        </>
      )}

      {/* Phone + date */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper
          label={isAdult ? "Your phone number" : "Parent / guardian phone"}
          htmlFor="parentPhone"
          required
          hint="e.g. 0712345678"
          error={errors.parentPhone?.message}
        >
          <Input id="parentPhone" invalid={!!errors.parentPhone} {...register("parentPhone")} />
        </FieldWrapper>
        <FieldWrapper
          label="Preferred start date"
          htmlFor="preferredStartDate"
          required
          error={errors.preferredStartDate?.message}
        >
          <Input
            id="preferredStartDate"
            type="date"
            invalid={!!errors.preferredStartDate}
            {...register("preferredStartDate")}
          />
        </FieldWrapper>
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
        {isSubmitting && <Spinner className="h-4 w-4" />}
        {isSubmitting ? "Booking..." : "Confirm Booking"}
      </Button>

      {errorMessage && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
        </p>
      )}
    </form>
  );
}
