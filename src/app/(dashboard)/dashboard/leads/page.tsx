"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Upload,
  Download,
  RefreshCw,
  MoreVertical,
  X,
  Edit2,
  UserCheck,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import LeadCards from "@/components/leads/LeadCards";
import LeadFilterBar from "@/components/leads/LeadFilterBar";
import BulkToolbar from "@/components/leads/BulkToolbar";
import LeadTable from "@/components/leads/LeadTable";
import TransferRMModal from "@/components/leads/TransferRMModal";
import { getStoredLeads, saveStoredLeads, Lead, initialMockLeads } from "@/lib/leadsStore";


// Master reference arrays for dropdowns and select lists
const relationshipManagers = ["Arun Kumar", "Meera Nair", "Divya Sharma", "Suresh Pillai", "Unassigned"];
const leadSources = ["Website", "99acres", "MagicBricks", "Facebook Ads", "Meta Ads", "Google Ads", "Housing.com", "Referral", "Walk-in", "WhatsApp", "Instagram", "Phone Call"];
const projectsList = ["Vasiyam Enclave", "Vasiyam Grandeur", "Vasiyam Meadows", "The Residency", "Sky Heights"];
const leadStages = ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Booked", "Lost"];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(() => getStoredLeads(initialMockLeads));

  useEffect(() => {
    saveStoredLeads(leads);
  }, [leads]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; message: string }[]>([]);

  // Filter Bar states
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [filterRM, setFilterRM] = useState("All");
  const [filterBudgetRange, setFilterBudgetRange] = useState("All");
  const [filterScoreRange, setFilterScoreRange] = useState("All");
  const [filterCreatedDate, setFilterCreatedDate] = useState("All");
  const [filterFollowUpStatus, setFilterFollowUpStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Modals visibility
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [bulkAssignTarget, setBulkAssignTarget] = useState<string>("");
  const [rowActionsOpenId, setRowActionsOpenId] = useState<string | null>(null);

  // Bulk Mode and RM Transfer states
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isTransferRMOpen, setIsTransferRMOpen] = useState(false);
  const [transferFromRM, setTransferFromRM] = useState("Arun Kumar");
  const [transferToRM, setTransferToRM] = useState("Meera Nair");
  const [transferProject, setTransferProject] = useState("All Projects");
  const [transferStage, setTransferStage] = useState("All Stages");
  const [transferLeadName, setTransferLeadName] = useState("");

  // Form Validation & Input
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: "",
    mobile: "",
    secondaryMobile: "",
    email: "",
    source: "Website",
    budget: 5000000,
    project: "Vasiyam Enclave",
    rm: "Unassigned",
    score: 50,
    stage: "New",
    preferredLocation: "",
    remarks: ""
  });

  // Listen to the custom global search event from Header
  useEffect(() => {
    // Sync initial search query from header input if any (asynchronously to avoid set-state-in-effect warning)
    const headerInput = document.getElementById("search-input") as HTMLInputElement;
    if (headerInput && headerInput.value) {
      setTimeout(() => setSearchQuery(headerInput.value), 0);
    }

    const handleGlobalSearch = (e: Event) => {
      const query = (e as CustomEvent).detail;
      setSearchQuery(query || "");
    };
    window.addEventListener("global-search", handleGlobalSearch);
    return () => {
      window.removeEventListener("global-search", handleGlobalSearch);
    };
  }, []);

  function triggerPageRefresh() {
    setIsLoading(true);
    setRowActionsOpenId(null);
    setTimeout(() => {
      setIsLoading(false);
      showToast("success", "Lead database refreshed successfully.");
    }, 800);
  }

  // Listen to the custom global Header refresh event
  useEffect(() => {
    const handleRefreshEvent = () => {
      triggerPageRefresh();
    };
    window.addEventListener("leads-refresh", handleRefreshEvent);
    return () => {
      window.removeEventListener("leads-refresh", handleRefreshEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showToast(type: "success" | "error", message: string) {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  // Re-calculate KPI values based on state
  const summaryKPIs = useMemo(() => {
    const assigned = 1156 + leads.filter((l) => l.rm !== "Unassigned" && !initialMockLeads.some((il) => il.id === l.id)).length;
    const unassigned = 128 + leads.filter((l) => l.rm === "Unassigned" && !initialMockLeads.some((il) => il.id === l.id)).length;
    const qualified = 312 + leads.filter((l) => l.stage === "Qualified" && !initialMockLeads.some((il) => il.id === l.id)).length;

    return { assigned, unassigned, qualified };
  }, [leads]);

  const rmWorkloads = useMemo(() => {
    const localArun = leads.filter(l => l.rm === "Arun Kumar" && !initialMockLeads.some(il => il.id === l.id)).length;
    const localMeera = leads.filter(l => l.rm === "Meera Nair" && !initialMockLeads.some(il => il.id === l.id)).length;
    const localDivya = leads.filter(l => l.rm === "Divya Sharma" && !initialMockLeads.some(il => il.id === l.id)).length;
    
    return [
      { name: "Arun", count: 520 + localArun },
      { name: "Meera", count: 410 + localMeera },
      { name: "Divya", count: 226 + localDivya }
    ];
  }, [leads]);

  const unassignedSources = useMemo(() => {
    const localWebsite = leads.filter(l => l.rm === "Unassigned" && l.source === "Website" && !initialMockLeads.some(il => il.id === l.id)).length;
    const localAds = leads.filter(l => l.rm === "Unassigned" && (l.source.includes("Ads") || l.source.includes("Facebook") || l.source.includes("Meta") || l.source.includes("Google")) && !initialMockLeads.some(il => il.id === l.id)).length;
    
    return [
      { name: "Website", count: 78 + localWebsite },
      { name: "Ads/Social", count: 50 + localAds }
    ];
  }, [leads]);

  const followupBreakdown = useMemo(() => {
    const localOverdue = leads.filter(l => {
      if (l.stage !== "Qualified") return false;
      if (!l.nextFollowupText || l.nextFollowupText === "None") return false;
      return !l.nextFollowupText.toLowerCase().includes("today") && !l.nextFollowupText.toLowerCase().includes("tomorrow");
    }).length;
    const localToday = leads.filter(l => l.stage === "Qualified" && l.nextFollowupText.toLowerCase().includes("today")).length;
    
    return {
      overdue: 48 + localOverdue,
      today: 84 + localToday
    };
  }, [leads]);

  const matchedLeadsByName = useMemo(() => {
    if (!transferLeadName.trim()) return [];
    const queries = transferLeadName.split(',').map(q => q.toLowerCase().trim()).filter(q => q.length > 0);
    if (queries.length === 0) return [];
    return leads.filter(l => queries.some(query => l.name.toLowerCase().includes(query)));
  }, [leads, transferLeadName]);

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      secondaryMobile: "",
      email: "",
      source: "Website",
      budget: 5000000,
      project: "Vasiyam Enclave",
      rm: "Unassigned",
      score: 50,
      stage: "New",
      preferredLocation: "",
      remarks: ""
    });
    setFormErrors({});
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (lead: Lead) => {
    setFormData({ ...lead });
    setActiveLead(lead);
    setFormErrors({});
    setIsEditOpen(true);
    setRowActionsOpenId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let typedValue: string | number = value;
    if (name === "budget" || name === "score") {
      typedValue = Number(value) || 0;
    }
    setFormData((prev) => ({ ...prev, [name]: typedValue }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      errors.name = "Customer name is required.";
    }
    if (!formData.mobile?.trim()) {
      errors.mobile = "Mobile number is required.";
    }
    if (formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please specify a valid email address.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = (saveAndAnother: boolean = false) => {
    if (!validateForm()) {
      showToast("error", "Please correct the errors in the form.");
      return;
    }

    const newId = `LD-${2400 + leads.length + 1}`;
    const newLeadRecord: Lead = {
      id: newId,
      name: formData.name || "",
      mobile: formData.mobile || "",
      secondaryMobile: formData.secondaryMobile,
      email: formData.email || "",
      source: formData.source || "Website",
      budget: formData.budget || 5000000,
      project: formData.project || "Vasiyam Enclave",
      rm: formData.rm || "Unassigned",
      score: formData.score || 50,
      stage: (formData.stage as Lead["stage"]) || "New",
      lastActivityTime: "Just now",
      lastActivityDesc: "Lead created",
      nextFollowupText: "Tomorrow, 10:00 AM",
      createdDate: new Date().toISOString().split("T")[0],
      preferredLocation: formData.preferredLocation,
      remarks: formData.remarks
    };

    setLeads((prev) => [newLeadRecord, ...prev]);
    showToast("success", "Lead Created Successfully.");

    if (saveAndAnother) {
      resetForm();
    } else {
      setIsCreateOpen(false);
      resetForm();
    }
  };

  const handleEditSubmit = () => {
    if (!validateForm() || !activeLead) {
      showToast("error", "Please correct the errors in the form.");
      return;
    }

    setLeads((prev) =>
      prev.map((l) =>
        l.id === activeLead.id
          ? {
              ...l,
              name: formData.name || "",
              mobile: formData.mobile || "",
              secondaryMobile: formData.secondaryMobile,
              email: formData.email || "",
              source: formData.source || "Website",
              budget: formData.budget || 5000000,
              project: formData.project || "Vasiyam Enclave",
              rm: formData.rm || "Unassigned",
              score: formData.score || 50,
              stage: (formData.stage as Lead["stage"]) || "New",
              preferredLocation: formData.preferredLocation,
              remarks: formData.remarks,
              lastActivityTime: "Just now",
              lastActivityDesc: "Lead updated"
            }
          : l
      )
    );

    showToast("success", "Lead Updated Successfully.");
    setIsEditOpen(false);
    setActiveLead(null);
    resetForm();
  };

  const handleDeleteLead = (id: string) => {
    if (confirm(`Are you sure you want to delete lead ${id}?`)) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setSelectedLeadIds((prev) => prev.filter((item) => item !== id));
      showToast("success", "Lead Deleted Successfully.");
      setRowActionsOpenId(null);
    }
  };

  const handleOpenAssignSingle = (lead: Lead) => {
    setBulkAssignTarget(lead.rm);
    setActiveLead(lead);
    setIsAssignOpen(true);
    setRowActionsOpenId(null);
  };

  const handleOpenAssignBulk = () => {
    if (selectedLeadIds.length === 0) {
      showToast("error", "Please select leads first.");
      return;
    }
    setBulkAssignTarget("Unassigned");
    setActiveLead(null);
    setIsAssignOpen(true);
  };

  const handleAssignSubmit = () => {
    if (activeLead) {
      setLeads((prev) =>
        prev.map((l) => (l.id === activeLead.id ? { ...l, rm: bulkAssignTarget } : l))
      );
      showToast("success", "Lead Assigned Successfully.");
    } else {
      setLeads((prev) =>
        prev.map((l) => (selectedLeadIds.includes(l.id) ? { ...l, rm: bulkAssignTarget } : l))
      );
      showToast("success", "Leads Assigned Successfully.");
      setSelectedLeadIds([]);
    }
    setIsAssignOpen(false);
    setActiveLead(null);
  };

  const handleBulkDelete = () => {
    if (selectedLeadIds.length === 0) return;
    if (confirm(`Are you sure you want to delete the ${selectedLeadIds.length} selected leads?`)) {
      setLeads((prev) => prev.filter((l) => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
      showToast("success", "Lead Deleted Successfully.");
    }
  };

  const handleExportLeads = () => {
    showToast("success", "Leads Exported Successfully.");
  };

  const handleImportLeads = () => {
    showToast("success", "Leads Imported Successfully.");
  };

  const handleOpenTransferRM = () => {
    setTransferFromRM("Arun Kumar");
    setTransferToRM("Meera Nair");
    setTransferProject("All Projects");
    setTransferStage("All Stages");
    setTransferLeadName("");
    setIsTransferRMOpen(true);
  };

  const handleTransferSubmit = () => {
    const hasNameFilter = transferLeadName.trim().length > 0;
    if (!hasNameFilter && transferFromRM === transferToRM) {
      showToast("error", "From RM and To RM must be different.");
      return;
    }
    const count = leadsToTransfer.length;
    if (count === 0) {
      showToast("error", "No matching leads found to transfer.");
      return;
    }

    const confirmMessage = hasNameFilter
      ? `Transfer ${count} leads to ${transferToRM}?`
      : `Transfer ${count} leads from ${transferFromRM} to ${transferToRM}?`;

    if (confirm(confirmMessage)) {
      setLeads((prev) =>
        prev.map((l) => {
          const isFromRM = hasNameFilter ? true : (l.rm === transferFromRM);
          const isProjectMatch = transferProject === "All Projects" || l.project === transferProject;
          const isStageMatch = transferStage === "All Stages" || l.stage === transferStage;
          let isNameMatch = true;
          if (transferLeadName.trim()) {
            const queries = transferLeadName.split(',').map(q => q.toLowerCase().trim()).filter(q => q.length > 0);
            if (queries.length > 0) {
              isNameMatch = queries.some(query => l.name.toLowerCase().includes(query));
            }
          }

          if (isFromRM && isProjectMatch && isStageMatch && isNameMatch) {
            return {
              ...l,
              rm: transferToRM,
              lastActivityTime: "Just now",
              lastActivityDesc: `Portfolio transferred to ${transferToRM}`
            };
          }
          return l;
        })
      );
      showToast("success", `Transferred ${count} leads successfully.`);
      setIsTransferRMOpen(false);
    }
  };

  // Changed to normal computed value to resolve React compiler manual-memoization errors
  const leadsToTransfer = leads.filter((lead) => {
    const hasNameFilter = transferLeadName.trim().length > 0;
    if (!hasNameFilter && lead.rm !== transferFromRM) return false;
    if (transferProject !== "All Projects" && lead.project !== transferProject) return false;
    if (transferStage !== "All Stages" && lead.stage !== transferStage) return false;
    if (hasNameFilter) {
      const queries = transferLeadName.split(',').map(q => q.toLowerCase().trim()).filter(q => q.length > 0);
      if (queries.length > 0) {
        const nameMatch = queries.some(query => lead.name.toLowerCase().includes(query));
        if (!nameMatch) return false;
      }
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(paginatedLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setFilterSource("All");
    setFilterRM("All");
    setFilterBudgetRange("All");
    setFilterScoreRange("All");
    setFilterCreatedDate("All");
    setFilterFollowUpStatus("All");
    setSortBy("newest");
    setSelectedLeadIds([]);
    setCurrentPage(1);
    showToast("success", "Filters cleared successfully.");
  };

  // Filter and Sort Processing Logic
  const processedLeads = useMemo(() => {
    let result = [...leads];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.mobile.includes(q) ||
          l.project.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "All") {
      result = result.filter((l) => l.stage === filterStatus);
    }

    if (filterRM !== "All") {
      result = result.filter((l) => l.rm === filterRM);
    }

    if (filterSource !== "All") {
      result = result.filter((l) => l.source === filterSource);
    }

    if (filterBudgetRange !== "All") {
      if (filterBudgetRange === "< 50 Lakhs") {
        result = result.filter((l) => l.budget < 5000000);
      } else if (filterBudgetRange === "50 Lakhs - 1 Crore") {
        result = result.filter((l) => l.budget >= 5000000 && l.budget <= 10000000);
      } else if (filterBudgetRange === "1 - 2 Crores") {
        result = result.filter((l) => l.budget > 10000000 && l.budget <= 20000000);
      } else if (filterBudgetRange === "> 2 Crores") {
        result = result.filter((l) => l.budget > 20000000);
      }
    }

    if (filterScoreRange !== "All") {
      if (filterScoreRange === "Hot") {
        result = result.filter((l) => l.score >= 80 && l.score <= 100);
      } else if (filterScoreRange === "Warm") {
        result = result.filter((l) => l.score >= 60 && l.score <= 79);
      } else if (filterScoreRange === "Medium") {
        result = result.filter((l) => l.score >= 40 && l.score <= 59);
      } else if (filterScoreRange === "Cold") {
        result = result.filter((l) => l.score < 40);
      }
    }

    if (filterCreatedDate !== "All") {
      const now = new Date(2026, 5, 25);
      result = result.filter((l) => {
        const leadDate = new Date(l.createdDate);
        if (filterCreatedDate === "Today") {
          return l.createdDate === "2026-06-25";
        }
        if (filterCreatedDate === "Yesterday") {
          return l.createdDate === "2026-06-24";
        }
        if (filterCreatedDate === "Last 7 Days") {
          const diffTime = Math.abs(now.getTime() - leadDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7;
        }
        if (filterCreatedDate === "This Month") {
          return leadDate.getMonth() === 5 && leadDate.getFullYear() === 2026;
        }
        return true;
      });
    }

    if (filterFollowUpStatus !== "All") {
      if (filterFollowUpStatus === "Today") {
        result = result.filter((l) => l.nextFollowupText.toLowerCase().includes("today"));
      } else if (filterFollowUpStatus === "Tomorrow") {
        result = result.filter((l) => l.nextFollowupText.toLowerCase().includes("tomorrow"));
      } else if (filterFollowUpStatus === "Overdue") {
        result = result.filter((l) => {
          if (!l.nextFollowupText || l.nextFollowupText === "None") return false;
          const isToday = l.nextFollowupText.toLowerCase().includes("today");
          const isTomorrow = l.nextFollowupText.toLowerCase().includes("tomorrow");
          return !isToday && !isTomorrow;
        });
      } else if (filterFollowUpStatus === "No Follow-up") {
        result = result.filter((l) => !l.nextFollowupText || l.nextFollowupText === "None");
      }
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      if (sortBy === "oldest") return a.id.localeCompare(b.id);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "budget") return b.budget - a.budget;
      if (sortBy === "score") return b.score - a.score;
      return 0;
    });

    return result;
  }, [leads, searchQuery, filterStatus, filterRM, filterSource, filterBudgetRange, filterScoreRange, filterCreatedDate, filterFollowUpStatus, sortBy]);

  // Changed to normal computed value to resolve React compiler manual-memoization errors
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLeads = processedLeads.slice(startIndex, startIndex + rowsPerPage);

  const totalPages = Math.ceil(processedLeads.length / rowsPerPage) || 1;

  return (
    <div className="space-y-5 pb-10 text-[#1F1F1F] dark:text-white transition-colors duration-200">
      
      {/* Toast Alert Box */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl shadow-xl flex items-center gap-3 border pointer-events-auto bg-white dark:bg-[#0D2E1D] text-[#133C27] dark:text-[#C59A2C] border-[#E8E2D6] dark:border-[#C59A2C]/20"
            >
              <CheckCircle size={18} className="text-[#C59A2C]" />
              <span className="text-xs font-bold flex-1 leading-snug">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. METRICS GRID & QUICK ACTIONS */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Metric Cards Grid */}
        <LeadCards
          summaryKPIs={summaryKPIs}
          rmWorkloads={rmWorkloads}
          unassignedSources={unassignedSources}
          followupBreakdown={followupBreakdown}
        />

        {/* Right Side Column (Create button + Quick Actions) */}
        <div className="w-full lg:w-[260px] flex flex-col gap-3.5 shrink-0 self-stretch justify-between">
          {/* Create Button */}
          <button
            onClick={handleOpenCreate}
            className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-[#133C27] hover:bg-[#184B31] text-white py-3.5 text-xs font-black transition-all shadow-[0_4px_12px_rgba(19,60,39,0.2)] active:scale-[0.98] select-none cursor-pointer"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Create Lead</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C59A2C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C59A2C] flex items-center justify-center text-[7px] text-white">✨</span>
            </span>
          </button>

          {/* Card 6: Quick Actions Panel */}
          <div className="bg-white dark:bg-[#0D2E1D] p-5 rounded-2xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between flex-1">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-extrabold text-brand-text dark:text-white">Quick Actions</span>
              <MoreVertical size={14} className="text-gray-400 cursor-pointer" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleImportLeads}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-black gap-1.5 transition-all select-none cursor-pointer"
              >
                <Upload size={14} className="stroke-[2.5]" />
                <span>Import Leads</span>
              </button>
              <button
                onClick={handleOpenTransferRM}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-purple-200 bg-purple-50/20 hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-700 dark:text-purple-300 text-[9px] font-black gap-1.5 transition-all select-none cursor-pointer"
              >
                <RefreshCw size={14} className="stroke-[2.5]" />
                <span>Transfer RM</span>
              </button>
              <button
                onClick={handleExportLeads}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-blue-200 bg-blue-50/20 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-[9px] font-black gap-1.5 transition-all select-none cursor-pointer"
              >
                <Download size={14} className="stroke-[2.5]" />
                <span>Export Leads</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 2. FILTER ROW & CREATE LEAD BUTTON */}
      <LeadFilterBar
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterSource={filterSource}
        setFilterSource={setFilterSource}
        filterRM={filterRM}
        setFilterRM={setFilterRM}
        filterBudgetRange={filterBudgetRange}
        setFilterBudgetRange={setFilterBudgetRange}
        filterScoreRange={filterScoreRange}
        setFilterScoreRange={setFilterScoreRange}
        filterCreatedDate={filterCreatedDate}
        setFilterCreatedDate={setFilterCreatedDate}
        filterFollowUpStatus={filterFollowUpStatus}
        setFilterFollowUpStatus={setFilterFollowUpStatus}
        isBulkMode={isBulkMode}
        setIsBulkMode={setIsBulkMode}
        setSelectedLeadIds={setSelectedLeadIds}
        leadStages={leadStages}
        leadSources={leadSources}
        relationshipManagers={relationshipManagers}
        handleClearFilters={handleClearFilters}
      />

      {/* 3. BULK MODE OPTIONS PANEL */}
      <BulkToolbar
        isBulkMode={isBulkMode}
        setIsBulkMode={setIsBulkMode}
        paginatedLeads={paginatedLeads}
        selectedLeadIds={selectedLeadIds}
        setSelectedLeadIds={setSelectedLeadIds}
        handleSelectAll={handleSelectAll}
        handleOpenAssignBulk={handleOpenAssignBulk}
        handleExportLeads={handleExportLeads}
        handleBulkDelete={handleBulkDelete}
      />

      {/* 4. LEADS TABLE (Exactly replicates mockup columns) */}
      <LeadTable
        isLoading={isLoading}
        processedLeads={processedLeads}
        paginatedLeads={paginatedLeads}
        isBulkMode={isBulkMode}
        selectedLeadIds={selectedLeadIds}
        rowActionsOpenId={rowActionsOpenId}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalPages={totalPages}
        handleSelectAll={handleSelectAll}
        handleSelectRow={handleSelectRow}
        handleOpenEdit={handleOpenEdit}
        handleOpenAssignSingle={handleOpenAssignSingle}
        handleDeleteLead={handleDeleteLead}
        handleClearFilters={handleClearFilters}
        handleOpenCreate={handleOpenCreate}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        setRowActionsOpenId={setRowActionsOpenId}
      />

      {/* 6. CREATE LEAD MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="bg-white dark:bg-[#0D2E1D] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary dark:text-[#C59A2C]">
                  <Plus size={18} />
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">Create New Lead</h3>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-400 dark:text-white/60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. Ramesh Krishnan"
                      className={cn(
                        "py-2 px-3 border rounded-xl text-xs bg-white dark:bg-white/5 text-[#1F1F1F] dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#C59A2C]",
                        formErrors.name ? "border-red-500" : "border-gray-200 dark:border-white/10"
                      )}
                    />
                    {formErrors.name && (
                      <span className="text-[9px] text-red-500 font-semibold">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile || ""}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      maxLength={15}
                      className={cn(
                        "py-2 px-3 border rounded-xl text-xs bg-white dark:bg-white/5 text-[#1F1F1F] dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#C59A2C]",
                        formErrors.mobile ? "border-red-500" : "border-gray-200 dark:border-white/10"
                      )}
                    />
                    {formErrors.mobile && (
                      <span className="text-[9px] text-red-500 font-semibold">{formErrors.mobile}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Secondary Mobile
                    </label>
                    <input
                      type="text"
                      name="secondaryMobile"
                      value={formData.secondaryMobile || ""}
                      onChange={handleInputChange}
                      placeholder="Optional number"
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      placeholder="customer@domain.com"
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Lead Source
                    </label>
                    <select
                      name="source"
                      value={formData.source || "Website"}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                    >
                      {leadSources.map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Budget (INR)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget || 0}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Interested Project
                    </label>
                    <select
                      name="project"
                      value={formData.project || "Vasiyam Enclave"}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                    >
                      {projectsList.map((proj) => (
                        <option key={proj} value={proj}>
                          {proj}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Assign Relationship Manager
                    </label>
                    <select
                      name="rm"
                      value={formData.rm || "Unassigned"}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                    >
                      {relationshipManagers.map((rm) => (
                        <option key={rm} value={rm}>
                          {rm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Lead Score (0 - 100)
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={formData.score || 0}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-gray-255 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateSubmit(true)}
                  className="px-4 py-2 border border-[#C59A2C] dark:border-[#C59A2C]/40 text-[#C59A2C] hover:bg-[#C59A2C]/5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save & Create Another
                </button>
                <button
                  onClick={() => handleCreateSubmit(false)}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#184B31] shadow-md shadow-primary/10 cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. EDIT LEAD MODAL */}
      <AnimatePresence>
        {isEditOpen && activeLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="bg-white dark:bg-[#0D2E1D] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary dark:text-[#C59A2C]">
                  <Edit2 size={18} />
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    Edit Lead: {activeLead.id}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-400 dark:text-white/60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-405 uppercase">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className={cn(
                        "py-2 px-3 border rounded-xl text-xs bg-white dark:bg-white/5 text-[#1F1F1F] dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#C59A2C]",
                        formErrors.name ? "border-red-500" : "border-gray-200 dark:border-white/10"
                      )}
                    />
                    {formErrors.name && (
                      <span className="text-[9px] text-red-500 font-semibold">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-405 uppercase">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile || ""}
                      onChange={handleInputChange}
                      className={cn(
                        "py-2 px-3 border rounded-xl text-xs bg-white dark:bg-white/5 text-[#1F1F1F] dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#C59A2C]",
                        formErrors.mobile ? "border-red-500" : "border-gray-200 dark:border-white/10"
                      )}
                    />
                    {formErrors.mobile && (
                      <span className="text-[9px] text-red-500 font-semibold">{formErrors.mobile}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-405 uppercase">
                      Secondary Mobile
                    </label>
                    <input
                      type="text"
                      name="secondaryMobile"
                      value={formData.secondaryMobile || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/15 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Lead Source
                    </label>
                    <select
                      name="source"
                      value={formData.source || "Website"}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                    >
                      {leadSources.map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Budget (INR)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget || 0}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Interested Project
                    </label>
                    <select
                      name="project"
                      value={formData.project || "Vasiyam Enclave"}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                    >
                      {projectsList.map((proj) => (
                        <option key={proj} value={proj}>
                          {proj}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Preferred Location
                    </label>
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation || ""}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Relationship Manager
                    </label>
                    <select
                      name="rm"
                      value={formData.rm || "Unassigned"}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                    >
                      {relationshipManagers.map((rm) => (
                        <option key={rm} value={rm}>
                          {rm}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Lead Score (0 - 100)
                    </label>
                    <input
                      type="number"
                      name="score"
                      value={formData.score || 0}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                      Current Stage Status
                    </label>
                    <select
                      name="stage"
                      value={formData.stage || "New"}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                    >
                      {leadStages.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-45 uppercase">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="py-2 px-3 border border-gray-255 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-gray-255 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#184B31] shadow-md shadow-primary/10 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. ASSIGN RELATIONSHIP MANAGER MODAL */}
      <AnimatePresence>
        {isAssignOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignOpen(false)}
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
                  <UserCheck size={18} />
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    {activeLead ? `Assign RM for Lead: ${activeLead.id}` : `Bulk Assign Relationship Manager`}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAssignOpen(false)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} className="text-gray-400 dark:text-white/60" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {activeLead
                    ? `Choose which Relationship Manager will handle the lead portfolio for ${activeLead.name}.`
                    : `Choose which Relationship Manager will handle the ${selectedLeadIds.length} selected leads.`}
                </p>

                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Select Relationship Manager
                  </label>
                  <select
                    value={bulkAssignTarget}
                    onChange={(e) => setBulkAssignTarget(e.target.value)}
                    className="py-2.5 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none cursor-pointer"
                  >
                    {relationshipManagers.map((rm) => (
                      <option key={rm} value={rm}>
                        {rm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex gap-2 justify-end">
                <button
                  onClick={() => setIsAssignOpen(false)}
                  className="px-4 py-2 border border-gray-255 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-305 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignSubmit}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#184B31] shadow-md shadow-primary/10 cursor-pointer"
                >
                  Assign Manager
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. TRANSFER RELATIONSHIP MANAGER MODAL */}
      <TransferRMModal
        isOpen={isTransferRMOpen}
        onClose={() => setIsTransferRMOpen(false)}
        transferLeadName={transferLeadName}
        setTransferLeadName={setTransferLeadName}
        transferFromRM={transferFromRM}
        setTransferFromRM={setTransferFromRM}
        transferToRM={transferToRM}
        setTransferToRM={setTransferToRM}
        transferProject={transferProject}
        setTransferProject={setTransferProject}
        transferStage={transferStage}
        setTransferStage={setTransferStage}
        matchedLeadsByName={matchedLeadsByName}
        leadsToTransfer={leadsToTransfer}
        relationshipManagers={relationshipManagers}
        projectsList={projectsList}
        leadStages={leadStages}
        handleTransferSubmit={handleTransferSubmit}
      />
    </div>
  );
}
