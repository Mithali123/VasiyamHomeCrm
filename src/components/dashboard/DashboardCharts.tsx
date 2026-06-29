"use client";

import { useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";
import { Award, CalendarDays, TrendingUp, Users } from "lucide-react";
import { funnelStages, leadSources, leadTrendData } from "@/mock/dashboard";
import { motion, AnimatePresence } from "framer-motion";

// Helper Components
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

// Sales Funnel Widget
export function SalesFunnel() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <CardTitle
        title="Sales Funnel"
        subtitle="Track performance across the sales pipeline"
        action={
          <button className="flex h-7 items-center gap-2 rounded-md border border-[#e6e8e9] px-3 text-[8px] font-medium">
            <CalendarDays size={10} /> This Month
          </button>
        }
      />

      <div className="grid grid-cols-[280px_1fr] gap-4">
        {/* Funnel Visualization */}
        <div className="relative h-[210px] w-[280px] shrink-0">
          <svg
            viewBox="0 0 300 210"
            className="w-full h-full"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="funnel-3d-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {funnelStages.map((item, i) => {
              const isHovered = hoveredStage === item.name;
              const isAnyHovered = hoveredStage !== null;

              const wt = item.width * 2.4;
              const nextItem = funnelStages[i + 1];
              const wb = nextItem ? nextItem.width * 2.4 : wt * 0.75;

              const y_top = i * 26 + 2;
              const y_bottom = y_top + 20;
              const dip = 4;

              const x1 = 140 - wt / 2;
              const x2 = 140 + wt / 2;
              const x3 = 140 + wb / 2;
              const x4 = 140 - wb / 2;

              const pathData = `M ${x1} ${y_top} Q 140 ${y_top + dip} ${x2} ${y_top} L ${x3} ${y_bottom} Q 140 ${y_bottom + dip} ${x4} ${y_bottom} Z`;
              const textColor = item.color === "#dda90c" ? "#064734" : "#ffffff";

              return (
                <g
                  key={item.name}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredStage(item.name)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  {/* Dashed connector line to the table */}
                  <line
                    x1={x2 + 4}
                    y1={y_top + dip + 6}
                    x2={295}
                    y2={y_top + dip + 6}
                    stroke="#e2e8f0"
                    strokeDasharray="2,2"
                    strokeWidth="0.75"
                    className="transition-opacity duration-200"
                    style={{
                      opacity: isHovered ? 1.0 : isAnyHovered ? 0.2 : 0.6,
                    }}
                  />

                  {/* Main Tapered Funnel Layer Path */}
                  <motion.path
                    d={pathData}
                    fill={item.color}
                    initial={{ opacity: 0, scale: 1.0 }}
                    animate={{
                      opacity: isHovered ? 1.0 : isAnyHovered ? 0.35 : 0.85,
                      scale: isHovered ? 1.03 : 1.0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 15,
                    }}
                    style={{
                      originX: "140px",
                      originY: `${(y_top + y_bottom) / 2}px`,
                      filter: isHovered ? `drop-shadow(0 4px 10px ${item.color}70)` : "none",
                    }}
                  />

                  {/* 3D Cylindrical lighting Overlay */}
                  <motion.path
                    d={pathData}
                    fill="url(#funnel-3d-grad)"
                    pointerEvents="none"
                    initial={{ opacity: 0, scale: 1.0 }}
                    animate={{
                      opacity: isHovered ? 1.0 : isAnyHovered ? 0.35 : 0.85,
                      scale: isHovered ? 1.03 : 1.0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 15,
                    }}
                    style={{
                      originX: "140px",
                      originY: `${(y_top + y_bottom) / 2}px`,
                    }}
                  />

                  {/* Stage Text Label inside the funnel */}
                  <motion.text
                    x="140"
                    y={y_top + dip + 7.5}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="8px"
                    fontWeight="bold"
                    pointerEvents="none"
                    className="select-none tracking-wide"
                    initial={{ opacity: 0.9, scale: 1.0 }}
                    animate={{
                      opacity: isHovered ? 1.0 : isAnyHovered ? 0.4 : 0.9,
                      scale: isHovered ? 1.05 : 1.0,
                    }}
                    style={{
                      originX: "140px",
                      originY: `${y_top + dip + 7.5}px`,
                    }}
                  >
                    {item.name}
                  </motion.text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip Overlay */}
          <AnimatePresence>
            {hoveredStage && (
              (() => {
                const idx = funnelStages.findIndex((s) => s.name === hoveredStage);
                const item = funnelStages[idx];
                if (!item) return null;
                const y_top = idx * 26 + 2;

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: -4 }}
                    exit={{ opacity: 0, scale: 0.9, y: 3 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-20 pointer-events-none whitespace-nowrap"
                    style={{
                      top: `${y_top - 24}px`,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="bg-[#10172a] text-white text-[9px] rounded-lg px-2.5 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] border border-slate-700/50 flex flex-col gap-0.5 items-center">
                      <span className="font-semibold text-slate-300">{item.name}</span>
                      <b className="text-[12px] font-bold text-amber-400">
                        {item.leads} <span className="font-normal text-[9px] text-slate-400">leads</span>
                      </b>
                      <div className="flex gap-2 text-[7.5px] text-slate-400 mt-1 border-t border-slate-800/80 pt-1 w-full justify-between">
                        <span>Conv: <span className="text-emerald-400 font-medium">{item.conversion}</span></span>
                        {item.dropOff !== "—" && (
                          <span>Drop: <span className="text-red-400 font-medium">{item.dropOff}</span></span>
                        )}
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-[#10172a] border-r border-b border-slate-700/50 rotate-45 absolute top-[98%] left-1/2 -translate-x-1/2 -mt-1" />
                  </motion.div>
                );
              })()
            )}
          </AnimatePresence>
        </div>

        {/* Funnel Data Table */}
        <div>
          <div className="grid grid-cols-[1.1fr_.55fr_.6fr_.65fr_.6fr] gap-x-2 border-b border-[#edf0f1] pb-2 text-[7px] uppercase text-[#858c91]">
            <span>Stage</span>
            <span className="text-right">Leads</span>
            <span className="text-right">Conv %</span>
            <span className="text-right">Drop %</span>
            <span className="text-right">Stage %</span>
          </div>

          {funnelStages.map((item) => (
            <div
              key={item.name}
              className={`grid h-[26px] grid-cols-[1.1fr_.55fr_.6fr_.65fr_.6fr] gap-x-2 items-center border-b border-[#f0f1f2] text-[8px] last:border-0 cursor-pointer transition-colors duration-150 ${
                hoveredStage === item.name ? "bg-slate-50 font-medium text-slate-900" : ""
              }`}
              onMouseEnter={() => setHoveredStage(item.name)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <span className="flex items-center gap-2 font-medium">
                <i className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
              <span className="text-right font-semibold">{item.leads}</span>
              <span className="text-right">{item.conversion}</span>
              <span
                className={
                  item.dropOff !== "—"
                    ? "text-right text-red-500 font-medium"
                    : "text-right text-[#8b9195]"
                }
              >
                {item.dropOff}
              </span>
              <span className="text-right">{item.stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Ratio Summary */}
      <div className="mt-2 flex h-9 items-center rounded-lg border border-[#e8e8df] bg-[#f7f8f4] px-3">
        <Award size={15} className="text-[#d39b17]" />
        <span className="ml-2 text-[8px] font-semibold">Overall Conversion Ratio</span>
        <span className="ml-auto text-[18px] font-bold text-[#168454]">9.8%</span>
        <span className="ml-8 text-[8px] text-emerald-600">
          <TrendingUp size={9} className="inline" /> 0.6%
        </span>
        <span className="ml-1 text-[7px] text-[#777e82]">vs last month</span>
      </div>
    </section>
  );
}

// Lead Trend Widget
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
                className={`h-7 px-4 text-[7.5px] ${
                  period === item
                    ? "bg-[#073d2e] text-white"
                    : "bg-white text-[#42484b]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />

      {/* Legend */}
      <div className="mb-1 flex justify-center gap-6 text-[8px] text-[#2d3335]">
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
      <div className="grid grid-cols-3 border-t border-[#edf0f1] pt-3">
        {trendSummary.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="flex items-center justify-center gap-3">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f7f5]"
              style={{ color }}
            >
              <Icon size={14} />
            </span>
            <span>
              <small className="block text-[8px] text-[#7b8286]">{label}</small>
              <b className="text-[15px]" style={{ color }}>
                {value}
              </b>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Lead Sources Widget
export function LeadSources() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredSource, setHoveredSource] = useState<typeof leadSources[0] | null>(null);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 3}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    );
  };

  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <CardTitle
        title="Lead Sources"
        subtitle="Where your leads are coming from"
        action={
          <button className="rounded-md border border-[#e6e8e9] px-3 py-1.5 text-[7.5px]">
            View all
          </button>
        }
      />

      <div className="flex items-center gap-5">
        {/* Donut Chart */}
        <div className="relative h-[126px] w-[126px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                {...({
                  activeIndex,
                  activeShape: renderActiveShape,
                } as any)}
                data={leadSources}
                dataKey="value"
                innerRadius={39}
                outerRadius={61}
                paddingAngle={1}
                stroke="#fff"
                strokeWidth={1}
                onMouseEnter={(_, index) => {
                  setActiveIndex(index);
                  setHoveredSource(leadSources[index]);
                }}
                onMouseLeave={() => {
                  setActiveIndex(-1);
                  setHoveredSource(null);
                }}
              >
                {leadSources.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                    opacity={activeIndex === -1 || activeIndex === index ? 1 : 0.4}
                    className="transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-1">
            <AnimatePresence mode="wait">
              {hoveredSource ? (
                <motion.div
                  key="hovered"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center justify-center leading-none"
                >
                  <b className="text-[13px] font-bold" style={{ color: hoveredSource.color }}>
                    {hoveredSource.percent}
                  </b>
                  <span className="mt-0.5 text-[7px] font-medium text-slate-700 truncate max-w-[80px]">
                    {hoveredSource.name}
                  </span>
                  <span className="text-[6px] text-slate-400 mt-0.5">
                    {hoveredSource.value.toLocaleString()} leads
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="total"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-center justify-center leading-none"
                >
                  <b className="text-[15px] font-bold text-slate-900">4,128</b>
                  <span className="text-[7px] text-[#777e82] mt-0.5">Total Leads</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Source List */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {leadSources.map((item, index) => (
            <div
              key={item.name}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-2 text-[8px] p-0.5 rounded cursor-pointer transition-colors duration-150 ${
                activeIndex === index ? "bg-slate-50 font-medium text-slate-900" : ""
              }`}
              onMouseEnter={() => {
                setActiveIndex(index);
                setHoveredSource(item);
              }}
              onMouseLeave={() => {
                setActiveIndex(-1);
                setHoveredSource(null);
              }}
            >
              <span className="truncate">
                <i
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: item.color }}
                />
                {item.name}
              </span>
              <b>{item.value.toLocaleString()}</b>
              <span className="text-[#8a9094]">({item.percent})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}