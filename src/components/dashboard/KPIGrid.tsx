"use client";

import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { kpiData } from "@/mock/dashboard";

interface KPICardProps {
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
  tooltip: string;
  index: number;
}

function KPICard({ label, value, change, trend, tooltip, index }: KPICardProps) {
  const [showTip, setShowTip] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (tipRef.current && !tipRef.current.contains(e.target as Node)) {
        setShowTip(false);
      }
    };
    if (showTip) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showTip]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white p-5 rounded-2xl border border-[#E8E2D6] shadow-sm hover:shadow-md transition-shadow group relative"
    >
      {/* Decorative gradient — clipped in its own layer so tooltip is never hidden */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${
            trend === "up" ? "bg-[#133C27]" : "bg-red-500"
          }`}
        />
      </div>

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-[#6B7283] tracking-wider uppercase leading-tight pr-2">
          {label}
        </span>

        {/* Info icon — click to toggle tooltip */}
        <div className="relative shrink-0" ref={tipRef}>
          <button
            onClick={() => setShowTip((v) => !v)}
            aria-label={`Info about ${label}`}
            className={`p-0.5 rounded-full transition-colors ${
              showTip ? "text-primary" : "text-[#9AA1A9] hover:text-primary"
            }`}
          >
            <Info size={14} />
          </button>

          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-[#0d2e1d] text-white text-[11px] leading-relaxed p-3 rounded-xl shadow-2xl z-50 border border-white/10"
              >
                <div className="absolute -top-1.5 right-2 w-3 h-3 bg-[#0d2e1d] rotate-45 border-l border-t border-white/10" />
                {tooltip}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-[#1A3C2A]">{value}</h3>
        <div
          className={`flex items-center gap-0.5 text-xs font-bold ${
            trend === "up" ? "text-[#133C27]" : "text-[#B31B27]"
          }`}
        >
          {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <p className="text-[10px] text-[#9AA1A9] mt-1 font-medium italic">vs previous period</p>
    </motion.div>
  );
}

export default function KPIGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpiData.map((kpi, idx) => (
        <KPICard key={kpi.label} {...kpi} index={idx} />
      ))}
    </div>
  );
}