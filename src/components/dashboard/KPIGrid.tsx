"use client";

import { motion } from "framer-motion";
import {
  Clock3,
  IndianRupee,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { kpiData } from "@/mock/dashboard";

const toneStyles = {
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    line: "#10a568",
  },
  blue: {
    icon: "bg-blue-50 text-blue-600",
    line: "#2878ed",
  },
  gold: {
    icon: "bg-amber-50 text-amber-600",
    line: "#d99a12",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    line: "#8b3cf0",
  },
  teal: {
    icon: "bg-teal-50 text-teal-600",
    line: "#138f83",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    line: "#f97316",
  },
  red: {
    icon: "bg-red-50 text-red-600",
    line: "#ef4444",
  },
} as const;

const icons = [
  Users,
  UserPlus,
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  Clock3,
];

const chartData = [
  {
    path: "M4 42 L24 30 L43 35 L63 17 L83 34 L104 29 L124 27 L145 16 L163 26 L178 13",
    endY: 13,
  },
  {
    path: "M4 44 L23 31 L43 35 L62 16 L82 37 L102 31 L123 29 L143 16 L162 29 L178 12",
    endY: 12,
  },
  {
    path: "M4 43 L24 31 L44 23 L64 27 L83 11 L103 35 L123 28 L144 24 L162 11 L178 25",
    endY: 25,
  },
  {
    path: "M4 44 L24 30 L44 25 L64 29 L84 13 L103 36 L123 28 L143 26 L162 12 L178 27",
    endY: 27,
  },
  {
    path: "M4 43 L23 34 L43 24 L63 30 L83 16 L103 32 L123 23 L143 28 L162 14 L178 21",
    endY: 21,
  },
  {
    path: "M4 43 L23 31 L43 22 L63 26 L83 13 L103 34 L123 28 L143 26 L162 12 L178 23",
    endY: 23,
  },
];

function Sparkline({
  index,
  color,
}: {
  index: number;
  color: string;
}) {
  const chart = chartData[index] ?? chartData[0];
  const gradientId = `kpi-gradient-${index}`;

  return (
    <svg
      className="h-full w-full overflow-visible"
      viewBox="0 0 182 52"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={color}
            stopOpacity="0.18"
          />

          <stop
            offset="100%"
            stopColor={color}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <path
        d={`${chart.path} L178 52 L4 52 Z`}
        fill={`url(#${gradientId})`}
      />

      <path
        d={chart.path}
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <circle
        cx="178"
        cy={chart.endY}
        r="5"
        fill="white"
        stroke={color}
        strokeOpacity="0.3"
        strokeWidth="3"
      />

      <circle
        cx="178"
        cy={chart.endY}
        r="2.2"
        fill={color}
      />
    </svg>
  );
}

export default function KPIGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpiData.map((item, index) => {
        const Icon = icons[index];
        const style = toneStyles[item.tone as keyof typeof toneStyles];
        
        let trendIcon = null;
        let trendColor = 'text-[#9aa0aa]';

        if (item.change) {
          const numValue = parseFloat(item.change.replace(/[^0-9.]/g, ''));
          const isUp = numValue > 0;
          
          if (isUp) {
            trendIcon = <TrendingUp size={10} strokeWidth={2.2} />;
            trendColor = 'text-emerald-600';
          } else {
            trendIcon = <TrendingDown size={10} strokeWidth={2.2} />;
            trendColor = 'text-red-500';
          }
        }

        return (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.04,
              duration: 0.25,
            }}
            whileHover={{
              y: -2,
              boxShadow: "0 10px 25px rgba(15,23,42,0.07)",
            }}
            className="relative min-h-[150px] max-h-[165px] min-w-0 overflow-hidden rounded-[16px] border border-[#e8dfd2] bg-white p-3.5 shadow-[0_2px_6px_rgba(15,23,42,0.04)]"
          >
            <div className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full shadow-[0_2px_5px_rgba(15,23,42,0.07)] ${style.icon}`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase leading-[1.1] tracking-[0.01em] text-[#15191d]">
                  {item.label}
                </p>

                <p
                  className={`mt-0.5 whitespace-nowrap font-bold leading-none tracking-tight text-[#101418] ${
                    item.label === "Pipeline" ? "text-[17px]" : "text-[20px]"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </div>

            {/* Sparkline */}
            <div className="absolute bottom-7 left-3.5 right-3.5 h-[38px]">
              <Sparkline
                index={index}
                color={style.line}
              />
            </div>

            {/* Trend info with context */}
            <div className="absolute bottom-1.5 left-3.5 right-3.5">
              {item.change ? (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex items-center gap-1 text-[9px] font-semibold ${trendColor}`}
                  >
                    {trendIcon}
                    {item.change}
                  </span>
                  <span className="text-[7px] text-[#9aa0aa] font-medium">
                    vs last month
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[8px]">
                  <span className="font-semibold text-red-500">
                    21 overdue
                  </span>
                  <span className="text-[#9aa0aa]">•</span>
                  <span className="text-[#9aa0aa]">65 today</span>
                </div>
              )}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}