"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle, Clock, Banknote } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/validators";
import { createBooking } from "@/firebase/firestore";
import { GRADE_SCHEDULE, getGradeSchedule, TERM } from "@/lib/constants";
import { generateReference, formatKes } from "@/lib/utils";
import { FieldWrapper, Input, Select } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [reference, setReference] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      studentReference: searchParams.get("ref") ?? "",
      preferredStartDate: TERM.onlineClassesStart,
    },
  });

  const selectedGrade = useWatch({ control, name: "grade" });
  const schedule = getGradeSchedule(selectedGrade);

  const onSubmit = async (data: BookingInput) => {
    setErrorMessage(null);
    const gradeInfo = getGradeSchedule(data.grade);
    if (!gradeInfo) {
      setErrorMessage("Please select a valid grade.");
      return;
    }
    const ref = generateReference("BOOK");
    try {
      await createBooking({
        studentReference: data.studentReference,
        studentName: data.studentName,
        grade: data.grade,
        gradeLabel: gradeInfo.label,
        time: gradeInfo.time,
        day: gradeInfo.day,
        fee: gradeInfo.fee,
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
      <FieldWrapper
        label="Registration reference"
        htmlFor="studentReference"
        required
        hint="From your student registration, e.g. GMMA-7F3K2"
        error={errors.studentReference?.message}
      >
        <Input
          id="studentReference"
          invalid={!!errors.studentReference}
          {...register("studentReference")}
        />
      </FieldWrapper>

      <FieldWrapper
        label="Student's full name"
        htmlFor="studentName"
        required
        error={errors.studentName?.message}
      >
        <Input id="studentName" invalid={!!errors.studentName} {...register("studentName")} />
      </FieldWrapper>

      <FieldWrapper label="Grade" htmlFor="grade" required error={errors.grade?.message}>
        <Select id="grade" invalid={!!errors.grade} defaultValue="" {...register("grade")}>
          <option value="" disabled>
            Select grade
          </option>
          {GRADE_SCHEDULE.map((g) => (
            <option key={g.key} value={g.key}>
              {g.label}
            </option>
          ))}
        </Select>
      </FieldWrapper>

      {schedule && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-2 gap-4 overflow-hidden rounded-xl bg-teal-50 p-4"
        >
          <div className="flex items-center gap-2 text-sm text-teal-800">
            <Clock className="h-4 w-4 shrink-0" />
            {schedule.day}, {schedule.time}
          </div>
          <div className="flex items-center justify-end gap-2 text-sm font-semibold text-teal-800">
            <Banknote className="h-4 w-4 shrink-0" />
            {formatKes(schedule.fee)} / lesson
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper
          label="Parent / guardian phone"
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
        <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
        </p>
      )}
    </form>
  );
}
