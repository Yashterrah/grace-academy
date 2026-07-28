"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validators";
import { FieldWrapper, Input, TextArea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const honeypotRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus("idle");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, company: honeypotRef.current?.value ?? "" }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — hidden from sighted users and screen readers, bots often fill it in */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" ref={honeypotRef} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrapper label="Full name" htmlFor="name" required error={errors.name?.message}>
          <Input id="name" invalid={!!errors.name} {...register("name")} />
        </FieldWrapper>
        <FieldWrapper label="Email address" htmlFor="email" required error={errors.email?.message}>
          <Input id="email" type="email" invalid={!!errors.email} {...register("email")} />
        </FieldWrapper>
      </div>

      <FieldWrapper
        label="Phone number"
        htmlFor="phone"
        hint="Optional — e.g. 0712345678"
        error={errors.phone?.message}
      >
        <Input id="phone" invalid={!!errors.phone} {...register("phone")} />
      </FieldWrapper>

      <FieldWrapper label="Subject" htmlFor="subject" required error={errors.subject?.message}>
        <Input id="subject" invalid={!!errors.subject} {...register("subject")} />
      </FieldWrapper>

      <FieldWrapper label="Message" htmlFor="message" required error={errors.message?.message}>
        <TextArea id="message" invalid={!!errors.message} {...register("message")} />
      </FieldWrapper>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      <AnimatePresence>
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-3 text-sm font-medium text-teal-700"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Message sent — Tr. Grace will get back to
            you shortly.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" /> {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
