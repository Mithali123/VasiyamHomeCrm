"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Target,
  Globe,
  UserCheck,
  DollarSign,
  Star,
  Calendar,
  Clock,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Custom Dropdowns layout selector
interface OptionObject {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label: string;
  value: string;
  options: (string | OptionObject)[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onChange: (val: string) => void;
}

function CustomSelect({ label, value, options, onChange, icon: Icon }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const isDefault = value === "All";

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-1.5 py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-[#0D2E1D] rounded-xl text-xs text-[#1F1F1F] dark:text-white hover:border-[#C59A2C] focus:outline-none transition-all text-left shadow-sm select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon size={13} className="text-gray-400 dark:text-[#C59A2C] shrink-0" />
          <span className="truncate text-[#1F1F1F] dark:text-white font-bold">
            {isDefault ? label : value}
          </span>
        </div>
        <ChevronDown size={12} className={cn("text-gray-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#0d2e1d] border border-gray-150 dark:border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const optLabel = typeof opt === "string" ? opt : opt.label;
              const optVal = typeof opt === "string" ? opt : opt.value;
              return (
                <button
                  key={optVal}
                  onClick={() => {
                    onChange(optVal);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left py-2 px-3 text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                    optVal === value ? "text-primary dark:text-[#C59A2C] font-black bg-primary/5 dark:bg-white/5" : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  <span className="truncate">{optLabel}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface LeadFilterBarProps {
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  filterSource: string;
  setFilterSource: (val: string) => void;
  filterRM: string;
  setFilterRM: (val: string) => void;
  filterBudgetRange: string;
  setFilterBudgetRange: (val: string) => void;
  filterScoreRange: string;
  setFilterScoreRange: (val: string) => void;
  filterCreatedDate: string;
  setFilterCreatedDate: (val: string) => void;
  filterFollowUpStatus: string;
  setFilterFollowUpStatus: (val: string) => void;
  isBulkMode: boolean;
  setIsBulkMode: (val: boolean) => void;
  setSelectedLeadIds: (val: string[]) => void;
  leadStages: string[];
  leadSources: string[];
  relationshipManagers: string[];
  handleClearFilters: () => void;
}

export default function LeadFilterBar({
  filterStatus,
  setFilterStatus,
  filterSource,
  setFilterSource,
  filterRM,
  setFilterRM,
  filterBudgetRange,
  setFilterBudgetRange,
  filterScoreRange,
  setFilterScoreRange,
  filterCreatedDate,
  setFilterCreatedDate,
  filterFollowUpStatus,
  setFilterFollowUpStatus,
  isBulkMode,
  setIsBulkMode,
  setSelectedLeadIds,
  leadStages,
  leadSources,
  relationshipManagers,
  handleClearFilters
}: LeadFilterBarProps) {
  return (
    <div className="w-full flex flex-wrap items-center gap-2 text-xs pt-1.5">
      
      {/* Status custom select */}
      <div className="flex-1 min-w-[95px] max-w-[150px] shrink-0">
        <CustomSelect
          label="Status"
          value={filterStatus}
          options={["All", ...leadStages]}
          icon={Target}
          onChange={setFilterStatus}
        />
      </div>

      {/* Sources custom select */}
      <div className="flex-1 min-w-[95px] max-w-[155px] shrink-0">
        <CustomSelect
          label="Source"
          value={filterSource}
          options={["All", ...leadSources]}
          icon={Globe}
          onChange={setFilterSource}
        />
      </div>

      {/* RMs custom select */}
      <div className="flex-1 min-w-[80px] max-w-[145px] shrink-0">
        <CustomSelect
          label="RM"
          value={filterRM}
          options={["All", ...relationshipManagers]}
          icon={UserCheck}
          onChange={setFilterRM}
        />
      </div>

      {/* Budget Range custom select */}
      <div className="flex-1 min-w-[95px] max-w-[165px] shrink-0">
        <CustomSelect
          label="Budget"
          value={filterBudgetRange}
          options={["All", "< 50 Lakhs", "50 Lakhs - 1 Crore", "1 - 2 Crores", "> 2 Crores"]}
          icon={DollarSign}
          onChange={setFilterBudgetRange}
        />
      </div>

      {/* Score Range custom select with long text in dropdown options but short title label once selected */}
      <div className="flex-1 min-w-[90px] max-w-[180px] shrink-0">
        <CustomSelect
          label="Score"
          value={filterScoreRange}
          options={[
            { label: "All", value: "All" },
            { label: "Hot (80-100)", value: "Hot" },
            { label: "Warm (60-79)", value: "Warm" },
            { label: "Medium (40-59)", value: "Medium" },
            { label: "Cold (<40)", value: "Cold" }
          ]}
          icon={Star}
          onChange={setFilterScoreRange}
        />
      </div>

      {/* Date Range custom select */}
      <div className="flex-1 min-w-[85px] max-w-[150px] shrink-0">
        <CustomSelect
          label="Date"
          value={filterCreatedDate}
          options={["All", "This Month", "Today", "Yesterday", "Last 7 Days"]}
          icon={Calendar}
          onChange={setFilterCreatedDate}
        />
      </div>

      {/* Follow-up Status custom select */}
      <div className="flex-1 min-w-[105px] max-w-[180px] shrink-0">
        <CustomSelect
          label="Follow-up"
          value={filterFollowUpStatus}
          options={["All", "Today", "Tomorrow", "Overdue", "No Follow-up"]}
          icon={Clock}
          onChange={setFilterFollowUpStatus}
        />
      </div>

      {/* Enable/Disable Bulk Toggle & Clear button */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <div className="flex items-center rounded-xl bg-[#F8F5EE] dark:bg-white/5 p-0.5 border border-gray-250 dark:border-white/10 text-xs select-none">
          <button
            type="button"
            onClick={() => {
              setIsBulkMode(false);
              setSelectedLeadIds([]);
            }}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer whitespace-nowrap",
              !isBulkMode 
                ? "bg-[#133C27] text-white shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-[#133C27] dark:hover:text-white"
            )}
          >
            Disable Bulk
          </button>
          <button
            type="button"
            onClick={() => setIsBulkMode(true)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer whitespace-nowrap",
              isBulkMode 
                ? "bg-[#133C27] text-white shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:text-[#133C27] dark:hover:text-white"
            )}
          >
            Enable Bulk
          </button>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold text-gray-500 hover:text-[#133C27] dark:hover:text-[#C59A2C] transition-all cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 select-none"
        >
          <RotateCcw size={12} className="stroke-[2.5] text-[#64748b]" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
