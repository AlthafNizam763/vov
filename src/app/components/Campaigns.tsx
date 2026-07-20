"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { AiFillHeart } from "react-icons/ai";
import { Info, HeartHandshake } from "lucide-react";
import DonateDialog from "./DonateDialog";
import CampaignDetailsModal from "./CampaignDetailsModal";
import {
  getCampaignGoal,
  getCampaignRaised,
  getProgressPercent,
  getSimulationCap,
  getInitialRaised,
  getNextRaised,
  isSimulationSettled,
  hashSeed,
  TICK_MS,
} from "../../lib/campaign";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Campaign = {
  _id?: string;
  title?: string;
  raised?: number | string;
  amount?: number | string;
  passage?: string;
  detail?: string;
  image?: string;
  tag?: string;
};

/** Both the bar and the counter run on this, so they always move together. */
const ANIM_MS = 1800;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Drives the simulated "live donations" figure: starts from a value derived
 * from the campaign id and steps up every TICK_MS until it settles at the cap.
 */
function useSimulatedRaised(goal: number, seed: string, realRaised: number) {
  const cap = getSimulationCap(goal);

  // Lazy initialiser is deterministic — server and client must agree on the
  // first render or hydration fails.
  const [raised, setRaised] = useState(() =>
    realRaised > 0 ? Math.min(realRaised, cap) : getInitialRaised(goal, hashSeed(seed))
  );

  useEffect(() => {
    // Users who ask for reduced motion get a static figure, not a live ticker.
    if (prefersReducedMotion()) return;
    if (isSimulationSettled(raised, cap)) return;

    // Chained timeout rather than an interval: it re-arms off each new value
    // and stops on its own once the cap is reached.
    const id = setTimeout(() => {
      setRaised((current) => getNextRaised(current, cap, Math.random()));
    }, TICK_MS);

    return () => clearTimeout(id);
  }, [raised, cap]);

  return raised;
}

/* ------------------ Animated progress bar ------------------ */
function DonationProgress({
  goal,
  seed,
  realRaised,
}: {
  goal: number;
  seed: string;
  realRaised: number;
}) {
  const raised = useSimulatedRaised(goal, seed, realRaised);
  const percent = getProgressPercent(raised, goal);
  const [width, setWidth] = useState(0);
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);

  // Grow from 0 on mount, then ease to the new value on every tick.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(percent));
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  // Count the rupee figure up in step with the bar.
  useEffect(() => {
    if (prefersReducedMotion()) {
      displayRef.current = raised;
      setDisplay(raised);
      return;
    }

    const from = displayRef.current;
    const delta = raised - from;
    if (delta === 0) return;

    let start: number | null = null;
    let frame = 0;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const t = Math.min((timestamp - start) / ANIM_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const value = from + delta * eased;
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [raised]);

  return (
    <>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold text-ink tabular-nums">
          ₹{Math.round(display).toLocaleString("en-IN")}
        </span>
        <span className="text-slate-400 tabular-nums">
          of ₹{goal.toLocaleString("en-IN")}
        </span>
      </div>
      <div
        className="w-full bg-slate-200/70 rounded-full h-2 mb-5 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(raised)}
        aria-valuemin={0}
        aria-valuemax={Math.round(goal)}
        aria-label="Donation progress"
      >
        <div
          className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full"
          style={{
            width: `${width}%`,
            // Same duration as the counter so the two never drift apart.
            transition: `width ${ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      </div>
    </>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [donateTarget, setDonateTarget] = useState<{ name?: string } | null>(null);
  const [detailsCampaign, setDetailsCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const SectionShell = ({ children }: { children: React.ReactNode }) => (
    <section id="campaigns" className="relative bg-canvas py-24 overflow-hidden">
      <span className="blob blob-accent w-[24rem] h-[24rem] top-10 -right-24 opacity-30" />
      <span className="blob blob-brand w-80 h-80 bottom-0 -left-20 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4">{children}</div>
    </section>
  );

  const Header = () => (
    <div className="mb-14 max-w-2xl">
      <span className="eyebrow">Our Campaign</span>
      <h2 className="section-title text-3xl md:text-[2.6rem] mt-4">
        Giving Help To Those Who{" "}
        <span className="text-gradient-accent">Need It</span>
      </h2>
    </div>
  );

  if (loading) {
    return (
      <SectionShell>
        <Header />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass rounded-[1.5rem] overflow-hidden">
              <div className="h-48 bg-slate-200/60 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-2/3 bg-slate-200/70 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200/60 rounded animate-pulse" />
                <div className="h-2 w-full bg-slate-200/60 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  if (campaigns.length === 0) {
    return (
      <SectionShell>
        <Header />
        <p className="text-slate-500">No campaigns available.</p>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={28}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {campaigns.map((c) => {
          // Donation UI only appears for a real, positive numeric target.
          const goal = getCampaignGoal(c.amount);
          const raised = getCampaignRaised(c.raised);

          return (
            <SwiperSlide key={c._id || c.title} className="h-auto pb-2">
              <div className="glass rounded-[1.5rem] overflow-hidden hover-lift h-full flex flex-col">
                <div className="relative h-52 w-full overflow-hidden group">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title ? `${c.title} campaign` : "Campaign"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    // /images/default.jpg doesn't exist — a branded panel beats a
                    // broken image icon.
                    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500">
                      <HeartHandshake className="w-12 h-12 text-white/70" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {c.tag && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                      {c.tag}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg mb-2 text-ink line-clamp-1">
                    {c.title || "Untitled Campaign"}
                  </h3>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed line-clamp-2">
                    {c.detail || c.passage || "No details available for this campaign."}
                  </p>

                  <div className="mt-auto">
                    {goal !== null && (
                      <DonationProgress
                        goal={goal}
                        seed={c._id || c.title || "campaign"}
                        realRaised={raised}
                      />
                    )}

                    <div className="flex gap-3">
                      {goal !== null && (
                        <button
                          onClick={() => setDonateTarget({ name: c.title })}
                          className="btn btn-primary flex-1 text-sm py-2.5 px-3"
                        >
                          Donate <AiFillHeart className="text-white" />
                        </button>
                      )}
                      <button
                        onClick={() => setDetailsCampaign(c)}
                        className={`btn btn-outline text-sm py-2.5 px-3 ${
                          goal !== null ? "flex-1" : "w-full"
                        }`}
                      >
                        <Info className="w-4 h-4" /> Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {detailsCampaign && (
        <CampaignDetailsModal
          campaign={detailsCampaign}
          onClose={() => setDetailsCampaign(null)}
          onDonate={
            getCampaignGoal(detailsCampaign.amount) !== null
              ? () => setDonateTarget({ name: detailsCampaign.title })
              : undefined
          }
        />
      )}

      <DonateDialog
        open={donateTarget !== null}
        onClose={() => setDonateTarget(null)}
        campaignName={donateTarget?.name}
      />
    </SectionShell>
  );
}
