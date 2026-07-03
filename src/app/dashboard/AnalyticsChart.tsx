"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type ChartPoint = { name: string; value: number };

interface TooltipEntry {
  value: number;
}
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-4 py-2.5 shadow-lg">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-display font-bold text-ink">
        ₹{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function AnalyticsChart({ data }: { data: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f7fd6" stopOpacity={0.35} />
            <stop offset="60%" stopColor="#12b07a" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#12b07a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="dashLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1f7fd6" />
            <stop offset="100%" stopColor="#12b07a" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(15,30,46,0.07)" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
          dy={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(31,127,214,0.3)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="url(#dashLine)"
          strokeWidth={3}
          fill="url(#dashArea)"
          isAnimationActive={false}
          dot={{ r: 4, fill: "#fff", stroke: "#1f7fd6", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "#12b07a", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
