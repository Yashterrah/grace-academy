import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block font-body text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-violet-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink-faint/70 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-60";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      fieldBase,
      invalid ? "border-red-400 focus:border-red-500" : "border-ink/10 focus:border-teal-500",
      className
    )}
    aria-invalid={invalid || undefined}
    {...props}
  />
));
Input.displayName = "Input";

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      fieldBase,
      "min-h-[120px] resize-y",
      invalid ? "border-red-400 focus:border-red-500" : "border-ink/10 focus:border-teal-500",
      className
    )}
    aria-invalid={invalid || undefined}
    {...props}
  />
));
TextArea.displayName = "TextArea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      fieldBase,
      "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%236B767C%22><path d=%22M5.5 7.5l4.5 4.5 4.5-4.5%22 stroke=%22%236B767C%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-10",
      invalid ? "border-red-400 focus:border-red-500" : "border-ink/10 focus:border-teal-500",
      className
    )}
    aria-invalid={invalid || undefined}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
