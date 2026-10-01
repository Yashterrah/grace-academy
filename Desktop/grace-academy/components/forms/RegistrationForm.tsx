"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { registrationSchema, type RegistrationInput } from "@/lib/validators";
import { createStudent } from "@/firebase/firestore";
import { ADULT_PROGRAM, GRADE_SCHEDULE } from "@/lib/constants";
import { generateReference } from "@/lib/utils";
import { FieldWrapper, Input, Select, TextArea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ProgramToggle } from "@/components/forms/ProgramToggle";

export function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [reference, setReference] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      program: searchParams.get("program") === "adult" ? "adult" : "school",
    },
  });

  const program = useWatch({ control, name: "program" }) ?? "school";
  const isAdult = program === "adult";

  // Clear grade/school when switching to Adult — prevents hidden fields
  // with stale empty-string values from silently blocking form submission
  React.useEffect(() => {
    if (isAdult) {
      setValue("grade", undefined, { shouldValidate: true });
      setValue("school", undefined, { shouldValidate: true });
    }
  }, [isAdult, setValue]);

  const onSubmit = async (data: RegistrationInput) => {
    setErrorMessage(null);
    const ref = generateReference();
    try {
      await createStudent({
        program: data.program,
        fullName: data.fullName,
        age: data.age,
        grade: data.program === "school" ? data.grade : undefined,
        school: data.program === "school" ? data.school : undefined,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail || undefined,
        county: data.county,
        notes: data.notes || undefined,
        createdAt: new Date().toISOString(),
        reference: ref,
      });

      // Fire email notification — non-blocking, never breaks registration flow
      fetch("/api/notify/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: data.fullName,
          program: data.program,
          grade: data.grade,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
          county: data.county,
          reference: ref,
        }),
      }).catch(() => {/* silent — email failure never affects the student */});

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
          Registration complete
        </p>
        <p className="mt-3 font-display text-2xl text-ink">Welcome to the academy!</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          Your registration reference is:
        </p>
        <p className="mt-3 inline-block rounded-full bg-white px-6 py-2 font-display text-lg font-medium text-teal-700 shadow-card">
          {reference}
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-ink-faint">
          Save this reference — you&apos;ll need it to book your lesson time next.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => router.push(`/booking?ref=${reference}`)} size="lg">
            Book Your Lesson Time <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FieldWrapper label="Program" htmlFor="program-toggle" required>
        <input type="hidden" {...register("program")} />
        <ProgramToggle
          value={program}
          onChange={(val) => setValue("program", val, { shouldValidate: true })}
        />
      </FieldWrapper>

      {isAdult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden rounded-xl bg-violet-50 p-4 text-sm text-violet-800"
        >
          <p className="font-semibold">{ADULT_PROGRAM.label} — {ADULT_PROGRAM.feeLabel} total</p>
          <p className="mt-1 text-violet-700/90">{ADULT_PROGRAM.description}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper
          label={isAdult ? "Your full name" : "Student's full name"}
          htmlFor="fullName"
          required
          error={errors.fullName?.message}
        >
          <Input id="fullName" invalid={!!errors.fullName} {...register("fullName")} />
        </FieldWrapper>
        <FieldWrapper label="Age" htmlFor="age" required error={errors.age?.message}>
          <Input id="age" type="number" invalid={!!errors.age} {...register("age")} />
        </FieldWrapper>
      </div>

      {!isAdult && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FieldWrapper label="Grade" htmlFor="grade" required error={errors.grade?.message}>
            <Select id="grade" invalid={!!errors.grade} defaultValue="" {...register("grade")}>
              <option value="" disabled>Select grade</option>
              {GRADE_SCHEDULE.map((g) => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </Select>
          </FieldWrapper>
          <FieldWrapper
            label="Current school"
            htmlFor="school"
            required
            error={errors.school?.message}
          >
            <Input id="school" invalid={!!errors.school} {...register("school")} />
          </FieldWrapper>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper
          label={isAdult ? "Your full name (repeat)" : "Parent / guardian full name"}
          htmlFor="parentName"
          hint={isAdult ? "Since you're the learner, use your own name here too" : undefined}
          required
          error={errors.parentName?.message}
        >
          <Input id="parentName" invalid={!!errors.parentName} {...register("parentName")} />
        </FieldWrapper>
        <FieldWrapper
          label={isAdult ? "Your phone number" : "Parent / guardian phone"}
          htmlFor="parentPhone"
          required
          hint="e.g. 0712345678"
          error={errors.parentPhone?.message}
        >
          <Input id="parentPhone" invalid={!!errors.parentPhone} {...register("parentPhone")} />
        </FieldWrapper>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper
          label={isAdult ? "Your email" : "Parent / guardian email"}
          htmlFor="parentEmail"
          hint="Optional"
          error={errors.parentEmail?.message}
        >
          <Input
            id="parentEmail"
            type="email"
            invalid={!!errors.parentEmail}
            {...register("parentEmail")}
          />
        </FieldWrapper>
        <FieldWrapper label="County" htmlFor="county" required error={errors.county?.message}>
          <Input id="county" invalid={!!errors.county} {...register("county")} />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Anything we should know?"
        htmlFor="notes"
        hint={
          isAdult
            ? "Optional — instrument/voice focus, prior experience, goals, etc."
            : "Optional — prior music experience, learning needs, etc."
        }
        error={errors.notes?.message}
      >
        <TextArea id="notes" invalid={!!errors.notes} {...register("notes")} />
      </FieldWrapper>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-ink/20 text-teal-600 focus:ring-teal-500"
          {...register("consent")}
        />
        <span>
          I confirm the details above are accurate and I&apos;d like to register
          {isAdult ? " for Adult Music Classes at" : " this student with"} Grace Muigai Music
          Academy.
        </span>
      </label>
      {errors.consent && (
        <p role="alert" className="-mt-3 text-xs font-medium text-red-600">
          {errors.consent.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
        {isSubmitting && <Spinner className="h-4 w-4" />}
        {isSubmitting ? "Submitting..." : "Complete Registration"}
      </Button>

      {errorMessage && (
        <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
        </p>
      )}
    </form>
  );
}
