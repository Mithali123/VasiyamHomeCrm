"use client";

import { CalendarDays, ChevronDown, Download, Filter, Plus, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FilterDrawer from "./FilterDrawer";
import { motion, AnimatePresence } from "framer-motion";

const filters = [
  { label: "All Projects", options: ["All Projects", "Vasiyam Greens", "Vasiyam Hills", "Vasiyam Heights"] },
  { label: "All RMs", options: ["All RMs", "Arvind Kumar", "Priya Sharma", "Meera Rajan"] },
  { label: "All Sources", options: ["All Sources", "Website", "Referral", "Instagram", "99acres"] },
  { label: "All Stages", options: ["All Stages", "New", "Contacted", "Qualified", "Site Visit", "Negotiation"] },
  { label: "All Budgets", options: ["All Budgets", "Below ₹50L", "₹50L–₹1Cr", "₹1Cr–₹2Cr", "Above ₹2Cr"] },
];

export default function FilterBar() {
  const [open, setOpen] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState("This Month");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(filters.map((item) => item.label));
  const root = useRef<HTMLDivElement>(null);

  const isAnyFilterActive =
    selected.some((val, idx) => val !== filters[idx].label) ||
    dateRange !== "This Month";

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      ref={root}
      className="flex min-h-[58px] flex-wrap items-center gap-2 rounded-xl border border-[#e4e6e7] bg-white px-3 py-2 shadow-[0_1px_3px_rgba(15,23,42,.03)]"
    >
      {/* Date Range Picker */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === -1 ? null : -1)}
          className="flex h-10 min-w-[158px] items-center gap-2 rounded-lg border border-[#e6e7e8] px-3 text-left"
        >
          <CalendarDays size={16} className="text-[#202426]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold text-[#202426]">
              {dateRange}
            </span>
            <span className="block text-[8px] text-[#777e83]">
              01 May – 31 May 2026
            </span>
          </span>
          <ChevronDown size={12} className={open === -1 ? "rotate-180" : ""} />
        </button>

        {open === -1 && (
          <div className="absolute left-0 top-12 z-50 w-44 overflow-hidden rounded-lg border border-[#e6e7e8] bg-white p-1 shadow-xl">
            {["Today", "This Week", "This Month", "This Quarter", "This Year"].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setDateRange(option);
                  setOpen(null);
                }}
                className="block w-full rounded-md px-3 py-2.5 text-left text-[11px] hover:bg-[#f3f7f5]"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden h-7 w-px bg-[#eceeef] xl:block" />

      {/* Filter Dropdowns */}
      {filters.map((filter, index) => (
        <div key={filter.label} className="relative">
          <button
            onClick={() => setOpen(open === index ? null : index)}
            className="flex h-10 min-w-[118px] items-center justify-between gap-3 rounded-lg border border-[#e6e7e8] px-3 text-[10px] font-medium text-[#303537]"
          >
            {selected[index]}
            <ChevronDown size={11} className={open === index ? "rotate-180" : ""} />
          </button>

          {open === index && (
            <div className="absolute left-0 top-12 z-50 w-44 overflow-hidden rounded-lg border border-[#e6e7e8] bg-white p-1 shadow-xl">
              {filter.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const next = [...selected];
                    next[index] = option;
                    setSelected(next);
                    setOpen(null);
                  }}
                  className="block w-full rounded-md px-3 py-2.5 text-left text-[11px] hover:bg-[#f3f7f5]"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* More Filters */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="flex h-10 items-center gap-2 rounded-lg border border-[#e6e7e8] px-3 text-[10px] font-medium"
      >
        <Filter size={13} /> More Filters
      </button>

      {/* Clear Filters Button */}
      <AnimatePresence>
        {isAnyFilterActive && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -10 }}
            transition={{ duration: 0.15 }}
            onClick={() => {
              setSelected(filters.map((item) => item.label));
              setDateRange("This Month");
            }}
            className="flex h-10 items-center gap-1.5 px-2 text-[10px] font-semibold text-[#475569] hover:text-[#0f172a] hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw size={12} className="text-[#64748b]" />
            Clear
          </motion.button>
        )}
      </AnimatePresence>

      <div className="min-w-2 flex-1" />

      {/* Action Buttons */}
      <button className="flex h-10 items-center gap-2 rounded-lg bg-[#eef6f1] px-3 text-[10px] font-semibold text-[#07543d]">
        <Plus size={13} /> Create Lead
      </button>

      <button className="flex h-10 items-center gap-2 rounded-lg border border-[#e6e7e8] px-3 text-[10px] font-medium">
        <Download size={13} /> Import
      </button>

      <FilterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}