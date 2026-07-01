"use client";

import React from "react";
import { Calendar, UserMinus, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

// Sparkline component inside LeadCards
const Sparkline = ({ color, points, index }: { color: string; points: [number, number][]; index: number }) => {
  const getSharpPath = (pts: [number, number][]) => {
    if (pts.length === 0) return "";
    return `M ${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(([x, y]) => `L ${x} ${y}`).join(" ");
  };

  const linePath = getSharpPath(points);
  const fillPath = `${linePath} L 100 30 L 0 30 Z`;

  return (
    <div className="w-full h-full relative overflow-visible">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
        <defs>
          <linearGradient id={`sparkline-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gradient Fill */}
        <motion.path
          d={fillPath}
          fill={`url(#sparkline-gradient-${index})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
        />

        {/* Glowing Shadow line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          className="opacity-15 blur-[1px]"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.05 }}
        />

        {/* Main Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.05 }}
        />

        {/* Vertices/Dots */}
        {points.map(([x, y], idx) => {
          const isLast = idx === points.length - 1;
          return (
            <g key={idx}>
              {isLast && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill={color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.4, scale: [1, 2, 1] }}
                  transition={{
                    opacity: { delay: index * 0.05 + 0.7, duration: 0.2 },
                    scale: {
                      delay: index * 0.05 + 0.7,
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r="1.6"
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.05 + 0.4 + idx * 0.05,
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface SummaryKPIs {
  assigned: number;
  unassigned: number;
  qualified: number;
}

interface RMWorkload {
  name: string;
  count: number;
}

interface UnassignedSource {
  name: string;
  count: number;
}

interface FollowupBreakdown {
  overdue: number;
  today: number;
}

interface LeadCardsProps {
  summaryKPIs: SummaryKPIs;
  rmWorkloads: RMWorkload[];
  unassignedSources: UnassignedSource[];
  followupBreakdown: FollowupBreakdown;
}

export default function LeadCards({
  summaryKPIs,
  rmWorkloads,
  unassignedSources,
  followupBreakdown
}: LeadCardsProps) {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Card 1: Assigned Leads */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-[#0D2E1D]/60 backdrop-blur-md p-4 rounded-xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[175px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(197,154,44,0.06)] dark:hover:shadow-[0_8px_20px_rgba(197,154,44,0.12)] hover:border-amber-300/40 dark:hover:border-amber-500/20 group">
        <div>
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold tracking-wider text-gray-400 dark:text-gray-405 uppercase leading-none">Assigned Leads</span>
            <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#C59A2C] dark:text-[#C59A2C] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Calendar size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-white leading-none">
              {summaryKPIs.assigned.toLocaleString()}
            </h3>
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] bg-emerald-50 dark:bg-emerald-950/30 text-[#16A34A] font-extrabold leading-none">
              <TrendingUp size={7} className="shrink-0" />
              10%
            </span>
          </div>
          <div className="w-full mt-2 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline index={0} color="#C59A2C" points={[[0, 27], [10, 20], [20, 16], [30, 18], [40, 8], [50, 22], [60, 17], [70, 15], [80, 6], [90, 16], [100, 11]]} />
          </div>
        </div>
        
        <div className="mt-3 pt-2.5 border-t border-[#E8E2D6]/60 dark:border-white/5 flex flex-col gap-1">
          <span className="text-[7.5px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">RM Load Distribution</span>
          <div className="flex flex-wrap items-center gap-1">
            {rmWorkloads.map((rm) => (
              <div key={rm.name} className="flex items-center gap-1 px-1 py-0.5 rounded text-[8.5px] font-bold bg-amber-500/5 text-amber-700 dark:text-amber-300 border border-amber-500/10 dark:border-amber-500/20">
                <span>{rm.name}</span>
                <span className="font-black text-[#1F1F1F] dark:text-white bg-[#F8F5EE] dark:bg-white/5 px-1 rounded-sm text-[7.5px]">{rm.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Unassigned Leads */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-[#0D2E1D]/60 backdrop-blur-md p-4 rounded-xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[175px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,92,246,0.06)] dark:hover:shadow-[0_8px_20px_rgba(139,92,246,0.12)] hover:border-purple-300/40 dark:hover:border-purple-500/20 group">
        <div>
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold tracking-wider text-gray-450 dark:text-gray-400 uppercase leading-none">Unassigned Leads</span>
            <div className="w-7 h-7 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <UserMinus size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-white leading-none">
              {summaryKPIs.unassigned.toLocaleString()}
            </h3>
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] bg-red-50 dark:bg-red-950/30 text-red-500 font-extrabold leading-none">
              <TrendingDown size={7} className="shrink-0" />
              5%
            </span>
          </div>
          <div className="w-full mt-2 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline index={1} color="#8B5CF6" points={[[0, 27], [9, 20], [18, 16], [27, 18], [36, 8], [45, 22], [54, 17], [63, 17], [72, 14], [81, 6], [90, 15], [100, 10]]} />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E8E2D6]/60 dark:border-white/5 flex flex-col gap-1">
          <span className="text-[7.5px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Top Sources</span>
          <div className="flex flex-wrap items-center gap-1">
            {unassignedSources.map((src) => (
              <div key={src.name} className="flex items-center gap-1 px-1 py-0.5 rounded text-[8.5px] font-bold bg-purple-500/5 text-purple-700 dark:text-purple-300 border border-purple-500/10 dark:border-purple-500/20">
                <span>{src.name}</span>
                <span className="font-black text-[#1F1F1F] dark:text-white bg-[#F8F5EE] dark:bg-white/5 px-1 rounded-sm text-[7.5px]">{src.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: Follow-up Needed */}
      <div className="relative overflow-hidden bg-white/70 dark:bg-[#0D2E1D]/60 backdrop-blur-md p-4 rounded-xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[175px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(239,68,68,0.06)] dark:hover:shadow-[0_8px_20px_rgba(239,68,68,0.12)] hover:border-red-300/40 dark:hover:border-red-500/20 group">
        <div>
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold tracking-wider text-gray-455 dark:text-gray-400 uppercase leading-none">Follow-up Needed</span>
            <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Clock size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-white leading-none">
              {summaryKPIs.qualified.toLocaleString()}
            </h3>
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] bg-emerald-50 dark:bg-emerald-950/30 text-[#16A34A] font-extrabold leading-none">
              <TrendingUp size={7} className="shrink-0" />
              15%
            </span>
          </div>
          <div className="w-full mt-2 h-8 opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline index={2} color="#EF4444" points={[[0, 28], [9, 21], [18, 16], [27, 18], [36, 8], [45, 22], [54, 18], [63, 17], [72, 10], [81, 4], [90, 14], [100, 5]]} />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#E8E2D6]/60 dark:border-white/5 flex flex-col gap-1">
          <span className="text-[7.5px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Urgency Breakdown</span>
          <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1 px-1 py-0.5 rounded text-[8.5px] font-bold bg-red-500/5 text-red-600 dark:text-red-400 border border-red-500/10 dark:border-red-500/20">
              <span>Overdue</span>
              <span className="font-black text-red-650 dark:text-red-300 bg-red-50 dark:bg-white/5 px-1 rounded-sm text-[7.5px]">{followupBreakdown.overdue}</span>
            </div>
            <div className="flex items-center gap-1 px-1 py-0.5 rounded text-[8.5px] font-bold bg-amber-500/5 text-amber-700 dark:text-amber-300 border border-amber-500/10 dark:border-amber-500/20">
              <span>Today</span>
              <span className="font-black text-amber-650 dark:text-amber-300 bg-amber-50 dark:bg-white/5 px-1 rounded-sm text-[7.5px]">{followupBreakdown.today}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
