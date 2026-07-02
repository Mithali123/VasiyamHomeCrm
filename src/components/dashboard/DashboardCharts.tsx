/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, PieSectorShapeProps, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";
import { Award, TrendingUp, Users } from "lucide-react";
import { funnelStages, leadSources, leadTrendData } from "@/mock/dashboard";

// ============================================================
// 1. HELPER COMPONENTS
// ============================================================

const CardTitle = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) => (
  <div className="mb-3 flex items-start justify-between gap-3">
    <div>
      <h2 className="text-[12px] font-bold uppercase tracking-[-.01em] text-[#15191a]">
        {title}
      </h2>
      <p className="mt-0.5 text-[8px] text-[#788085]">{subtitle}</p>
    </div>
    {action}
  </div>
);

/**
 * Safely parse lead counts that may contain thousands separators (e.g., "4,128")
 */
const parseLeadCount = (value: string | number | null | undefined): number => {
  const parsed = Number(String(value ?? 0).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

// ============================================================
// 2. SALES FUNNEL WIDGET
// ============================================================

export function SalesFunnel() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [funnelPeriod, setFunnelPeriod] = useState("This Month");

  // ── Funnel geometry constants ──
  const X_CENTER = 110;
  const W_MAX = 165;
  const W_MIN = 30;
  const HEIGHT = 210;
  const BAND_H = 23;
  const BAND_OFFSET = 4;

  const getWidth = (y: number) => W_MAX - (W_MAX - W_MIN) * (y / HEIGHT);
  const getCurveOffset = (width: number) => width * 0.07;

  const getFrontSegmentPath = (index: number) => {
    const y1 = index * (BAND_H + BAND_OFFSET) + BAND_OFFSET;
    const y2 = y1 + BAND_H;
    const w1 = getWidth(y1);
    const w2 = getWidth(y2);
    const xTl = X_CENTER - w1 / 2;
    const xTr = X_CENTER + w1 / 2;
    const xBl = X_CENTER - w2 / 2;
    const xBr = X_CENTER + w2 / 2;
    const cvTop = getCurveOffset(w1);
    const cvBottom = getCurveOffset(w2);

    return [
      `M ${xTl} ${y1}`,
      `Q ${X_CENTER} ${y1 - cvTop} ${xTr} ${y1}`,
      `L ${xBr} ${y2}`,
      `Q ${X_CENTER} ${y2 + cvBottom} ${xBl} ${y2}`,
      `Z`,
    ].join(" ");
  };

  const getWhiteSeparator = (index: number) => {
    if (index >= funnelStages.length - 1) return null;
    const y2 = index * (BAND_H + BAND_OFFSET) + BAND_OFFSET + BAND_H;
    const y1n = (index + 1) * (BAND_H + BAND_OFFSET) + BAND_OFFSET;
    const w2 = getWidth(y2);
    const w1n = getWidth(y1n);
    const cv2 = getCurveOffset(w2);
    const cv1n = getCurveOffset(w1n);

    const d = [
      `M ${X_CENTER - w2 / 2} ${y2}`,
      `Q ${X_CENTER} ${y2 + cv2} ${X_CENTER + w2 / 2} ${y2}`,
      `L ${X_CENTER + w1n / 2} ${y1n}`,
      `Q ${X_CENTER} ${y1n - cv1n} ${X_CENTER - w1n / 2} ${y1n}`,
      `Z`,
    ].join(" ");

    return <path key={`sep-${index}`} d={d} fill="white" className="pointer-events-none" />;
  };

  const getTooltipPosition = (index: number) => {
    const yCenter = index * (BAND_H + BAND_OFFSET) + BAND_OFFSET + BAND_H / 2;
    const y1 = index * (BAND_H + BAND_OFFSET) + BAND_OFFSET;
    const y2 = y1 + BAND_H;
    const w1 = getWidth(y1);
    const w2 = getWidth(y2);
    const xRightAvg = X_CENTER + (w1 + w2) / 4;

    return {
      left: `${((xRightAvg + 8) / 260) * 100}%`,
      top: `${(yCenter / 248) * 100}%`,
    };
  };

  const getTextColor = (color: string) =>
    color === "#dda90c" || color === "#f29b0b" ? "#3b2c00" : "#ffffff";

  // ── Data calculations ──
  const totalLeads = parseLeadCount(funnelStages[0]?.leads);
  
  // Calculate overall conversion from Won leads
  const wonLeads = parseLeadCount(
    funnelStages.find((stage) => stage.name.toLowerCase() === "won")?.leads,
  );
  const overallConversion = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

  const getStageMetrics = (index: number) => {
    const currentLeads = parseLeadCount(funnelStages[index]?.leads);
    const previousLeads = index > 0
      ? parseLeadCount(funnelStages[index - 1]?.leads)
      : 0;
    const hasValidTransition =
      index > 0 && previousLeads > 0 && currentLeads <= previousLeads;

    return {
      conversionPercentage: hasValidTransition
        ? (currentLeads / previousLeads) * 100
        : null,
      dropPercentage: hasValidTransition
        ? ((previousLeads - currentLeads) / previousLeads) * 100
        : null,
      stagePercentage: totalLeads > 0
        ? (currentLeads / totalLeads) * 100
        : 0,
    };
  };

  const activeStageIndex = funnelStages.findIndex((s) => s.name === hoveredStage);
  const activeStage = activeStageIndex !== -1 ? funnelStages[activeStageIndex] : null;

  // ── Render ──
  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInScaleFunnel {
            from { opacity: 0; transform: translateY(-50%) scale(0.93); }
            to   { opacity: 1; transform: translateY(-50%) scale(1); }
          }
          .funnel-tooltip {
            animation: fadeInScaleFunnel 0.18s cubic-bezier(0.16,1,0.3,1) forwards;
            transform-origin: left center;
          }
        `
      }} />

      <CardTitle
        title="Sales Funnel"
        subtitle="Track performance across the sales pipeline"
        action={
          <div className="flex overflow-hidden rounded-md border border-[#e4e6e7]">
            {["This Week", "This Month", "This Quarter", "This Year"].map((item) => (
              <button
                key={item}
                onClick={() => setFunnelPeriod(item)}
                className={`h-7 px-3 text-[7.5px] transition-colors cursor-pointer ${
                  funnelPeriod === item
                    ? "bg-[#073d2e] text-white"
                    : "bg-white text-[#42484b] hover:bg-gray-50"
                }`}
              >
                {item.replace("This ", "")}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-[230px_1fr] gap-4">
        {/* ─── Left: Funnel SVG ─── */}
        <div className="relative flex h-[215px] items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 240 215" className="overflow-visible">
            {funnelStages.map((item, idx) => {
              const y1 = idx * (BAND_H + BAND_OFFSET) + BAND_OFFSET;
              const y2 = y1 + BAND_H;
              const yCenter = (y1 + y2) / 2;
              const isHovered = hoveredStage === item.name;
              const isAnyHovered = hoveredStage !== null;

              return (
                <g key={item.name}>
                  <path
                    d={getFrontSegmentPath(idx)}
                    fill={item.color}
                    style={{
                      opacity: isHovered ? 1 : isAnyHovered ? 0.32 : 0.96,
                      filter: isHovered ? "brightness(1.07) drop-shadow(0 3px 8px rgba(0,0,0,0.22))" : "none",
                      transition: "opacity 0.25s, filter 0.25s",
                    }}
                    onMouseEnter={() => setHoveredStage(item.name)}
                    onMouseLeave={() => setHoveredStage(null)}
                    className="cursor-pointer"
                  />
                  <text
                    x={X_CENTER}
                    y={yCenter}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={9}
                    fontWeight="800"
                    letterSpacing="0.3"
                    fill={getTextColor(item.color)}
                    className="pointer-events-none select-none"
                    style={{
                      opacity: isHovered ? 1 : isAnyHovered ? 0.38 : 0.92,
                      transition: "opacity 0.25s"
                    }}
                  >
                    {item.name}
                  </text>
                </g>
              );
            })}
            {funnelStages.map((_, idx) => getWhiteSeparator(idx))}
          </svg>

          {/* Floating Tooltip */}
          {activeStage && activeStageIndex !== -1 && (() => {
            const pos = getTooltipPosition(activeStageIndex);
            const metrics = getStageMetrics(activeStageIndex);
            return (
              <div
                className="funnel-tooltip absolute z-50 pointer-events-none select-none"
                style={{ ...pos, width: 136 }}
              >
                <div className="rounded-lg bg-[#0f1923] border border-gray-700/60 shadow-2xl px-3 py-2.5 text-white">
                  <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0f1923] border-l border-b border-gray-700/60" />
                  <div className="text-[8.5px] font-bold text-gray-300 mb-1">{activeStage.name}</div>
                  <div className="text-[13px] font-extrabold text-[#fbbf24] mb-1.5">
                    {activeStage.leads} <span className="text-[8px] font-normal text-white/70">leads</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-1.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[7.5px]">
                      <span className="text-gray-400">Conv</span>
                      <span className="text-emerald-400 font-semibold">
                        {metrics.conversionPercentage === null
                          ? "—"
                          : `${metrics.conversionPercentage.toFixed(1)}%`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[7.5px]">
                      <span className="text-gray-400">Drop</span>
                      <span className="text-red-400 font-semibold">
                        {metrics.dropPercentage === null
                          ? "—"
                          : `${metrics.dropPercentage.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ─── Right: Data Table ─── */}
        <div className="flex flex-col justify-center">
          {/* Headers */}
          <div className="grid grid-cols-[1.25fr_.58fr_.62fr_.62fr_.62fr] gap-x-1.5 border-b border-[#edf0f1] pb-1.5 text-[7.5px] font-bold uppercase tracking-wider text-[#8b9195]">
            <span>Stage</span>
            <span className="text-right">Leads</span>
            <span className="text-right">Conv%</span>
            <span className="text-right">Drop%</span>
            <span className="text-right">Stage%</span>
          </div>

          {/* Rows */}
          {funnelStages.map((item, index) => {
            const isHovered = hoveredStage === item.name;
            const isAnyHovered = hoveredStage !== null;
            const {
              conversionPercentage,
              dropPercentage,
              stagePercentage,
            } = getStageMetrics(index);

            return (
              <div
                key={item.name}
                className="grid grid-cols-[1.25fr_.58fr_.62fr_.62fr_.62fr] gap-x-1.5 border-b border-[#f1f2f3] last:border-0 py-[4.5px] text-[9px] items-center cursor-pointer"
                style={{
                  opacity: isAnyHovered ? (isHovered ? 1 : 0.38) : 1,
                  background: isHovered ? "rgba(22,132,84,0.05)" : "transparent",
                  borderLeftWidth: 2,
                  borderLeftStyle: "solid",
                  borderLeftColor: isHovered ? item.color : "transparent",
                  paddingLeft: 4,
                  transition: "opacity 0.2s, background 0.2s",
                }}
                onMouseEnter={() => setHoveredStage(item.name)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <span className="flex items-center gap-1.5 font-semibold text-[#1a1a1a]">
                  <span className="inline-block w-[7px] h-[7px] rounded-full shrink-0" style={{ background: item.color }} />
                  {item.name}
                </span>
                <span className="text-right font-bold text-[#111]">{item.leads}</span>
                <span className="text-right text-[#48936a] font-medium">
                  {conversionPercentage === null
                    ? "—"
                    : `${conversionPercentage.toFixed(1)}%`}
                </span>
                <span className="text-right font-semibold" style={{ color: dropPercentage !== null ? "#d63b3f" : "#b0b7bc" }}>
                  {dropPercentage === null
                    ? "—"
                    : `${dropPercentage.toFixed(1)}%`}
                </span>
                <span className="text-right text-[#555]">{stagePercentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="mt-3 flex h-9 items-center rounded-lg border border-[#e4e6e0] bg-[#f6f7f2] px-3 select-none">
        <Award size={15} className="text-[#d39b17] shrink-0" />
        <span className="ml-2 text-[9px] font-semibold text-[#2a2a2a]">Overall Conversion Ratio</span>
        <span className="ml-auto text-[19px] font-extrabold text-[#168454] leading-none">
          {overallConversion.toFixed(1)}%
        </span>
        <span className="ml-5 flex items-center gap-0.5 text-[9px] font-bold text-emerald-600">
          <TrendingUp size={9} className="shrink-0" />
          0.6%
        </span>
        <span className="ml-1 text-[8px] text-[#7a8085]">vs last month</span>
      </div>
    </section>
  );
}

// ============================================================
// 3. LEAD TREND WIDGET
// ============================================================

const trendSummary = [
  { label: "Leads", value: "4,128", color: "#07543d", icon: Users },
  { label: "Conversions", value: "264", color: "#d89a11", icon: Award },
  { label: "Bookings", value: "47", color: "#087a67", icon: TrendingUp },
];

export function LeadTrend() {
  const [period, setPeriod] = useState("Month");

  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <CardTitle
        title="Lead Trend"
        subtitle="Growth of leads, conversions and bookings over time"
        action={
          <div className="flex overflow-hidden rounded-md border border-[#e4e6e7]">
            {["Week", "Month", "Quarter", "Year"].map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`h-7 px-4 text-[7.5px] transition-colors cursor-pointer ${
                  period === item
                    ? "bg-[#073d2e] text-white"
                    : "bg-white text-[#42484b] hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />

      {/* Legend */}
      <div className="mb-1 flex justify-center gap-6 text-[8px] text-[#2d3335] select-none">
        <span>
          <i className="mr-2 inline-block h-1.5 w-3 rounded bg-[#073d2e]" />
          Leads
        </span>
        <span>
          <i className="mr-2 inline-block h-1.5 w-3 rounded bg-[#df9e12]" />
          Conversions
        </span>
        <span>
          <i className="mr-2 inline-block h-1.5 w-3 rounded bg-[#087a67]" />
          Bookings
        </span>
      </div>

      {/* Chart */}
      <div className="h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={leadTrendData}
            margin={{ top: 8, right: 12, left: -22, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              axisLine={{ stroke: "#dfe3e4" }}
              tickLine={false}
              tick={{ fontSize: 8, fill: "#737a7e" }}
            />
            <YAxis
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fill: "#737a7e" }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#e5e7e8", fontSize: 10 }}
            />
            <Line
              type="linear"
              dataKey="leads"
              stroke="#073d2e"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "#073d2e" }}
            />
            <Line
              type="linear"
              dataKey="conversions"
              stroke="#df9e12"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "#df9e12" }}
            />
            <Line
              type="linear"
              dataKey="bookings"
              stroke="#087a67"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "#087a67" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 border-t border-[#edf0f1] pt-3 select-none">
        {trendSummary.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="flex items-center justify-center gap-3 p-2 rounded-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f7f5]" style={{ color }}>
              <Icon size={14} />
            </span>
            <span>
              <small className="block text-[8px] text-[#7b8286]">{label}</small>
              <b className="text-[15px] font-bold" style={{ color }}>{value}</b>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// 4. LEAD SOURCES WIDGET
// ============================================================

export function LeadSources() {
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  const activeIndex = leadSources.findIndex((s) => s.name === hoveredSource);
  const activeSource = activeIndex !== -1 ? leadSources[activeIndex] : null;

  const renderSector = (props: PieSectorShapeProps) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, isActive } = props;

    if (isActive) {
      return (
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={(innerRadius || 0) - 2}
          outerRadius={(outerRadius || 0) + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill || "#ccc"}
          style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))" }}
        />
      );
    }

    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius || 0}
        outerRadius={outerRadius || 0}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill || "#ccc"}
      />
    );
  };

  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <CardTitle title="Lead Sources" subtitle="Where your leads are coming from" />

      <div className="flex items-center gap-5">
        {/* ─── Pie Chart ─── */}
        <div className="relative h-[126px] w-[126px] shrink-0">
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes fadeInCenter {
                from { opacity: 0; transform: scale(0.92); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-fade-in-center {
                animation: fadeInCenter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `
          }} />

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leadSources}
                dataKey="value"
                nameKey="name"
                innerRadius={39}
                outerRadius={61}
                paddingAngle={1}
                stroke="#ffffff"
                strokeWidth={1}
                shape={renderSector}
                onMouseEnter={(_data: unknown, index: number) => {
                  if (leadSources[index]) setHoveredSource(leadSources[index].name);
                }}
                onMouseLeave={() => setHoveredSource(null)}
              >
                {leadSources.map((item) => {
                  const isHovered = hoveredSource === item.name;
                  const isAnyHovered = hoveredSource !== null;
                  return (
                    <Cell
                      key={item.name}
                      fill={item.color}
                      className="transition-all duration-300"
                      style={{ opacity: isHovered ? 1 : isAnyHovered ? 0.4 : 1 }}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full select-none">
            {hoveredSource && activeSource ? (
              <div key={hoveredSource} className="flex flex-col items-center justify-center text-center animate-fade-in-center">
                <b className="text-[14px] font-extrabold tracking-tight" style={{ color: activeSource.color }}>
                  {activeSource.percent}
                </b>
                <span className="text-[8px] font-bold text-[#15191a] mt-0.5 tracking-tight max-w-[80px] truncate">
                  {activeSource.name}
                </span>
                <span className="text-[7px] text-[#788085] mt-0.5 font-medium">
                  {activeSource.value.toLocaleString()} leads
                </span>
              </div>
            ) : (
              <div key="total" className="flex flex-col items-center justify-center text-center animate-fade-in-center">
                <b className="text-[15px] font-extrabold text-[#15191a] tracking-tight">4,128</b>
                <span className="text-[7px] font-bold text-[#788085] tracking-wide uppercase mt-0.5">Total Leads</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Source List ─── */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {leadSources.map((item) => {
            const isHovered = hoveredSource === item.name;
            const isAnyHovered = hoveredSource !== null;

            return (
              <div
                key={item.name}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 text-[8px] px-2 py-1.5 border-l-2 rounded-r transition-all duration-200 cursor-default ${
                  isHovered
                    ? "bg-[#f4f7f5] font-semibold text-[#004b36] border-l-[#004b36] pl-2"
                    : isAnyHovered
                    ? "opacity-40 border-l-transparent"
                    : "border-l-transparent hover:bg-gray-50/50"
                }`}
              >
                <span className="truncate">
                  <i className="mr-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                  {item.name}
                </span>
                <b>{item.value.toLocaleString()}</b>
                <span className="text-[#8a9094]">({item.percent})</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}