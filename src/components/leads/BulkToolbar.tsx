"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserCheck, Download, Trash2 } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  mobile: string;
  secondaryMobile?: string;
  email: string;
  source: string;
  budget: number;
  project: string;
  rm: string;
  score: number;
  stage: "New" | "Contacted" | "Qualified" | "Site Visit" | "Negotiation" | "Booked" | "Lost";
  lastActivityTime: string;
  lastActivityDesc: string;
  nextFollowupText: string;
  createdDate: string;
  preferredLocation?: string;
  remarks?: string;
  avatar?: string;
}

interface BulkToolbarProps {
  isBulkMode: boolean;
  setIsBulkMode: (val: boolean) => void;
  paginatedLeads: Lead[];
  selectedLeadIds: string[];
  setSelectedLeadIds: (val: string[]) => void;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOpenAssignBulk: () => void;
  handleExportLeads: () => void;
  handleBulkDelete: () => void;
}

export default function BulkToolbar({
  isBulkMode,
  setIsBulkMode,
  paginatedLeads,
  selectedLeadIds,
  setSelectedLeadIds,
  handleSelectAll,
  handleOpenAssignBulk,
  handleExportLeads,
  handleBulkDelete
}: BulkToolbarProps) {
  if (!isBulkMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F8F5EE] dark:bg-white/5 p-2.5 px-4 rounded-xl border border-[#E8E2D6] dark:border-white/10 shadow-sm gap-2 mb-3"
    >
      {/* Left side actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 accent-[#133C27] cursor-pointer"
            checked={paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.includes(l.id))}
            onChange={handleSelectAll}
          />
          <span className="text-xs font-extrabold text-[#133C27] dark:text-[#C59A2C] pl-1 whitespace-nowrap">
            {selectedLeadIds.length} leads selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAssignBulk}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#0D2E1D] text-[11px] font-bold text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 transition-all select-none cursor-pointer"
          >
            <UserCheck size={12} className="text-[#C59A2C]" />
            <span>Assign RM</span>
          </button>
          
          <button
            onClick={handleExportLeads}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-[#0D2E1D] text-[11px] font-bold text-gray-700 dark:text-white shadow-sm hover:bg-gray-50 transition-all select-none cursor-pointer"
          >
            <Download size={12} className="text-[#C59A2C]" />
            <span>Export Selected</span>
          </button>

          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-[#0D2E1D] border border-red-200 dark:border-red-500/25 text-[11px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 transition-all select-none cursor-pointer"
          >
            <Trash2 size={12} />
            <span>Delete Selected</span>
          </button>
        </div>
      </div>
      
      {/* Right side options */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => setSelectedLeadIds([])}
          className="text-xs font-extrabold text-gray-500 hover:text-gray-800 dark:hover:text-white hover:underline whitespace-nowrap cursor-pointer"
        >
          Deselect All
        </button>
        
        <div className="h-4 w-px bg-gray-300 dark:bg-white/15" />

        <button
          onClick={() => {
            setIsBulkMode(false);
            setSelectedLeadIds([]);
          }}
          className="flex items-center gap-1 py-1.5 px-3 border border-gray-300 dark:border-white/20 rounded-lg text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer"
        >
          Cancel Bulk Mode
        </button>
      </div>
    </motion.div>
  );
}
