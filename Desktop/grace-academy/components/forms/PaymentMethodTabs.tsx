"use client";

import * as React from "react";
import { Zap, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { MPESA } from "@/lib/constants";
import { StkPushPayment } from "@/components/forms/StkPushPayment";
import { PaymentUploadForm } from "@/components/forms/PaymentUploadForm";

export function PaymentMethodTabs() {
  const [tab, setTab] = React.useState<"stk" | "manual">(
    MPESA.stkPushEnabled ? "stk" : "manual"
  );

  return (
    <div>
      {MPESA.stkPushEnabled && (
        <div role="tablist" aria-label="Payment method" className="mb-6 grid grid-cols-2 gap-2">
          <button
            role="tab"
            aria-selected={tab === "stk"}
            onClick={() => setTab("stk")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              tab === "stk" ? "bg-teal-600 text-cream-50" : "bg-cream-100 text-ink-soft hover:bg-cream-200"
            )}
          >
            <Zap className="h-3.5 w-3.5" /> Pay Instantly
          </button>
          <button
            role="tab"
            aria-selected={tab === "manual"}
            onClick={() => setTab("manual")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              tab === "manual" ? "bg-teal-600 text-cream-50" : "bg-cream-100 text-ink-soft hover:bg-cream-200"
            )}
          >
            <Upload className="h-3.5 w-3.5" /> Upload Screenshot
          </button>
        </div>
      )}

      {tab === "stk" && MPESA.stkPushEnabled ? <StkPushPayment /> : <PaymentUploadForm />}
    </div>
  );
}
