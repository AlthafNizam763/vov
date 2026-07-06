"use client";

import toast, { type Toast } from "react-hot-toast";
import { useState } from "react";
import { Check, Copy, X, AlertTriangle, HeartHandshake } from "lucide-react";

/* ------------------------------------------------------------------
   Reusable, on-brand payment feedback (replaces plain window.alert)
   ------------------------------------------------------------------ */

const SUCCESS_DURATION = 7000;
const ERROR_DURATION = 6000;

function ProgressBar({ duration, className }: { duration: number; className: string }) {
  return (
    <span
      className={`absolute bottom-0 left-0 h-1 w-full origin-left rounded-b-2xl ${className}`}
      style={{ animation: `toast-progress ${duration}ms linear forwards` }}
    />
  );
}

function SuccessToast({
  t,
  paymentId,
  title,
  message,
}: {
  t: Toast;
  paymentId?: string;
  title: string;
  message: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!paymentId) return;
    try {
      await navigator.clipboard.writeText(paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } relative overflow-hidden w-[92vw] max-w-sm glass-strong rounded-2xl shadow-2xl p-4 pb-5 flex items-start gap-4 ring-1 ring-accent-200/60`}
      role="status"
      aria-live="polite"
    >
      <span className="grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-md shrink-0 animate-pulse-ring">
        <Check strokeWidth={3} className="w-6 h-6" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-ink flex items-center gap-1.5">
          {title}
          <HeartHandshake className="w-4 h-4 text-accent-500" />
        </p>
        <p className="text-sm text-slate-600 mt-0.5">{message}</p>

        {paymentId && (
          <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-white/70 border border-black/5 px-2.5 py-1.5">
            <span className="text-[0.65rem] uppercase tracking-wide text-slate-400 font-bold">
              ID
            </span>
            <span className="font-mono text-xs text-slate-700 truncate">{paymentId}</span>
            <button
              onClick={copy}
              aria-label="Copy payment ID"
              className="ml-auto grid place-items-center w-6 h-6 rounded-md text-slate-400 hover:text-accent-600 hover:bg-accent-50 transition shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss"
        className="grid place-items-center w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-black/5 transition shrink-0"
      >
        <X className="w-4 h-4" />
      </button>

      <ProgressBar duration={SUCCESS_DURATION} className="bg-gradient-to-r from-accent-400 to-accent-600" />
    </div>
  );
}

function ErrorToast({ t, message }: { t: Toast; message: string }) {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } relative overflow-hidden w-[92vw] max-w-sm glass-strong rounded-2xl shadow-2xl p-4 pb-5 flex items-start gap-4 ring-1 ring-red-200/70`}
      role="alert"
    >
      <span className="grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-md shrink-0">
        <AlertTriangle className="w-6 h-6" />
      </span>

      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-ink">Payment Failed</p>
        <p className="text-sm text-slate-600 mt-0.5">{message}</p>
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss"
        className="grid place-items-center w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-black/5 transition shrink-0"
      >
        <X className="w-4 h-4" />
      </button>

      <ProgressBar duration={ERROR_DURATION} className="bg-gradient-to-r from-red-400 to-red-600" />
    </div>
  );
}

/** Show a premium donation-success notification. */
export function showDonationSuccess(opts: {
  paymentId?: string;
  title?: string;
  message?: string;
}) {
  const { paymentId, title = "Donation Successful!", message = "Thank you — your support changes lives." } = opts;
  toast.custom(
    (t) => <SuccessToast t={t} paymentId={paymentId} title={title} message={message} />,
    { duration: SUCCESS_DURATION, position: "top-center" }
  );
}

/** Show a premium payment-error notification. */
export function showPaymentError(message = "Something went wrong. Please try again.") {
  toast.custom((t) => <ErrorToast t={t} message={message} />, {
    duration: ERROR_DURATION,
    position: "top-center",
  });
}
