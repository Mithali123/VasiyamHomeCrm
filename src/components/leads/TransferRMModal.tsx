"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TransferRMModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferLeadName: string;
  setTransferLeadName: (val: string) => void;
  transferFromRM: string;
  setTransferFromRM: (val: string) => void;
  transferToRM: string;
  setTransferToRM: (val: string) => void;
  transferProject: string;
  setTransferProject: (val: string) => void;
  transferStage: string;
  setTransferStage: (val: string) => void;
  matchedLeadsByName: Lead[];
  leadsToTransfer: Lead[];
  relationshipManagers: string[];
  projectsList: string[];
  leadStages: string[];
  handleTransferSubmit: () => void;
}

export default function TransferRMModal({
  isOpen,
  onClose,
  transferLeadName,
  setTransferLeadName,
  transferFromRM,
  setTransferFromRM,
  transferToRM,
  setTransferToRM,
  transferProject,
  setTransferProject,
  transferStage,
  setTransferStage,
  matchedLeadsByName,
  leadsToTransfer,
  relationshipManagers,
  projectsList,
  leadStages,
  handleTransferSubmit
}: TransferRMModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="bg-white dark:bg-[#0D2E1D] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-md z-10 overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2 text-primary dark:text-[#C59A2C]">
                <RefreshCw size={18} />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  Transfer RM Portfolio
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-400 dark:text-white/60" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Bulk transfer leads from one relationship manager to another based on matching filters. This is useful for reassigning portfolios when an RM goes on leave.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className={cn("flex flex-col gap-1.5 transition-all", transferLeadName.trim().length > 0 && "opacity-40 pointer-events-none")}>
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    From RM {transferLeadName.trim().length > 0 && "(Bypassed)"}
                  </label>
                  <select
                    value={transferFromRM}
                    onChange={(e) => setTransferFromRM(e.target.value)}
                    className="py-2.5 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#C59A2C]"
                  >
                    {relationshipManagers.map((rm) => (
                      <option key={rm} value={rm}>
                        {rm}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    To RM
                  </label>
                  <select
                    value={transferToRM}
                    onChange={(e) => setTransferToRM(e.target.value)}
                    className="py-2.5 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#C59A2C]"
                  >
                    {relationshipManagers.map((rm) => (
                      <option key={rm} value={rm}>
                        {rm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Project
                  </label>
                  <select
                    value={transferProject}
                    onChange={(e) => setTransferProject(e.target.value)}
                    className="py-2.5 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#C59A2C]"
                  >
                    <option value="All Projects">All Projects</option>
                    {projectsList.map((proj) => (
                      <option key={proj} value={proj}>
                        {proj}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Lead Stage
                  </label>
                  <select
                    value={transferStage}
                    onChange={(e) => setTransferStage(e.target.value)}
                    className="py-2.5 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#C59A2C]"
                  >
                    <option value="All Stages">All Stages</option>
                    {leadStages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Lead Name (Optional filter)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh, Priya..."
                  value={transferLeadName}
                  onChange={(e) => setTransferLeadName(e.target.value)}
                  className="py-2.5 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#C59A2C]"
                />
                
                {matchedLeadsByName.length > 0 && (
                  <div className="mt-1.5 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-150 dark:border-white/5 space-y-2 max-h-[140px] overflow-y-auto">
                    <span className="text-[8px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block text-left">
                      Matching Leads ({matchedLeadsByName.length})
                    </span>
                    <div className="space-y-2">
                      {matchedLeadsByName.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="flex justify-between items-center text-[11px] border-b border-gray-100/50 dark:border-white/5 pb-1.5 last:border-b-0 last:pb-0">
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-gray-700 dark:text-gray-250 leading-snug">{lead.name}</span>
                            <span className="text-[9px] text-gray-400 dark:text-gray-500">{lead.project} • {lead.stage}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-amber-50 dark:bg-amber-950/40 text-[#C59A2C] px-1.5 py-0.5 rounded font-extrabold leading-none">
                              Current RM: {lead.rm}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setTransferFromRM(lead.rm);
                                const names = transferLeadName.split(',').map(n => n.trim());
                                if (names.length > 0) {
                                  names[names.length - 1] = lead.name;
                                } else {
                                  names.push(lead.name);
                                }
                                const uniqueNames = Array.from(new Set(names.filter(n => n.length > 0)));
                                setTransferLeadName(uniqueNames.join(', ') + ', ');
                              }}
                              className="text-[9px] text-[#133C27] dark:text-[#C59A2C] font-black hover:underline cursor-pointer select-none bg-emerald-50 dark:bg-[#133C27] hover:bg-emerald-100 dark:hover:bg-[#184b31] px-1.5 py-0.5 rounded transition-all"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      ))}
                      {matchedLeadsByName.length > 3 && (
                        <span className="text-[9px] text-gray-400 dark:text-gray-550 block text-center italic">
                          and {matchedLeadsByName.length - 3} more matching...
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-xl border border-amber-255 bg-amber-50/20 dark:bg-white/5 flex items-center justify-between shadow-sm">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Total Leads to Transfer
                  </span>
                  <span className="text-2xl font-black text-[#133C27] dark:text-[#C59A2C] mt-0.5">
                    {leadsToTransfer.length}
                  </span>
                </div>
                <Users size={24} className="text-[#C59A2C]/60" />
              </div>
            </div>

            <div className="p-6 border-t border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-250 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTransferSubmit}
                disabled={leadsToTransfer.length === 0 || transferFromRM === transferToRM}
                className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#184B31] shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
              >
                Transfer Leads
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
