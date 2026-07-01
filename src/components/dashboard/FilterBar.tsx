"use client";

import { CalendarDays, ChevronDown, Download, Filter, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FilterDrawer from "./FilterDrawer";
import { motion, AnimatePresence } from "framer-motion";

const filters = [
  { label: "All Projects", options: ["All Projects", "Vasiyam Pride", "King's Garden", "BGR Garden", "Vasiyam Florence", "Grandeur", "Aspire", "Magnum"] },
  { label: "All RMs", options: ["All RMs", "Arvind Kumar", "Priya Sharma", "Meera Rajan"] },
  { label: "All Sources", options: ["All Sources", "Website", "Referral", "Instagram", "99acres"] },
  { label: "All Stages", options: ["All Stages", "New", "Contacted", "Qualified", "Site Visit", "Negotiation"] },
  { label: "All Budgets", options: ["All Budgets", "Below ₹50L", "₹50L–₹1Cr", "₹1Cr–₹2Cr", "Above ₹2Cr"] },
];

// Date range calculation function
const getDateRange = (range: string) => {
  const now = new Date();
  let startDate = new Date(now);
  let endDate = new Date(now);

  switch (range) {
    case "All":
      startDate = new Date(2000, 0, 1);
      endDate = new Date(2100, 11, 31);
      break;
    case "Today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "This Week": {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    }
    case "This Month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "This Quarter": {
      const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterMonth, 1);
      endDate = new Date(now.getFullYear(), quarterMonth + 3, 0);
      break;
    }
    case "This Year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  return { startDate, endDate };
};

// Get formatted date display
const getDateRangeDisplay = (range: string) => {
  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}`;
  };

  if (range === "All") {
    return "All Time";
  } else if (range === "Today") {
    return `${formatDate(now)} ${now.getFullYear()}`;
  } else if (range === "This Month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return `${formatDate(start)} – ${formatDate(now)} ${now.getFullYear()}`;
  } else if (range === "This Week") {
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const start = new Date(now.getFullYear(), now.getMonth(), diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${formatDate(start)} – ${formatDate(end)} ${now.getFullYear()}`;
  } else if (range === "This Quarter") {
    const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
    const start = new Date(now.getFullYear(), quarterMonth, 1);
    const end = new Date(now.getFullYear(), quarterMonth + 3, 0);
    return `${formatDate(start)} – ${formatDate(end)} ${now.getFullYear()}`;
  } else if (range === "This Year") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return `${formatDate(start)} – ${formatDate(end)} ${now.getFullYear()}`;
  }
  
  return `${formatDate(now)} ${now.getFullYear()}`;
};

interface FilterBarProps {
  onFilterChange?: (filters: {
    dateRange: string;
    startDate: Date;
    endDate: Date;
    selectedFilters: string[];
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(filters.map(() => "All"));
  const root = useRef<HTMLDivElement>(null);

  const isAnyFilterActive =
    selected.some((val) => val !== "All") ||
    dateRange !== "All";

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Apply filters and notify parent
  const applyFilters = () => {
    const { startDate, endDate } = getDateRange(dateRange);
    const filterData = {
      dateRange,
      startDate,
      endDate,
      selectedFilters: selected,
    };
    
    if (onFilterChange) {
      onFilterChange(filterData);
    }
  };

  // Handle date selection
  const handleDateSelect = (option: string) => {
    setDateRange(option);
    setOpen(null);
    setTimeout(() => applyFilters(), 100);
  };

  // Handle filter selection
  const handleFilterSelect = (index: number, option: string) => {
    const next = [...selected];
    next[index] = option;
    setSelected(next);
    setOpen(null);
    setTimeout(() => applyFilters(), 100);
  };

  // Handle import
  const handleImport = () => {
    console.log("Import clicked");
  };

  // Handle more filters
  const handleMoreFilters = () => {
    setDrawerOpen(true);
  };

  // Apply filters on drawer close
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    applyFilters();
  };

  return (
    <div
      ref={root}
      className="flex min-h-[58px] flex-wrap items-center gap-2 rounded-xl border border-[#e4e6e7] bg-white px-3 py-2 shadow-[0_1px_3px_rgba(15,23,42,.03)]"
    >
      {/* Date Range Picker */}
      <div className="relative">
        <button
          onClick={() => setOpen(open === -1 ? null : -1)}
          className="flex h-10 min-w-[158px] items-center gap-2 rounded-lg border border-[#e6e7e8] px-3 text-left hover:bg-gray-50 transition-colors"
        >
          <CalendarDays size={16} className="text-[#202426]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold text-[#202426]">
              {dateRange === "All" ? "Date" : dateRange}
            </span>
            <span className="block text-[8px] text-[#777e83]">
              {getDateRangeDisplay(dateRange)}
            </span>
          </span>
          <ChevronDown size={12} className={open === -1 ? "rotate-180" : ""} />
        </button>

        {open === -1 && (
          <div className="absolute left-0 top-12 z-50 w-44 overflow-hidden rounded-lg border border-[#e6e7e8] bg-white p-1 shadow-xl">
            {["All", "Today", "This Week", "This Month", "This Quarter", "This Year"].map((option) => (
              <button
                key={option}
                onClick={() => handleDateSelect(option)}
                className="block w-full rounded-md px-3 py-2.5 text-left text-[11px] hover:bg-[#f3f7f5] transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden h-7 w-px bg-[#eceeef] xl:block" />

      {/* Filter Dropdowns */}
      {filters.map((filter, index) => {
        return (
          <div key={filter.label} className="relative">
            <button
              onClick={() => setOpen(open === index ? null : index)}
              className="flex h-10 min-w-[100px] max-w-[220px] items-center justify-between gap-2 rounded-lg border border-[#e6e7e8] px-3 text-[10px] font-medium text-[#303537] hover:bg-gray-50 transition-colors"
            >
              <span className="truncate text-left font-semibold">
                {selected[index] === "All" ? filter.label : selected[index]}
              </span>
              <ChevronDown size={11} className={open === index ? "rotate-180 shrink-0 text-gray-400" : "shrink-0 text-gray-400"} />
            </button>

            {open === index && (
              <div className="absolute left-0 top-12 z-50 w-44 overflow-hidden rounded-lg border border-[#e6e7e8] bg-white p-1 shadow-xl">
                {filter.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterSelect(index, option)}
                    className="block w-full rounded-md px-3 py-2.5 text-left text-[11px] hover:bg-[#f3f7f5] transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* More Filters */}
      <button
        onClick={handleMoreFilters}
        className="flex h-10 items-center gap-2 rounded-lg border border-[#e6e7e8] px-3 text-[10px] font-medium hover:bg-gray-50 transition-colors"
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
              setSelected(filters.map(() => "All"));
              setDateRange("All");
              setTimeout(() => applyFilters(), 100);
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
      <button 
        onClick={handleImport}
        className="flex h-10 items-center gap-2 rounded-lg border border-[#e6e7e8] px-3 text-[10px] font-medium hover:bg-gray-50 transition-colors"
      >
        <Download size={13} /> Import
      </button>

      <FilterDrawer 
        isOpen={drawerOpen} 
        onClose={handleDrawerClose} 
      />
    </div>
  );
}