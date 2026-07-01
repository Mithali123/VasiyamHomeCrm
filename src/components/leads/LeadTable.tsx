"use client";

import React from "react";
import {
  FolderOpen,
  Calendar,
  Phone,
  Mail,
  MoreVertical,
  Edit2,
  UserCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Home,
  Share2,
  Compass,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Local Custom SVG Icons for Lead Sources
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    {...props}
    fill="#1877F2"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 448 512"
    {...props}
    fill="#25D366"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const Acres99Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <rect width="24" height="24" rx="12" fill="#0056B3" />
    <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif">99</text>
  </svg>
);

// Maps dynamic branding icons for lead sources
const getSourceIcon = (source: string) => {
  switch (source) {
    case "Website":
      return Globe;
    case "99acres":
      return Acres99Icon;
    case "MagicBricks":
    case "Housing.com":
      return Home;
    case "WhatsApp":
      return WhatsAppIcon;
    case "Phone Call":
      return Phone;
    case "Instagram":
      return InstagramIcon;
    case "Facebook Ads":
    case "Meta Ads":
      return FacebookIcon;
    case "Google Ads":
      return GoogleIcon;
    case "Referral":
      return Share2;
    case "Walk-in":
      return Compass;
    default:
      return HelpCircle;
  }
};

// Styling configuration for Lead Source logo badges
const getSourceBadgeStyles = (source: string) => {
  switch (source) {
    case "Website":
      return {
        bg: "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800",
        color: "text-slate-500 dark:text-slate-400",
        iconColor: "#64748B"
      };
    case "99acres":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40",
        color: "text-blue-600 dark:text-blue-400",
        iconColor: "#0056B3"
      };
    case "MagicBricks":
      return {
        bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40",
        color: "text-red-600 dark:text-red-400",
        iconColor: "#EF4444"
      };
    case "Housing.com":
      return {
        bg: "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40",
        color: "text-rose-600 dark:text-rose-400",
        iconColor: "#EC4899"
      };
    case "WhatsApp":
      return {
        bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40",
        color: "text-emerald-600 dark:text-emerald-400",
        iconColor: "#25D366"
      };
    case "Phone Call":
      return {
        bg: "bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-900/40",
        color: "text-cyan-600 dark:text-cyan-400",
        iconColor: "#06B6D4"
      };
    case "Instagram":
      return {
        bg: "bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900/40",
        color: "text-pink-600 dark:text-pink-400",
        iconColor: "#E1306C"
      };
    case "Facebook Ads":
    case "Meta Ads":
      return {
        bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40",
        color: "text-blue-600 dark:text-blue-400",
        iconColor: "#1877F2"
      };
    case "Google Ads":
      return {
        bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40",
        color: "text-amber-600 dark:text-amber-400",
        iconColor: "#4285F4"
      };
    case "Referral":
      return {
        bg: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40",
        color: "text-purple-600 dark:text-purple-400",
        iconColor: "#8B5CF6"
      };
    case "Walk-in":
      return {
        bg: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40",
        color: "text-orange-600 dark:text-orange-400",
        iconColor: "#D97706"
      };
    default:
      return {
        bg: "bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800",
        color: "text-gray-500 dark:text-gray-400",
        iconColor: "#6B7280"
      };
  }
};

// Stage badge layout helper
const getStageBadgeStyles = (stage: string) => {
  switch (stage) {
    case "New":
      return "bg-blue-50 text-blue-700 border-blue-150 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
    case "Contacted":
      return "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/40 dark:text-[#C59A2C] dark:border-amber-900";
    case "Qualified":
      return "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
    case "Site Visit":
      return "bg-purple-50 text-purple-700 border-purple-150 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900";
    case "Negotiation":
      return "bg-red-50 text-red-700 border-red-150 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900";
    default:
      return "bg-gray-50 text-gray-700 border-gray-150 dark:bg-white/5 dark:text-white/60 dark:border-white/10";
  }
};

// Score circle outline color helper
const getScoreCircleColor = (score: number) => {
  if (score >= 80) return "border-emerald-500 text-emerald-600 bg-emerald-50/20";
  if (score >= 60) return "border-amber-500 text-amber-600 bg-amber-50/20";
  if (score >= 40) return "border-orange-500 text-orange-650 bg-orange-50/20";
  return "border-red-500 text-red-600 bg-red-50/20";
};

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

interface LeadTableProps {
  isLoading: boolean;
  processedLeads: Lead[];
  paginatedLeads: Lead[];
  isBulkMode: boolean;
  selectedLeadIds: string[];
  rowActionsOpenId: string | null;
  currentPage: number;
  rowsPerPage: number;
  totalPages: number;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectRow: (id: string) => void;
  handleOpenEdit: (lead: Lead) => void;
  handleOpenAssignSingle: (lead: Lead) => void;
  handleDeleteLead: (id: string) => void;
  handleClearFilters: () => void;
  handleOpenCreate: () => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setRowActionsOpenId: (id: string | null) => void;
}

