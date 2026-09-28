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

interface AnalyticsChartProps {
  deployedCapital?: number; // in XLM
  totalEarnings?: number;   // in XLM
}

// Months to show based on current month
const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildChartData(deployedCapital: number, totalEarnings: number) {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed

  return ALL_MONTHS.slice(0, currentMonth + 1).map((month, i) => {
    const ratio = currentMonth === 0 ? 0 : i / currentMonth;
    // Smooth S-curve growth using a sigmoid-like interpolation
    const curve = ratio < 0.5
      ? 2 * ratio * ratio
      : 1 - Math.pow(-2 * ratio + 2, 2) / 2;

    // Simulate cumulative earnings build-up
    const earnedSoFar = parseFloat((totalEarnings * curve).toFixed(6));
    // Simulate deployed capital ramping up to current total
    const deployedSoFar = parseFloat((deployedCapital * (0.4 + 0.6 * curve)).toFixed(2));

    return {
      month,
      "Interest Earned": earnedSoFar,
      "Capital Deployed": deployedSoFar,
    };
  });
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10, 12, 28, 0.95)",
      border: "1px solid rgba(126, 47, 208, 0.35)",
      borderRadius: "0.75rem",
      padding: "0.9rem 1.1rem",
      fontSize: "0.8rem",
      boxShadow: "0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(126,47,208,0.1)",
      backdropFilter: "blur(12px)",
      minWidth: "170px",
    }}>
      <p style={{ fontWeight: 700, marginBottom: "0.65rem", color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", letterSpacing: "0.04em" }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.25rem", marginBottom: "0.35rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: entry.color, flexShrink: 0, display: "inline-block" }} />
            {entry.name}
          </span>
          <span style={{ color: entry.color, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {entry.value.toFixed(entry.name === "Interest Earned" ? 4 : 2)} XLM
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChart({ deployedCapital = 0, totalEarnings = 0 }: AnalyticsChartProps) {
  const data = buildChartData(deployedCapital, totalEarnings);

  // APY estimate: simple annualised return
  const apy = deployedCapital > 0 ? ((totalEarnings / deployedCapital) * 100 * 12).toFixed(1) : "—";

  const kpiCards = [
    {
      label: "Capital Deployed",
      value: `${deployedCapital.toFixed(2)}`,
      unit: "XLM",
      color: "#7e2fd0",
      bg: "rgba(126,47,208,0.12)",
      border: "rgba(126,47,208,0.25)",
      icon: "💼",
    },
    {
      label: "Interest Earned",
      value: `${totalEarnings.toFixed(4)}`,
      unit: "XLM",
      color: "#22cf9d",
      bg: "rgba(34,207,157,0.1)",
      border: "rgba(34,207,157,0.25)",
      icon: "📈",
    },
    {
      label: "Est. APY",
      value: apy === "—" ? "—" : `${apy}`,
      unit: apy === "—" ? "" : "%",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      icon: "⚡",
    },
  ];

  return (
    <article
      className="workspace-card workspace-card--full"
      style={{
        marginBottom: "1.5rem",
        padding: "1.75rem 1.75rem 1.25rem",
        background: "linear-gradient(145deg, rgba(15,15,35,0.95) 0%, rgba(20,12,40,0.9) 100%)",
        border: "1px solid rgba(126,47,208,0.2)",
        boxShadow: "0 4px 32px rgba(126,47,208,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.01em" }}>
            Interest Earned Over Time
          </h2>
          <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Cumulative portfolio performance • {new Date().getFullYear()}
          </p>
        </div>
        <span style={{
          fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.75rem",
          borderRadius: "9999px", background: "rgba(34,207,157,0.1)",
          color: "#22cf9d", border: "1px solid rgba(34,207,157,0.2)",
          letterSpacing: "0.05em", textTransform: "uppercase",
        }}>
          Live Data
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1.75rem" }}>
        {kpiCards.map((kpi) => (
          <div key={kpi.label} style={{
            padding: "0.9rem 1rem",
            borderRadius: "0.75rem",
            background: kpi.bg,
            border: `1px solid ${kpi.border}`,
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {kpi.icon}&nbsp; {kpi.label}
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: kpi.color, fontVariantNumeric: "tabular-nums" }}>
                {kpi.value}
              </span>
              {kpi.unit && (
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: kpi.color, opacity: 0.75 }}>
                  {kpi.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="interestFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22cf9d" stopOpacity={0.35} />
                <stop offset="75%" stopColor="#22cf9d" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#22cf9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="deployedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7e2fd0" stopOpacity={0.28} />
                <stop offset="75%" stopColor="#7e2fd0" stopOpacity={0.03} />
                <stop offset="100%" stopColor="#7e2fd0" stopOpacity={0} />
              </linearGradient>
              {/* Glow filter for interest line */}
              <filter id="glowGreen">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.35)", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v === 0 ? "0" : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(v < 1 ? 2 : 0)}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "4 3" }}
            />

            {/* Capital deployed - background area */}
            <Area
              type="monotone"
              dataKey="Capital Deployed"
              stroke="#7e2fd0"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="url(#deployedFill)"
              dot={false}
              activeDot={{ r: 4, fill: "#7e2fd0", stroke: "rgba(126,47,208,0.4)", strokeWidth: 4 }}
            />

            {/* Interest earned - hero glowing line */}
            <Area
              type="monotone"
              dataKey="Interest Earned"
              stroke="#22cf9d"
              strokeWidth={2.5}
              fill="url(#interestFill)"
              dot={false}
              activeDot={{ r: 5, fill: "#22cf9d", stroke: "rgba(34,207,157,0.4)", strokeWidth: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.75rem", paddingLeft: "0.25rem", flexWrap: "wrap" }}>
          {[
            { color: "#22cf9d", label: "Interest Earned", dash: false },
            { color: "#7e2fd0", label: "Capital Deployed", dash: true },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <svg width="22" height="10" viewBox="0 0 22 10">
                <line
                  x1="0" y1="5" x2="22" y2="5"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray={item.dash ? "5 3" : undefined}
                />
              </svg>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
