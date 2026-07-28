"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { paymentUploadSchema, type PaymentUploadInput } from "@/lib/validators";
import { createPayment } from "@/firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { generateReference } from "@/lib/utils";
import { FieldWrapper, Input, TextArea } from "@/components/ui/FormField";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function PaymentUploadForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [uploadStage, setUploadStage] = React.useState<"idle" | "uploading" | "saving">("idle");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentUploadInput>({
    resolver: zodResolver(paymentUploadSchema),
    defaultValues: { bookingReference: searchParams.get("ref") ?? "" },
  });

  const onSubmit = async (data: PaymentUploadInput) => {
    setErrorMessage(null);
    const file = data.proof[0];
    if (!file) {
      setErrorMessage("Please attach your M-Pesa confirmation screenshot.");
      return;
    }

    const reference = generateReference("PAY");

    try {
      setUploadStage("uploading");
      const { url } = await uploadToCloudinary(file, `payment-proofs/${data.bookingReference}`);

      setUploadStage("saving");
      await createPayment({
        bookingReference: data.bookingReference,
        studentName: data.studentName,
        amount: data.amount,
        mpesaMessage: data.mpesaMessage || undefined,
        proofUrl: url,
        proofFileName: file.name,
        status: "pending",
        createdAt: new Date().toISOString(),
        reference,
      });

      router.push(
        `/booking/success?ref=${reference}&booking=${encodeURIComponent(data.bookingReference)}`
      );
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setUploadStage("idle");
    }
  };

  const busy = isSubmitting || uploadStage !== "idle";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <FieldWrapper
        label="Booking reference"
        htmlFor="bookingReference"
        required
        hint="From your booking confirmation, e.g. BOOK-9K2P1"
        error={errors.bookingReference?.message}
      >
        <Input
          id="bookingReference"
          invalid={!!errors.bookingReference}
          {...register("bookingReference")}
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

      <FieldWrapper
        label="Amount paid (KSh)"
        htmlFor="amount"
        required
        error={errors.amount?.message}
      >
        <Input id="amount" type="number" invalid={!!errors.amount} {...register("amount")} />
      </FieldWrapper>

      <FieldWrapper
        label="M-Pesa confirmation message"
        htmlFor="mpesaMessage"
        hint="Optional — paste the SMS text for faster verification"
        error={errors.mpesaMessage?.message}
      >
        <TextArea id="mpesaMessage" invalid={!!errors.mpesaMessage} {...register("mpesaMessage")} />
      </FieldWrapper>

      <FieldWrapper
        label="Payment confirmation screenshot"
        htmlFor="proof"
        required
        error={errors.proof?.message as string | undefined}
      >
        <FileUpload
          id="proof"
          label="Upload M-Pesa screenshot"
          invalid={!!errors.proof}
          onFilesSelected={(files) => setValue("proof", files as FileList, { shouldValidate: true })}
        />
      </FieldWrapper>

      <Button type="submit" disabled={busy} size="lg" className="w-full sm:w-auto">
        {busy && <Spinner className="h-4 w-4" />}
        {uploadStage === "uploading"
          ? "Uploading screenshot..."
          : uploadStage === "saving"
            ? "Confirming payment..."
            : "Submit Payment Confirmation"}
      </Button>

      {errorMessage && (
        <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
        </p>
      )}
    </form>
  );
}