export default function LeadTable({
  isLoading,
  processedLeads,
  paginatedLeads,
  isBulkMode,
  selectedLeadIds,
  rowActionsOpenId,
  currentPage,
  rowsPerPage,
  totalPages,
  handleSelectAll,
  handleSelectRow,
  handleOpenEdit,
  handleOpenAssignSingle,
  handleDeleteLead,
  handleClearFilters,
  handleOpenCreate,
  setCurrentPage,
  setRowsPerPage,
  setRowActionsOpenId
}: LeadTableProps) {
  return (
    <div className="bg-white dark:bg-[#0D2E1D] border border-[#E8E2D6] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden relative">
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-gray-250 dark:bg-white/10 rounded w-full" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-5" />
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-16" />
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-32" />
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-24" />
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-28" />
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded w-12" />
              </div>
            ))}
          </div>
        ) : processedLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-primary/5 dark:bg-[#C59A2C]/5 rounded-full flex items-center justify-center text-primary dark:text-[#C59A2C] mb-4">
              <FolderOpen size={36} />
            </div>
            <h3 className="text-base font-bold text-primary dark:text-[#C59A2C]">No Leads Found</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm text-center">
              Create your first lead or clear filter criteria to start managing customer enquiries.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleClearFilters}
                className="rounded-lg border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
              >
                Clear Search Filters
              </button>
              <button
                onClick={handleOpenCreate}
                className="rounded-lg bg-primary text-white px-4 py-2 text-xs font-bold hover:bg-[#184B31] cursor-pointer"
              >
                Create Lead
              </button>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-auto relative select-none">
            <thead>
              <tr className="border-b border-[#E8E2D6] dark:border-white/10 bg-gray-50/70 dark:bg-white/5 text-[10px] font-bold text-[#6B7280] dark:text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-md z-10">
                {/* Checkbox Header Column (Sticky Left) */}
                {isBulkMode && (
                  <th className="py-3 pl-6 pr-4 w-10 sticky left-0 bg-gray-50 dark:bg-[#0D2E1D] z-20">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 accent-[#133C27] cursor-pointer"
                      checked={paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.includes(l.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th className={cn("py-3 px-3 w-16", !isBulkMode && "pl-6")}>Lead</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3 text-center">Lead Stage</th>
                <th className="py-3 px-4">RM</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-4">Next Follow-up</th>
                <th className="py-3 px-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D6] dark:divide-white/5">
              {paginatedLeads.map((lead) => {
                const isChecked = selectedLeadIds.includes(lead.id);
                const SrcIcon = getSourceIcon(lead.source);
                
                return (
                  <tr
                    key={lead.id}
                    className={cn(
                      "text-xs hover:bg-[#FBF9F4] dark:hover:bg-white/5 transition-colors group",
                      isChecked && "bg-primary/5 dark:bg-[#C59A2C]/5"
                    )}
                  >
                    {/* Checkbox Cell (Sticky Left) */}
                    {isBulkMode && (
                      <td className="py-3 pl-6 pr-4 sticky left-0 bg-white dark:bg-[#0D2E1D] group-hover:bg-[#FBF9F4] dark:group-hover:bg-[#0E3521] z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)] transition-colors">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 accent-[#133C27] cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleSelectRow(lead.id)}
                        />
                      </td>
                    )}
                    
                    {/* Lead (Name + ID) */}
                    <td className={cn("py-3 px-3", !isBulkMode && "pl-6")}>
                      <div className="flex items-center gap-1.5 text-left whitespace-nowrap">
                        <span 
                          className="font-extrabold text-primary dark:text-[#C59A2C] leading-tight hover:underline cursor-pointer"
                          onClick={() => handleOpenEdit(lead)}
                        >
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          ({lead.id})
                        </span>
                      </div>
                    </td>

                    {/* Contact (Phone + Email underneath) */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-left leading-tight">
                        <span className="font-extrabold text-gray-700 dark:text-gray-350">
                          {lead.mobile}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5 font-medium">
                          {lead.email}
                        </span>
                      </div>
                    </td>

                    {/* Source badge with colored brand icon and tooltip */}
                    <td className="py-3 px-3">
                      <div className="flex justify-start">
                        <div
                          title={lead.source}
                          className={cn(
                            "w-8 h-8 rounded-xl border flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:scale-105 cursor-pointer",
                            getSourceBadgeStyles(lead.source).bg,
                            getSourceBadgeStyles(lead.source).color
                          )}
                        >
                          <SrcIcon size={16} stroke={getSourceBadgeStyles(lead.source).iconColor} className="shrink-0" />
                        </div>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="py-3 px-3 font-bold text-gray-700 dark:text-gray-350">
                      {lead.project}
                    </td>

                    {/* Lead Stage Badge */}
                    <td className="py-3 px-3 whitespace-nowrap text-center">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-tight inline-block",
                          getStageBadgeStyles(lead.stage)
                        )}
                      >
                        {lead.stage}
                      </span>
                    </td>

                    {/* RM Name */}
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "font-bold text-[11px]",
                          lead.rm === "Unassigned"
                            ? "text-amber-600 italic font-normal"
                            : "text-gray-800 dark:text-gray-350"
                        )}
                      >
                        {lead.rm}
                      </span>
                    </td>

                    {/* Last Activity (Time + action subtext) */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-left leading-tight">
                        <span className="font-extrabold text-gray-700 dark:text-gray-350">
                          {lead.lastActivityTime}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5 font-medium">
                          {lead.lastActivityDesc}
                        </span>
                      </div>
                    </td>

                    {/* Score circle outline ring (Exactly replicates mockup) */}
                    <td className="py-3 px-3 text-center">
                      <div className={cn(
                        "w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black mx-auto",
                        getScoreCircleColor(lead.score)
                      )}>
                        {lead.score}
                      </div>
                    </td>

                    {/* Next Follow-up (Calendar icon + Date/Time) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-350">
                        <Calendar size={13} className="text-gray-400 shrink-0" />
                        <span className="font-bold text-[11px]">{lead.nextFollowupText}</span>
                      </div>
                    </td>

                    {/* Row Action Icons (Phone, Mail, ⋮ dropdown) */}
                    <td className="py-3 px-4 text-right pr-6 relative">
                      <div className="inline-flex items-center gap-2.5">
                        <button
                          onClick={() => alert(`Calling ${lead.name} at ${lead.mobile}...`)}
                          className="p-1 hover:bg-[#F8F5EE] dark:hover:bg-white/10 rounded text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          title="Call Lead"
                        >
                          <Phone size={13} />
                        </button>
                        
                        <button
                          onClick={() => window.open(`mailto:${lead.email}`)}
                          className="p-1 hover:bg-[#F8F5EE] dark:hover:bg-white/10 rounded text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          title="Send Email"
                        >
                          <Mail size={13} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRowActionsOpenId(rowActionsOpenId === lead.id ? null : lead.id);
                          }}
                          className="p-1 hover:bg-[#F8F5EE] dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>

                      {/* Overflow Dropdown Box */}
                      <AnimatePresence>
                        {rowActionsOpenId === lead.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRowActionsOpenId(null);
                              }}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 6 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-6 mt-1 w-48 bg-white dark:bg-[#0D2E1D] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-40 overflow-hidden text-left"
                            >
                              <button
                                onClick={() => handleOpenEdit(lead)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-205 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-bold cursor-pointer"
                              >
                                <Edit2 size={13} className="text-[#C59A2C]" />
                                <span>Edit Lead</span>
                              </button>
                              
                              <button
                                onClick={() => handleOpenAssignSingle(lead)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-205 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-bold cursor-pointer"
                              >
                                <UserCheck size={13} className="text-[#C59A2C]" />
                                <span>Assign Manager</span>
                              </button>
                              
                              <hr className="border-gray-100 dark:border-white/5" />
                              
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold cursor-pointer"
                              >
                                <Trash2 size={13} />
                                <span>Delete Lead</span>
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 5. TABLE PAGINATION CONTROLS */}
      {!isLoading && processedLeads.length > 0 && (
        <div className="bg-gray-50/50 dark:bg-white/5 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#E8E2D6] dark:border-white/10 gap-3">
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-bold">
            <span>
              Showing{" "}
              <span className="font-extrabold text-[#1F1F1F] dark:text-white">
                {Math.min((currentPage - 1) * rowsPerPage + 1, processedLeads.length)}
              </span>{" "}
              to{" "}
              <span className="font-extrabold text-[#1F1F1F] dark:text-white">
                {Math.min(currentPage * rowsPerPage, processedLeads.length)}
              </span>{" "}
              of{" "}
              <span className="font-extrabold text-[#1F1F1F] dark:text-white">2,415</span>{" "}
              leads
            </span>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-black">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-0.5 px-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-md text-xs font-bold focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Pagination numbers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>

            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                  currentPage === p
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                    : "bg-white border-gray-200 dark:bg-transparent dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                )}
              >
                {p}
              </button>
            ))}

            <span className="px-1 text-gray-400 text-xs">...</span>

            <button
              onClick={() => setCurrentPage(242)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                currentPage === 242
                  ? "bg-primary border-primary text-white shadow-md"
                  : "bg-white border-gray-200 dark:bg-transparent dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              242
            </button>

            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
            <select
              value={`${rowsPerPage} / page`}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setRowsPerPage(val);
                setCurrentPage(1);
              }}
              className="py-1 px-2 border border-gray-255 dark:border-white/15 bg-white dark:bg-[#0D2E1D] rounded-lg focus:outline-none text-[11px] font-bold cursor-pointer"
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
