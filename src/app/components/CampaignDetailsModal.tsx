"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Target, HeartHandshake } from "lucide-react";
import { AiFillHeart } from "react-icons/ai";
import { getCampaignGoal } from "../../lib/campaign";

export type CampaignDetails = {
  title?: string;
  amount?: number | string;
  detail?: string;
  passage?: string;
  image?: string;
  tag?: string;
};

const EXIT_MS = 200;

export default function CampaignDetailsModal({
  campaign,
  onClose,
  onDonate,
}: {
  campaign: CampaignDetails;
  onClose: () => void;
  /** Omitted when the campaign has no valid target — no donate CTA is shown. */
  onDonate?: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const goal = getCampaignGoal(campaign.amount);

  // Play the exit animation before unmounting.
  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      // Keep focus inside the dialog.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [requestClose]);

  const description =
    [campaign.detail, campaign.passage].find((t) => t && t.trim()) || null;
  // Show the second field too when both are present and actually differ.
  const secondary =
    campaign.detail?.trim() &&
    campaign.passage?.trim() &&
    campaign.detail.trim() !== campaign.passage.trim()
      ? campaign.passage
      : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-details-title"
    >
      <div
        className={`fixed inset-0 bg-ink/60 backdrop-blur-sm ${
          closing ? "animate-overlay-out" : "animate-overlay-in"
        }`}
        onClick={requestClose}
      />

      <div
        ref={panelRef}
        className={`relative w-full sm:max-w-2xl my-0 sm:my-8 glass-strong rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[88vh] flex flex-col ${
          closing ? "animate-panel-out" : "animate-panel-in"
        }`}
      >
        {/* Grab handle — reads as a bottom sheet on mobile */}
        <span className="sm:hidden mx-auto mt-3 h-1.5 w-11 shrink-0 rounded-full bg-slate-300" />

        <button
          ref={closeButtonRef}
          onClick={requestClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-10 grid place-items-center w-9 h-9 rounded-full bg-white/85 text-slate-600 shadow-md ring-1 ring-black/5 hover:bg-white hover:text-ink transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto scroll-thin">
          {/* Image */}
          <div className="relative w-full h-52 sm:h-64 shrink-0">
            {campaign.image ? (
              <Image
                src={campaign.image}
                alt={campaign.title ? `${campaign.title} campaign` : "Campaign"}
                fill
                sizes="(max-width: 640px) 100vw, 672px"
                className="object-cover"
              />
            ) : (
              // No stock fallback file exists — use a branded panel instead of a
              // broken <img>.
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500">
                <HeartHandshake className="w-14 h-14 text-white/70" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            {campaign.tag && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                {campaign.tag}
              </span>
            )}
          </div>

          <div className="p-6 sm:p-7">
            <span className="eyebrow">Campaign</span>
            <h2
              id="campaign-details-title"
              className="font-display font-bold text-2xl sm:text-[1.75rem] text-ink mt-2 leading-snug"
            >
              {campaign.title || "Untitled Campaign"}
            </h2>

            {/* Target amount — only when the campaign has a real one */}
            {goal !== null && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/70 border border-black/5 px-4 py-3.5">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-sm shrink-0">
                  <Target className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 font-bold">
                    Target Amount
                  </p>
                  <p className="font-display font-bold text-lg text-ink">
                    ₹{goal.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5">
              <h3 className="font-display font-bold text-ink text-base mb-2">
                About this campaign
              </h3>
              {description ? (
                <p className="text-slate-600 text-sm sm:text-[0.95rem] leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic">
                  No details have been added for this campaign yet.
                </p>
              )}
              {secondary && (
                <p className="text-slate-600 text-sm sm:text-[0.95rem] leading-relaxed whitespace-pre-line mt-3">
                  {secondary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky footer actions */}
        <div className="shrink-0 border-t border-black/5 bg-white/60 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col-reverse sm:flex-row gap-3">
          <button onClick={requestClose} className="btn btn-outline flex-1">
            Close
          </button>
          {onDonate && (
            <button
              onClick={() => {
                setClosing(true);
                setTimeout(() => {
                  onClose();
                  onDonate();
                }, EXIT_MS);
              }}
              className="btn btn-primary flex-1"
            >
              Donate <AiFillHeart className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
