"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  HandHeart,
  Megaphone,
  CalendarDays,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from "lucide-react";
import type { ChartPoint } from "./AnalyticsChart";

const AnalyticsChart = dynamic(() => import("./AnalyticsChart"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full grid place-items-center text-slate-400 text-sm animate-pulse">
      Loading chart…
    </div>
  ),
});

interface DashboardData {
  totalDonations: number;
  donationCount: number;
  failedCount: number;
  donationTrend: number | null;
  campaigns: number;
  programs: number;
  teamMembers: number;
  users: number;
  monthly: ChartPoint[];
  rangeLabel: string;
  recent: { name: string; date: string; amount: string; status: string }[];
  razorpayError: boolean;
  mongoError: boolean;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load dashboard");
        setData(await res.json());
      } catch (e) {
        console.error("❌ Dashboard load error:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = data
    ? [
        {
          title: "Total Donations",
          value: `₹${data.totalDonations.toLocaleString("en-IN")}`,
          sub: `${data.donationCount} captured payment${data.donationCount === 1 ? "" : "s"}`,
          trend: data.donationTrend,
          icon: HandHeart,
          from: "from-brand-500",
          to: "to-brand-700",
        },
        {
          title: "Active Campaigns",
          value: `${data.campaigns}`,
          sub: "Live on the site",
          trend: null,
          icon: Megaphone,
          from: "from-accent-400",
          to: "to-accent-600",
        },
        {
          title: "Programs",
          value: `${data.programs}`,
          sub: "Published programs",
          trend: null,
          icon: CalendarDays,
          from: "from-brand-400",
          to: "to-accent-500",
        },
        {
          title: "Team Members",
          value: `${data.teamMembers}`,
          sub: "On the team",
          trend: null,
          icon: Users,
          from: "from-accent-500",
          to: "to-brand-600",
        },
      ]
    : [];

  const chartEmpty =
    !!data && data.monthly.every((m) => m.value === 0);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <span className="eyebrow">Overview</span>
        <h2 className="section-title text-2xl md:text-3xl mt-2">
          Welcome back, <span className="text-gradient">Member</span>
        </h2>
      </div>

      {error && (
        <div className="dash-card p-5 flex items-center gap-3 text-red-600">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Couldn&apos;t load dashboard data. Please refresh or try again shortly.
          </p>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="dash-card p-5">
                <div className="w-12 h-12 rounded-2xl bg-slate-200/70 animate-pulse" />
                <div className="h-4 w-24 bg-slate-200/70 rounded mt-5 animate-pulse" />
                <div className="h-7 w-28 bg-slate-200/70 rounded mt-2 animate-pulse" />
              </div>
            ))
          : stats.map((s) => {
              const up = (s.trend ?? 0) >= 0;
              return (
                <div key={s.title} className="dash-card p-5 hover-lift">
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br ${s.from} ${s.to} text-white shadow-md`}
                    >
                      <s.icon className="w-6 h-6" />
                    </span>
                    {s.trend !== null && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          up ? "bg-accent-50 text-accent-700" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {up ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {up ? "+" : ""}
                        {s.trend}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-4">{s.title}</p>
                  <p className="font-display text-2xl font-bold text-ink mt-0.5">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                </div>
              );
            })}
      </div>

      {/* Analytics + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="dash-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-ink text-lg">Donations Overview</h3>
              <p className="text-sm text-slate-500">
                Captured donations · {data?.rangeLabel ?? "last 6 months"}
              </p>
            </div>
            {data?.donationCount ? (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent-50 text-accent-700">
                ₹{data.totalDonations.toLocaleString("en-IN")} total
              </span>
            ) : null}
          </div>
          <div className="h-64 relative">
            {loading ? (
              <div className="h-full w-full grid place-items-center text-slate-400 text-sm animate-pulse">
                Loading chart…
              </div>
            ) : (
              <>
                <AnalyticsChart data={data?.monthly ?? []} />
                {chartEmpty && (
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <span className="text-sm text-slate-400 bg-white/70 rounded-full px-4 py-1.5">
                      No captured donations in the last 6 months
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className="dash-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-ink text-lg">Recent Activity</h3>
            {data && data.failedCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                {data.failedCount} failed
              </span>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto scroll-thin -mr-2 pr-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-3 border-b border-black/5 last:border-0">
                  <div className="h-4 w-40 bg-slate-200/70 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-slate-200/60 rounded mt-2 animate-pulse" />
                </div>
              ))
            ) : data?.razorpayError ? (
              <div className="flex items-start gap-2.5 text-amber-600 py-4">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm">
                  Razorpay data is currently unavailable. Check the API keys and try again.
                </p>
              </div>
            ) : data && data.recent.length > 0 ? (
              data.recent.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-black/5 last:border-0"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-medium text-ink text-sm truncate">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-semibold text-ink text-sm">{t.amount}</span>
                    <span
                      className={`block mt-0.5 text-[0.7rem] font-semibold ${
                        t.status === "Received"
                          ? "text-accent-600"
                          : t.status === "Failed"
                          ? "text-red-500"
                          : "text-slate-400"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">
                No donations yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
