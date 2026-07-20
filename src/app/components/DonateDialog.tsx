"use client";

import { useEffect, useState } from "react";
import { X, HeartHandshake } from "lucide-react";
import { showDonationSuccess, showPaymentError } from "./paymentFeedback";
import { validateDonationAmount } from "../../lib/donation";

/* ------------------ Razorpay types ------------------ */
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  theme: { color: string };
  method?: Record<string, boolean>;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  error?: string;
}

const QUICK_AMOUNTS = [100, 500, 1000, 2500];

export type DonateDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Campaign / context name shown on the Razorpay checkout. */
  campaignName?: string;
  /** Pre-fills the amount field when the dialog opens. */
  defaultAmount?: number;
  /** Restrict checkout to a single Razorpay method (e.g. "upi"). */
  method?: string;
};

export default function DonateDialog({
  open,
  onClose,
  campaignName,
  defaultAmount,
  method,
}: DonateDialogProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset to a clean slate each time the dialog is opened.
  useEffect(() => {
    if (open) {
      setAmount(defaultAmount ? String(defaultAmount) : "");
      setError(null);
      setLoading(false);
    }
  }, [open, defaultAmount]);

  // Close on Escape, and lock background scroll while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleAmountChange = (value: string) => {
    // Allow only digits and a single decimal point while typing.
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    setAmount(value);
    if (error) setError(null);
  };

  const handleDonate = async () => {
    const validationError = validateDonationAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const order: RazorpayOrder = await res.json();

      if (!res.ok || !order.id) {
        showPaymentError(order.error || "We couldn't start the payment. Please try again.");
        setLoading(false);
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        // Always use the server's amount — it's the one the order was created with.
        amount: order.amount,
        currency: order.currency,
        name: "Voice of the Voiceless",
        description: campaignName ? `Donation — ${campaignName}` : "Donation",
        order_id: order.id,
        handler: (response: RazorpayResponse) => {
          showDonationSuccess({
            paymentId: response.razorpay_payment_id,
            message: campaignName
              ? `Thank you for supporting “${campaignName}” with ₹${Number(
                  amount
                ).toLocaleString("en-IN")}.`
              : `Thank you — your ₹${Number(amount).toLocaleString(
                  "en-IN"
                )} donation changes lives.`,
          });
          onClose();
        },
        theme: { color: "#12b07a" },
        ...(method ? { method: { [method]: true } } : {}),
      };

      const RazorpayConstructor = (
        window as unknown as {
          Razorpay: new (options: RazorpayOptions) => { open: () => void };
        }
      ).Razorpay;

      if (!RazorpayConstructor) {
        showPaymentError("Payment gateway is still loading. Please try again in a moment.");
        setLoading(false);
        return;
      }

      const razor = new RazorpayConstructor(options);
      razor.open();
      setLoading(false);
    } catch (err) {
      console.error("Error starting payment:", err);
      showPaymentError("Your payment could not be processed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-dialog-title"
    >
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md glass-strong rounded-[1.5rem] shadow-2xl p-6 sm:p-7 animate-slide-up">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-black/5 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-md mb-4">
          <HeartHandshake className="w-6 h-6" />
        </span>

        <h2
          id="donate-dialog-title"
          className="font-display font-bold text-xl text-ink leading-snug"
        >
          {campaignName ? `Support ${campaignName}` : "Make a Donation"}
        </h2>
        <p className="text-sm text-slate-600 mt-1.5 mb-5">
          Every contribution counts. Enter the amount you&apos;d like to give.
        </p>

        {/* Quick-pick amounts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleAmountChange(String(value))}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                amount === String(value)
                  ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white border-transparent shadow-sm"
                  : "bg-white/70 text-slate-600 border-black/10 hover:border-accent-400 hover:text-accent-700"
              }`}
            >
              ₹{value.toLocaleString("en-IN")}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <label htmlFor="donation-amount" className="dash-label">
          Donation amount (₹)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold pointer-events-none">
            ₹
          </span>
          <input
            id="donation-amount"
            type="text"
            inputMode="decimal"
            autoFocus
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleDonate();
            }}
            placeholder="Enter amount"
            aria-invalid={!!error}
            aria-describedby={error ? "donation-amount-error" : undefined}
            className={`dash-input pl-9 ${error ? "has-error" : ""}`}
          />
        </div>

        {error && (
          <p id="donation-amount-error" role="alert" className="text-sm text-red-600 mt-2">
            {error}
          </p>
        )}

        <button
          onClick={handleDonate}
          disabled={loading}
          className="btn btn-primary w-full mt-5"
        >
          {loading ? "Processing..." : "Donate Now"}
        </button>

        <p className="text-xs text-slate-500 text-center mt-3">
          Secure payment powered by Razorpay.
        </p>
      </div>
    </div>
  );
}
