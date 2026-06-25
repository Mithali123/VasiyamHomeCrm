"use client";

import {
  SlidersHorizontal,
  Download,
  Loader2,
  ChevronDown,
  Building2,
  Users,
  Filter,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import FilterDrawer from "./FilterDrawer";

const datePresets = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7D" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
];

const scopeOptions = [
  { key: "my", label: "My Data" },
  { key: "team", label: "My Team" },
  { key: "all", label: "All Teams" },
];

const chipFilters = [
  { id: "project", label: "Project", icon: Building2 },
  { id: "rm", label: "RM", icon: Users },
  { id: "source", label: "Source", icon: Filter },
  { id: "stage", label: "Stage", icon: Clock },
];

const filterOptions = {
  project: ["All", "Skyline", "Green Acres", "Lake View", "Palm Residency"],
  rm: ["All", "Rahul", "Priya", "Arjun", "Kiran"],
  source: ["All", "Website", "Meta Ads", "Google Ads", "Referral"],
  stage: [
    "All",
    "New",
    "Follow Up",
    "Site Visit",
    "Negotiation",
    "Booked",
  ],
};

export default function FilterBar() {
  const [activeDate, setActiveDate] = useState("month");
  const [activeScope, setActiveScope] = useState("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [filters, setFilters] = useState({
    project: "All",
    rm: "All",
    source: "All",
    stage: "All",
  });

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      console.log({
        date: activeDate,
        scope: activeScope,
        filters,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mb-8 space-y-3">
      {/* MAIN FILTER CARD */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-white" />

        <div className="absolute left-0 right-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-primary via-primary/60 to-transparent" />

        <div className="relative flex flex-wrap items-center gap-2 px-4 py-3">
          {/* Calendar */}
          <div className="flex items-center gap-1.5 text-primary shrink-0">
            <CalendarDays size={15} />
          </div>

          {/* Date Presets */}
          <div className="flex items-center gap-0.5 rounded-xl border border-gray-100 bg-gray-50 p-1">
            {datePresets.map((preset) => (
              <button
                key={preset.key}
                onClick={() => setActiveDate(preset.key)}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200",
                  activeDate === preset.key
                    ? "text-white"
                    : "text-gray-500 hover:bg-white/60 hover:text-gray-700"
                )}
              >
                {activeDate === preset.key && (
                  <motion.span
                    layoutId="activeDateBg"
                    className="absolute inset-0 rounded-lg bg-primary shadow-md shadow-primary/25"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                    }}
                  />
                )}

                <span className="relative z-10">{preset.label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-200 shrink-0" />

          {/* Scope */}
          <div className="flex items-center gap-0.5 rounded-xl border border-gray-100 bg-gray-50 p-1">
            {scopeOptions.map((scope) => (
              <button
                key={scope.key}
                onClick={() => setActiveScope(scope.key)}
                className={cn(
                  "relative rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200",
                  activeScope === scope.key
                    ? "border border-primary/20 bg-white text-primary shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {scope.label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-w-[20px]" />

          {/* More Filters */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/10 active:scale-95"
          >
            <SlidersHorizontal size={14} />
            <span>More Filters</span>
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95",
              isExporting
                ? "cursor-wait bg-primary/80 text-white/80"
                : "bg-primary text-white shadow-md shadow-primary/25 hover:opacity-90"
            )}
          >
            <AnimatePresence mode="wait">
              {isExporting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 size={14} className="animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="download"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Download size={14} />
                </motion.div>
              )}
            </AnimatePresence>

            <span>
              {isExporting ? "Exporting..." : "Export Report"}
            </span>
          </button>
        </div>
      </div>

      {/* CHIP FILTERS */}
      <motion.div
        layout
        ref={dropdownRef}
        className="flex flex-wrap items-center gap-2"
      >
        {chipFilters.map((filter, index) => {
          const Icon = filter.icon;

          return (
            <div key={filter.id} className="relative">
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() =>
                  setOpenFilter(
                    openFilter === filter.id ? null : filter.id
                  )
                }
                className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <Icon
                  size={11}
                  className="shrink-0 text-gray-400 transition-colors group-hover:text-primary"
                />

                <span>
                  {filter.label}:{" "}
                  {
                    filters[
                      filter.id as keyof typeof filters
                    ]
                  }
                </span>

                <ChevronDown
                  size={10}
                  className={cn(
                    "transition-transform duration-200",
                    openFilter === filter.id && "rotate-180"
                  )}
                />
              </motion.button>

              <AnimatePresence>
                {openFilter === filter.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                  >
                    {filterOptions[
                      filter.id as keyof typeof filterOptions
                    ].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            [filter.id]: option,
                          }));

                          setOpenFilter(null);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-xs transition-colors",
                          filters[
                            filter.id as keyof typeof filters
                          ] === option
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* FILTER DRAWER */}
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}