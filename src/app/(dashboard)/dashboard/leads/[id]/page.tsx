// src/app/(dashboard)/dashboard/leads/[id]/page.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Clock,
  Info,
  History,
  TrendingUp,
  MessageSquare,
  FileText,
  Lock,
  Plus,
  ArrowRight,
  Shield,
  Upload,
  UserCheck,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  FilePlus,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Archive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FollowupAnalytics } from "@/components/leads/detail/FollowupAnalytics";
import { ActiveFollowupCard } from "@/components/leads/detail/ActiveFollowupCard";
import { FollowupHistoryLog } from "@/components/leads/detail/FollowupHistoryLog";
import { ScheduleFollowupModal } from "@/components/leads/detail/ScheduleFollowupModal";
import { CompleteFollowupModal } from "@/components/leads/detail/CompleteFollowupModal";
import { RescheduleFollowupModal } from "@/components/leads/detail/RescheduleFollowupModal";
import {
  getStoredLeads,
  getStoredLeadDetails,
  initialMockLeads,
  addLeadComment,
  scheduleFollowupAction,
  completeFollowupAction,
  cancelFollowupAction,
  rescheduleFollowupAction,
  syncFollowupStatuses,
  addLeadCounterOffer,
  approveLeadDiscount,
  finalizeLeadNegotiation,
  uploadLeadDocument,
  addLeadPrivateNote,
  changeLeadRMStore,
  changeLeadStageStore,
  logLeadActivity,
  Lead
} from "@/lib/leadsStore";
import { LeadDetails } from "@/mock/leadDetails";

// Mock RM and project options for selector modals
const relationshipManagers = ["Arun Kumar", "Meera Nair", "Divya Sharma", "Suresh Pillai", "Unassigned"];
const leadStages = ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Booked", "Lost"] as const;

const getActivityIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("created")) return { icon: Plus, bg: "bg-blue-600 text-white border-blue-200" };
  if (t.includes("assigned") || t.includes("reassigned") || t.includes("rm")) return { icon: UserCheck, bg: "bg-amber-500 text-white border-amber-250" };
  if (t.includes("status") || t.includes("stage")) return { icon: RefreshCw, bg: "bg-[#133C27] text-white border-primary-muted" };
  if (t.includes("follow-up") || t.includes("followup") || t.includes("call") || t.includes("whatsapp") || t.includes("email") || t.includes("meeting") || t.includes("visit")) {
    return { icon: Calendar, bg: "bg-emerald-600 text-white border-emerald-200" };
  }
  if (t.includes("comment") || t.includes("note")) return { icon: MessageSquare, bg: "bg-purple-600 text-white border-purple-200" };
  if (t.includes("negotiation") || t.includes("price") || t.includes("discount") || t.includes("offer")) return { icon: DollarSign, bg: "bg-orange-500 text-white border-orange-200" };
  if (t.includes("document") || t.includes("upload") || t.includes("file")) return { icon: FileText, bg: "bg-teal-600 text-white border-teal-200" };
  return { icon: Info, bg: "bg-gray-500 text-white border-gray-200" };
};

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  // Leads state
  const [basicLead, setBasicLead] = useState<Lead | null>(null);
  const [details, setDetails] = useState<LeadDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"timeline" | "followups" | "conversations" | "negotiation" | "documents" | "auditlog">("timeline");
  const [leftActiveTab, setLeftActiveTab] = useState<"info" | "system">("info");

  const leadScoreFactors = useMemo(() => {
    if (!basicLead) return [];
    if (basicLead.id === "LD-2415") {
      return [
        { label: "Budget confirmed (₹75L)", positive: true },
        { label: "Vastu compliant east-facing mandatory", positive: true },
        { label: "Initial call verification complete", positive: true },
        { label: "Objection: Wants registration fee waived", positive: false }
      ];
    }
    if (basicLead.id === "LD-2414") {
      return [
        { label: "Responded to Facebook Ad", positive: true },
        { label: "Requested pricing catalog", positive: true },
        { label: "WhatsApp brochure shared", positive: true },
        { label: "Waiting for spouse feedback", positive: false }
      ];
    }
    if (basicLead.id === "LD-2413") {
      return [
        { label: "Financing checked & pre-approved", positive: true },
        { label: "Criteria matches Vasiyam Meadows", positive: true },
        { label: "Next followup is critical", positive: true }
      ];
    }
    const factors = [];
    if (basicLead.score >= 80) {
      factors.push({ label: "High budget match", positive: true });
      factors.push({ label: "Frequent communications", positive: true });
      factors.push({ label: "Requirements fully logged", positive: true });
    } else if (basicLead.score >= 60) {
      factors.push({ label: "Requirements logged", positive: true });
      factors.push({ label: "Interested in active project", positive: true });
      factors.push({ label: "Moderate responsiveness", positive: true });
    } else {
      factors.push({ label: "Cold interest pattern", positive: false });
      factors.push({ label: "Minimal communication logs", positive: false });
    }
    return factors;
  }, [basicLead]);
  
  // Dialog / Edit states
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [reassignRM, setReassignRM] = useState("Unassigned");
  const [reassignAuthor, setReassignAuthor] = useState("Admin Manager");

  const [isStageOpen, setIsStageOpen] = useState(false);
  const [newStage, setNewStage] = useState<typeof leadStages[number]>("New");
  const [stageReason, setStageReason] = useState("");
  const [stageAuthor, setStageAuthor] = useState("Arun Kumar");

  // Interaction Forms State
  const [commentContent, setCommentContent] = useState("");
  const [commentType, setCommentType] = useState<"Internal" | "RM Note" | "Manager Note" | "Conversation Summary">("RM Note");
  const [commentAuthor, setCommentAuthor] = useState("Arun Kumar");

  // Modal togglers
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedFollowupId, setSelectedFollowupId] = useState<string | null>(null);

  const activeFollowup = useMemo(() => {
    if (!details || !details.followupHistory) return null;
    const pending = details.followupHistory.filter(f =>
      ["Scheduled", "Upcoming", "Due Today", "Overdue"].includes(f.status)
    );
    if (pending.length === 0) return null;
    return [...pending].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())[0];
  }, [details]);

  const [negotiationType, setNegotiationType] = useState<"offer" | "discount" | "finalize">("offer");
  const [negAmount, setNegAmount] = useState("");
  const [negOfferedBy, setNegOfferedBy] = useState<"RM" | "Customer" | "Manager">("Customer");
  const [negRemark, setNegRemark] = useState("");
  const [negApprovedBy, setNegApprovedBy] = useState("Manager Meera");
  const [negStatus, setNegStatus] = useState<"Agreed" | "Rejected">("Agreed");

  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<LeadDetails["documents"][0]["type"]>("Brochure");
  const [docSize, setDocSize] = useState("1.5 MB");
  const [docUploadedBy, setDocUploadedBy] = useState("Arun Kumar");

  const [privateNoteContent, setPrivateNoteContent] = useState("");
  const [privateNoteAuthor, setPrivateNoteAuthor] = useState("Arun Kumar");

  const sortedActivities = useMemo(() => {
    if (!details || !details.activities) return [];
    return [...details.activities].sort((a, b) => {
      const parseDate = (dStr: string) => {
        let clean = dStr.trim();
        return new Date(clean).getTime() || 0;
      };
      return parseDate(b.date) - parseDate(a.date);
    });
  }, [details]);

  // Load datasets on mount & refresh
  useEffect(() => {
    if (!leadId) return;
    const leadsList = getStoredLeads(initialMockLeads);
    const foundBasic = leadsList.find((l) => l.id === leadId) || null;
    setBasicLead(foundBasic);
    
    if (foundBasic) {
      // Sync date based statuses on mount
      syncFollowupStatuses(leadId);
      const foundDetails = getStoredLeadDetails(leadId, foundBasic);
      setDetails(foundDetails);
      if (foundBasic.rm) {
        setReassignRM(foundBasic.rm);
      }
      setNewStage(foundBasic.stage);
    }
  }, [leadId]);

  // Refresh helper
  const reloadData = () => {
    if (!leadId) return;
    const leadsList = getStoredLeads(initialMockLeads);
    const foundBasic = leadsList.find((l) => l.id === leadId) || null;
    setBasicLead(foundBasic);
    if (foundBasic) {
      syncFollowupStatuses(leadId);
      setDetails(getStoredLeadDetails(leadId, foundBasic));
    }
  };

  if (!basicLead || !details) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle size={40} className="text-[#C9A82C] mb-4" />
        <h2 className="text-lg font-bold text-primary">Lead Not Found</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          The lead ID <strong>{leadId}</strong> does not exist in our CRM database or was deleted.
        </p>
        <button
          onClick={() => router.push("/dashboard/leads")}
          className="mt-6 flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-xs font-bold transition-all cursor-pointer"
        >
          <ChevronLeft size={14} /> Back to Directory
        </button>
      </div>
    );
  }

  // Format budget in INR (e.g. 7500000 -> 75L)
  const formatBudget = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    }
    return `${(value / 100000).toFixed(1)} L`;
  };

  const getStageIndex = (stage: string) => {
    return leadStages.indexOf(stage as any);
  };

  // Badge Styling helpers
  const getStageBadgeStyles = (stage: string) => {
    switch (stage) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-150 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
      case "Contacted":
        return "bg-amber-50 text-amber-700 border-amber-150 dark:bg-amber-950/40 dark:text-[#C2921C] dark:border-amber-900";
      case "Qualified":
        return "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
      case "Site Visit":
        return "bg-purple-50 text-purple-700 border-purple-150 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900";
      case "Negotiation":
        return "bg-red-50 text-red-700 border-red-150 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900";
      case "Booked":
      case "Won":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      case "Lost":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10";
      default:
        return "bg-gray-50 text-gray-700 border-gray-150 dark:bg-white/5 dark:text-white/60 dark:border-white/10";
    }
  };

  const getScoreCircleColor = (score: number) => {
    if (score >= 80) return "border-emerald-500 text-emerald-600 bg-emerald-50/20";
    if (score >= 60) return "border-amber-500 text-amber-600 bg-amber-50/20";
    if (score >= 40) return "border-orange-500 text-orange-600 bg-orange-50/20";
    return "border-red-500 text-red-600 bg-red-50/20";
  };

  // RM Action handlers
  const handleCall = () => {
    alert(`Initiating simulated VoIP call to ${basicLead.name} (${basicLead.mobile})...`);
    logLeadActivity(leadId, "Call Logged", `VoIP Call placed to primary contact number.`, details.auditInfo.lastModifiedBy || "RM");
    reloadData();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${basicLead.name}, this is ${basicLead.rm} from Vasiyam Homes. I wanted to share the latest updates regarding ${basicLead.project}.`);
    window.open(`https://wa.me/${basicLead.mobile.replace(/\s+/g, "")}?text=${text}`, "_blank");
    logLeadActivity(leadId, "WhatsApp Sent", `WhatsApp redirection link opened with template text.`, details.auditInfo.lastModifiedBy || "RM");
    reloadData();
  };

  const handleEmail = () => {
    window.open(`mailto:${basicLead.email}`, "_blank");
    logLeadActivity(leadId, "Email Sent", `Email client launched to send messages.`, details.auditInfo.lastModifiedBy || "RM");
    reloadData();
  };

  // Re-assignment submission
  const executeReassign = (e: React.FormEvent) => {
    e.preventDefault();
    changeLeadRMStore(leadId, reassignRM, reassignAuthor);
    setIsReassignOpen(false);
    reloadData();
  };

  // Stage change submission
  const executeStageChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageReason.trim()) {
      alert("Please provide a reason for the stage transition.");
      return;
    }
    changeLeadStageStore(leadId, newStage, stageAuthor, stageReason);
    setStageReason("");
    setIsStageOpen(false);
    reloadData();
  };

  // Interactions logs submission
  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    addLeadComment(leadId, commentContent, commentType, commentAuthor);
    setCommentContent("");
    reloadData();
  };


  // Execute Followup Cancellation
  const handleCancelFollowup = (followupId: string) => {
    if (confirm("Are you sure you want to cancel this scheduled follow-up?")) {
      cancelFollowupAction(leadId, followupId, "Super Admin");
      reloadData();
    }
  };

  const submitNegotiation = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(negAmount.replace(/[^0-9]/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please input a valid amount.");
      return;
    }

    if (negotiationType === "offer") {
      addLeadCounterOffer(leadId, {
        offeredBy: negOfferedBy,
        amount: amountNum,
        remark: negRemark,
        performedBy: negOfferedBy === "Customer" ? "Customer" : "RM"
      });
    } else if (negotiationType === "discount") {
      approveLeadDiscount(leadId, {
        amount: amountNum,
        approvedBy: negApprovedBy
      });
    } else if (negotiationType === "finalize") {
      finalizeLeadNegotiation(leadId, {
        status: negStatus,
        finalAgreedAmount: negStatus === "Agreed" ? amountNum : undefined,
        remarks: negRemark,
        performedBy: "Manager"
      });
    }

    setNegAmount("");
    setNegRemark("");
    reloadData();
  };

  const submitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      alert("Please enter a document name.");
      return;
    }
    uploadLeadDocument(leadId, {
      name: docName,
      type: docType,
      size: docSize,
      uploadedBy: docUploadedBy
    });
    setDocName("");
    reloadData();
  };

  const submitPrivateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateNoteContent.trim()) return;
    addLeadPrivateNote(leadId, privateNoteContent, privateNoteAuthor);
    setPrivateNoteContent("");
    reloadData();
  };

  const leadPriority = activeFollowup?.priority || (details?.followupHistory && details.followupHistory[0]?.priority) || "Medium";  const propertyFacing = basicLead.id === "LD-2415" ? "East" :
                         basicLead.id === "LD-2413" ? "East" : "Not Specified";
  const propertyArea = basicLead.id === "LD-2415" ? "1,420 sqft" :
                       basicLead.id === "LD-2414" ? "1,150 sqft" :
                       basicLead.id === "LD-2413" ? "1,580 sqft" : "Not Specified";
  const propertyFloor = basicLead.id === "LD-2415" ? "4 of 12" :
                        basicLead.id === "LD-2414" ? "2 of 8" :
                        basicLead.id === "LD-2413" ? "6 of 10" : "Not Specified";

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* breadcrumbs header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/dashboard/leads")}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#133C27] transition-colors font-bold cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to leads
          </button>
          <span className="text-xs text-gray-300">/</span>
          <span className="text-xs font-black text-gray-700">{basicLead.name}</span>
        </div>
      </div>

      {/* Main 3-column layout grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* COLUMN 1: Lead Profile Summary & Property Specs (Left - span 1) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Mockup Profile Card */}
          <div className="bg-[#FAF8F5] border border-[#E8E2D6] rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#C9A82C]" />
            
            {/* Avatar Circle with initials */}
            <div className="relative mt-2">
              <div className="w-24 h-24 rounded-full bg-[#0D2E1D] flex items-center justify-center text-xl font-bold text-[#C9A82C] shadow-sm">
                {basicLead.name.split(" ").map(n => n[0]).join("")}
              </div>
              {/* Overlaid Score Badge */}
              <div className={cn(
                "absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-[#FAF8F5] flex items-center justify-center text-xs font-black shadow-md",
                getScoreCircleColor(basicLead.score)
              )}>
                {basicLead.score}
              </div>
            </div>

            {/* Centered Status Badge */}
            <div className="mt-4">
              <span className="px-3 py-1 bg-[#FAF3E3] text-[#B5982C] border border-[#EBE3D0] rounded-full text-[9px] font-black uppercase tracking-wider">
                • {basicLead.stage}
              </span>
            </div>

            {/* Name */}
            <h2 className="text-xl font-extrabold text-[#1A3C2A] mt-3.5 leading-tight">{basicLead.name}</h2>
            
            {/* Lead ID */}
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
              LEAD ID - VH-{basicLead.id.replace("LD-", "")}
            </p>

            {/* Divider Line */}
            <div className="w-full border-t border-gray-200/60 my-5" />

            {/* Info Rows */}
            <div className="w-full text-left space-y-4 text-xs font-medium text-gray-600">
              
              {/* CONTACT */}
              <div className="space-y-1">
                <span className="text-[8.5px] uppercase font-black tracking-wider text-gray-400 block">Contact</span>
                <p className="font-extrabold text-[#1A3C2A]">{basicLead.mobile}</p>
                <p className="text-gray-500 font-bold break-all">{basicLead.email || "No Email Logged"}</p>
              </div>

              {/* BUDGET BRACKET */}
              <div className="space-y-0.5">
                <span className="text-[8.5px] uppercase font-black tracking-wider text-gray-400 block">Budget Bracket</span>
                <p className="text-[#133C27] font-black text-sm">
                  ₹{((basicLead.budget) / 100000).toFixed(1)} L — ₹{((basicLead.budget * 1.2) / 100000).toFixed(1)} L
                </p>
              </div>

              {/* INTEREST AREA */}
              <div className="space-y-1">
                <span className="text-[8.5px] uppercase font-black tracking-wider text-gray-400 block">Interest Area</span>
                <p className="font-extrabold text-[#1A3C2A] flex items-center gap-1">
                  <MapPin size={12} className="text-gray-400 shrink-0" />
                  <span>{details.propertyType.split(" ")[0]} · {basicLead.preferredLocation || details.city || "Thoraipakkam, Chennai"}</span>
                </p>
              </div>

              {/* TIMELINE */}
              <div className="space-y-1">
                <span className="text-[8.5px] uppercase font-black tracking-wider text-gray-400 block">Timeline</span>
                <p className="text-[#B5982C] font-extrabold flex items-center gap-1">
                  <Clock size={12} className="text-[#B5982C] shrink-0" />
                  <span>
                    {details.expectedPurchaseTimeline.includes("Immediate") ? "Immediate — within 30 days" : details.expectedPurchaseTimeline}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="w-full mt-6 space-y-2.5">
              <button
                onClick={() => setIsReassignOpen(true)}
                className="w-full py-3 bg-[#0D2E1D] hover:bg-[#184B31] text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck size={14} />
                <span>Assign relationship manager</span>
              </button>
              
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => alert(`Exporting lead profile sheet as Excel report...`)}
                  className="py-2.5 border border-[#E8E2D6] bg-white hover:bg-gray-50 text-gray-700 text-[10px] font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload size={12} className="rotate-180 text-gray-400" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => alert(`Archiving lead history data secure records cabinet...`)}
                  className="py-2.5 border border-[#E8E2D6] bg-white hover:bg-red-50 hover:text-red-700 text-gray-700 text-[10px] font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Archive size={12} className="text-gray-400" />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          </div>

          {/* Property Interest Card */}
          <div className="bg-white border border-[#E8E2D6] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider flex items-center gap-1.5">
                <FileText size={12} className="text-[#C9A82C]" />
                <span>PROPERTY INTEREST</span>
              </h4>
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-black uppercase border tracking-wider",
                basicLead.score >= 70 ? "bg-[#E8F5EC] text-emerald-800 border-emerald-350" : "bg-amber-50 text-amber-800 border-amber-300"
              )}>
                {basicLead.score >= 70 ? "HOT INTEREST" : "WARM PROSPECT"}
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-gray-400 font-black tracking-wider">PROJECT PREFERENCE</span>
                <p className="text-sm font-extrabold text-[#1a3c2a]">{basicLead.project}</p>
                <p className="text-[10px] text-gray-400 font-bold">{basicLead.preferredLocation || details.city || "Chennai"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-150">
                <div className="bg-gray-55 p-2 rounded-xl border border-gray-100">
                  <span className="text-[8px] uppercase text-gray-400 font-black block">ASKING BUDGET</span>
                  <span className="font-extrabold text-gray-750">₹{formatBudget(basicLead.budget)}</span>
                </div>
                <div className="bg-gray-55 p-2 rounded-xl border border-gray-100">
                  <span className="text-[8px] uppercase text-gray-400 font-black block">CONFIG TYPE</span>
                  <span className="font-extrabold text-gray-750">{details.propertyType}</span>
                </div>
                <div className="bg-gray-55 p-2 rounded-xl border border-gray-100">
                  <span className="text-[8px] uppercase text-gray-400 font-black block">UNIT SIZE</span>
                  <span className="font-extrabold text-gray-750">{propertyArea}</span>
                </div>
                <div className="bg-gray-55 p-2 rounded-xl border border-gray-100">
                  <span className="text-[8px] uppercase text-gray-400 font-black block">FACING ORIENT</span>
                  <span className="font-extrabold text-emerald-700">{propertyFacing} Facing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2 & 3: Workspace (Center - span 2) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* STAGE funnnel stepper */}
          <div className="bg-white border border-[#E8E2D6] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-[#1a3c2a] flex items-center gap-1.5">
                <History size={12} className="text-[#C9A82C]" />
                <span>STAGE</span>
              </h3>
              <span className="text-[9px] text-gray-400 font-bold">
                Assigned: {details.assignmentDate}
              </span>
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
              {/* Connection progress lines */}
              <div className="absolute left-10 right-10 top-[15px] h-[3px] bg-gray-100 hidden md:block rounded-full">
                <div
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                  style={{ width: `${leadStages.length > 1 ? (getStageIndex(basicLead.stage) / (leadStages.length - 1)) * 100 : 0}%` }}
                />
              </div>

              {leadStages.map((stg, index) => {
                const isCurrent = basicLead.stage === stg;
                const isPast = getStageIndex(basicLead.stage) > index && basicLead.stage !== "Lost";
                const isLostStep = basicLead.stage === "Lost" && stg === "Lost";
                
                return (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => {
                      setNewStage(stg as any);
                      setIsStageOpen(true);
                    }}
                    className="relative z-10 flex md:flex-col items-center gap-3 md:gap-0 flex-1 w-full md:w-auto hover:scale-105 transition-transform cursor-pointer focus:outline-none"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full border-4 flex items-center justify-center text-xs font-black transition-all shrink-0",
                      isCurrent ? "bg-[#133C27] border-[#C9A82C] text-white scale-110 shadow-[0_0_15px_rgba(201,168,44,0.65)] ring-4 ring-[#C9A82C]/35 animate-pulse" :
                      isLostStep ? "bg-red-50 border-red-300 text-red-700 shadow-sm" :
                      isPast ? "bg-[#E8F5EC] border-emerald-500 text-emerald-700 shadow-sm" :
                      "bg-white border-gray-200 text-gray-400"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex flex-col md:items-center">
                      <span className={cn(
                        "text-[9px] uppercase tracking-wider font-extrabold md:mt-2",
                        isCurrent ? "text-primary font-black" : "text-gray-400 font-bold"
                      )}>
                        {stg}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Workspace Tab Content */}
          <div className="bg-white border border-[#E8E2D6] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col min-h-[580px]">
            
            {/* Tabs Header switches */}
            <div className="flex border-b border-[#E8E2D6] overflow-x-auto bg-gray-50 text-xs font-bold text-gray-505 shrink-0 sticky top-0 z-10 scrollbar-none">
              {[
                { id: "timeline", label: "Timeline Feed", icon: History },
                { id: "followups", label: "Follow-up Log", icon: Calendar },
                { id: "negotiation", label: "Negotiation Hub", icon: TrendingUp },
                { id: "documents", label: "Document Vault", icon: FileText },
                { id: "auditlog", label: "Audit Ledger", icon: Shield }
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-3.5 border-b-2 font-black border-transparent whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors uppercase tracking-wider text-[9px]",
                      activeTab === tab.id
                        ? "border-primary text-primary bg-white"
                        : "text-gray-400 hover:text-gray-707"
                    )}
                  >
                    <TabIcon size={12} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab content area */}
            <div className="p-5 flex-1 overflow-y-auto">
              
              {/* Timeline feed & Log inline note */}
              {activeTab === "timeline" && (
                <div className="space-y-6">
                  
                  {/* Inline Add Note form */}
                  <form onSubmit={submitComment} className="bg-[#FBF9F4]/40 border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-primary tracking-wider">Log Communication / Note</span>
                      <div className="flex items-center gap-1 bg-white border border-[#E8E2D6] rounded p-0.5">
                        <select
                          value={commentType}
                          onChange={(e) => setCommentType(e.target.value as any)}
                          className="text-[9.5px] font-black p-0.5 bg-transparent border-none focus:outline-none cursor-pointer uppercase text-gray-550"
                        >
                          <option value="RM Note">RM Note</option>
                          <option value="Internal">Internal Note</option>
                          <option value="Manager Note">Manager Note</option>
                          <option value="Conversation Summary">Summary</option>
                        </select>
                      </div>
                    </div>
                    
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Type details of client interaction or private notes here..."
                      className="w-full text-xs font-medium p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary min-h-[56px] resize-none"
                      required
                    />

                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1 font-bold text-gray-400">
                        <span>Agent:</span>
                        <input
                          type="text"
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          className="bg-transparent border-b w-24 font-bold text-gray-655 focus:outline-none py-0.5"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#133C27] hover:bg-[#0d2e1d] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                      >
                        Log Note
                      </button>
                    </div>
                  </form>

                  <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                    <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider">Activity Feed Trail</h4>
                    <span className="text-[9px] text-gray-400 font-bold">{details.activities.length} Total Entries</span>
                  </div>

                  <div className="relative border-l border-gray-150 pl-6 ml-3 space-y-6 text-xs">
                    {sortedActivities.map((act) => {
                      const styleConfig = getActivityIcon(act.type);
                      const ActIcon = styleConfig.icon;
                      return (
                        <div key={act.id} className="relative min-h-[40px] flex flex-col justify-center">
                          <div className={cn(
                            "absolute -left-[35px] top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                            styleConfig.bg
                          )}>
                            <ActIcon size={10} />
                          </div>

                          <div className="space-y-1 pl-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <span className="font-extrabold text-[#1A3C2A] uppercase text-[8px] tracking-wider bg-gray-100 border border-gray-150 px-1.5 py-0.2 rounded w-fit">
                                {act.type}
                              </span>
                              <span className="text-gray-400 font-medium text-[9px]">{act.date}</span>
                            </div>
                            <p className="text-gray-700 font-bold text-[10.5px] mt-0.5">{act.description}</p>
                            <div className="text-[9px] text-gray-404 font-semibold flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span>Actor:</span>
                              <span className="text-gray-650 font-black">{act.performedBy}</span>
                              {act.role && (
                                <span className="text-[8px] bg-amber-50 text-amber-800 px-1 py-0.2 border border-amber-200 rounded font-black uppercase">
                                  {act.role}
                                </span>
                              )}
                              {act.relatedStage && (
                                <span className="text-[8px] bg-[#E8F5EC] text-emerald-800 px-1 py-0.2 border border-emerald-250 rounded font-black uppercase">
                                  Stage: {act.relatedStage}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Follow-up Section */}
              {activeTab === "followups" && (
                <div className="space-y-6">
                  <FollowupAnalytics followupHistory={details.followupHistory} />
                  
                  <ActiveFollowupCard
                    activeFollowup={activeFollowup}
                    leadContext={{
                      id: basicLead.id,
                      name: basicLead.name,
                      mobile: basicLead.mobile,
                      project: basicLead.project,
                      stage: basicLead.stage,
                      rm: basicLead.rm
                    }}
                    readOnly={true}
                  />

                  <FollowupHistoryLog followupHistory={details.followupHistory} currentRM={basicLead.rm} />
                </div>
              )}

              {/* Negotiation hub & Action Forms */}
              {activeTab === "negotiation" && (
                <div className="space-y-6">
                  
                  {/* Inline log negotiation offer */}
                  <form onSubmit={submitNegotiation} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-[10px] font-black uppercase text-primary tracking-wider">Log Negotiation / Offer Detail</span>
                      <div className="flex items-center gap-1 border rounded bg-white p-0.5">
                        {(["offer", "discount", "finalize"] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setNegotiationType(t)}
                            className={cn(
                              "px-2 py-0.5 rounded text-[8px] font-black uppercase transition-all cursor-pointer",
                              negotiationType === t ? "bg-[#133C27] text-white" : "text-gray-400"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[8px] font-black text-gray-455 uppercase mb-1">
                          {negotiationType === "offer" ? "Counter Offer Price (₹)" : negotiationType === "discount" ? "Discount price (₹)" : "Final settled amount (₹)"}
                        </label>
                        <input
                          type="text"
                          value={negAmount}
                          onChange={(e) => setNegAmount(e.target.value)}
                          placeholder="e.g. 7300000"
                          className="w-full font-bold p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                          required
                        />
                      </div>

                      {negotiationType === "offer" && (
                        <div>
                          <label className="block text-[8px] font-black text-[#133C27] uppercase mb-1">Offered By</label>
                          <select
                            value={negOfferedBy}
                            onChange={(e) => setNegOfferedBy(e.target.value as any)}
                            className="w-full font-bold p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
                          >
                            <option value="Customer">Customer</option>
                            <option value="RM">Relationship Manager</option>
                            <option value="Manager">Manager Approver</option>
                          </select>
                        </div>
                      )}

                      {negotiationType === "discount" && (
                        <div>
                          <label className="block text-[8px] font-black text-[#133C27] uppercase mb-1">Authorized Approver</label>
                          <input
                            type="text"
                            value={negApprovedBy}
                            onChange={(e) => setNegApprovedBy(e.target.value)}
                            className="w-full font-bold p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                            required
                          />
                        </div>
                      )}

                      {negotiationType === "finalize" && (
                        <div>
                          <label className="block text-[8px] font-black text-[#133C27] uppercase mb-1">Settlement Status</label>
                          <select
                            value={negStatus}
                            onChange={(e) => setNegStatus(e.target.value as any)}
                            className="w-full font-bold p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
                          >
                            <option value="Agreed">Agreed / Booked</option>
                            <option value="Rejected">Rejected / Lost</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div>
                        <label className="block text-[8px] font-black text-gray-455 uppercase mb-1">remarks & justifications</label>
                        <input
                          type="text"
                          value={negRemark}
                          onChange={(e) => setNegRemark(e.target.value)}
                          placeholder="Objections cleared, financing proof verified, finalized contract details..."
                          className="w-full font-medium p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#C9A82C] hover:bg-[#B8960F] text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                      >
                        Record {negotiationType}
                      </button>
                    </div>
                  </form>

                  {/* Visual statistics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-[#E8E2D6] rounded-xl bg-gray-50 text-xs font-bold text-[#1A3C2A]">
                    <div>
                      <span className="text-[8.5px] uppercase text-gray-404 font-black">Initial Quotation</span>
                      <p className="text-sm font-extrabold mt-0.5">₹{details.negotiation.initialOfferedPrice.toLocaleString("en-IN")}</p>
                    </div>
                    
                    <div>
                      <span className="text-[8.5px] uppercase text-gray-404 font-black">Customer Expected</span>
                      <p className="text-sm font-extrabold mt-0.5 text-red-655">₹{details.negotiation.customerExpectedPrice.toLocaleString("en-IN")}</p>
                    </div>

                    <div>
                      <span className="text-[8.5px] uppercase text-gray-404 font-black">Approved Discounts</span>
                      <p className="text-sm font-extrabold mt-0.5 text-emerald-705">
                        ₹{details.negotiation.approvedDiscounts.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <span className="text-[8.5px] uppercase text-gray-404 font-black">Negotiation Status</span>
                      <p className="text-sm font-black mt-0.5 text-amber-600 uppercase tracking-wide">
                        {details.negotiation.status}
                      </p>
                    </div>
                  </div>

                  {details.negotiation.finalAgreedAmount && (
                    <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-4 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[8.5px] uppercase text-emerald-707 font-black">Final agreed settled amount</span>
                        <p className="text-base font-black text-emerald-800">
                          ₹{details.negotiation.finalAgreedAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      {details.negotiation.remarks && (
                        <div className="text-[10px] text-emerald-755 max-w-sm text-right italic font-medium">
                          "{details.negotiation.remarks}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Logs of offers & approvals */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-[#1A3C2A] border-b pb-1 tracking-wider">Negotiation Timeline Log</h4>
                    
                    {details.negotiation.counterOffers.length === 0 && details.negotiation.approvedDiscounts.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No counter-offers logged yet.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {/* Approved Discounts */}
                        {details.negotiation.approvedDiscounts.map((ad, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2.5 border border-emerald-100 rounded-lg bg-[#E8F5EC]/20">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-emerald-800 text-[10px]">DISCOUNT APPROVED</span>
                              <span className="text-[9px] text-gray-404">{ad.date}</span>
                            </div>
                            <div className="font-extrabold text-emerald-707 text-right">
                              - ₹{ad.amount.toLocaleString("en-IN")}
                              <span className="text-[8px] text-gray-404 block font-normal">By {ad.approvedBy}</span>
                            </div>
                          </div>
                        ))}

                        {/* Counter Offers */}
                        {details.negotiation.counterOffers.map((co, idx) => (
                          <div key={idx} className="p-2.5 border border-[#E8E2D6] rounded-lg bg-white space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-semibold text-gray-400">
                              <span className="font-extrabold text-[#1A3C2A] uppercase">Counter Offer by {co.offeredBy}</span>
                              <span>{co.date}</span>
                            </div>
                            <div className="flex justify-between items-end">
                              {co.remark ? (
                                <span className="italic text-gray-500 font-medium text-[9.5px]">"{co.remark}"</span>
                              ) : (
                                <span className="text-gray-300">No context remarks</span>
                              )}
                              <span className="font-extrabold text-gray-705 text-xs">
                                ₹{co.amount.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Document vault vault grid */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  
                  {/* Inline Document Upload Simulator */}
                  <form onSubmit={submitDocument} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-primary tracking-wider block">Simulate Document Vault Upload</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[8px] font-black text-gray-455 uppercase mb-1">Document Title</label>
                        <input
                          type="text"
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          placeholder="e.g. Aadhar_Card.pdf"
                          className="w-full font-bold p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[8px] font-black text-gray-455 uppercase mb-1">Document Category</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value as any)}
                          className="w-full font-bold p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer text-gray-655"
                        >
                          <option value="Quotation">Quotation Sheet</option>
                          <option value="Brochure">Brochure Catalog</option>
                          <option value="Agreement">Contract Agreement</option>
                          <option value="Customer Document">KYC Document</option>
                          <option value="Site Visit Photo">Site Visit Media</option>
                          <option value="Other">Other Miscellaneous</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8px] font-black text-gray-455 uppercase mb-1">Uploader Author</label>
                        <input
                          type="text"
                          value={docUploadedBy}
                          onChange={(e) => setDocUploadedBy(e.target.value)}
                          className="w-full font-bold p-1.5 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#133C27] hover:bg-[#0d2e1d] text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1"
                      >
                        <Upload size={10} /> Upload to Vault
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-[#1A3C2A] border-b pb-1 tracking-wider">File Repository Document List</h4>
                    
                    {details.documents.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No files uploaded yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {details.documents.map((d) => (
                          <div key={d.id} className="border border-[#E8E2D6] rounded-xl p-3 bg-white hover:shadow-sm transition-shadow flex items-start justify-between gap-3 text-xs">
                            <div className="space-y-1 min-w-0">
                              <span className="font-extrabold text-[#1A3C2A] block truncate">{d.name}</span>
                              <div className="flex flex-wrap gap-1.5 text-[8.5px] font-bold">
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-550 uppercase tracking-tight">{d.type}</span>
                                <span className="text-gray-400 py-0.5 font-medium">{d.size}</span>
                              </div>
                              <div className="text-[8.5px] text-gray-404 font-semibold pt-1">
                                <span>Uploaded on {d.uploadDate.split(" ")[0]} by {d.uploadedBy}</span>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => alert(`Opening file simulation: ${d.name}`)}
                              className="p-1.5 hover:bg-gray-50 rounded border text-[#C9A82C] hover:text-primary transition-colors cursor-pointer"
                              title="Download Document"
                            >
                              <ExternalLink size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audit logs ledger */}
              {activeTab === "auditlog" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2 border-[#E8E2D6]">
                    <h4 className="text-[10px] font-black uppercase text-[#1A3C2A] tracking-wider flex items-center gap-1.5">
                      <Shield size={12} className="text-[#C9A82C]" />
                      <span>Chronological Operations Registry Logs</span>
                    </h4>
                    <span className="text-[9px] text-gray-400 font-bold">{(details.systemAuditLogs || []).length} Actions logged</span>
                  </div>

                  {(!details.systemAuditLogs || details.systemAuditLogs.length === 0) ? (
                    <p className="text-xs text-gray-400 italic">No operational logs recorded.</p>
                  ) : (
                    <div className="space-y-3">
                      {details.systemAuditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="border border-[#E8E2D6] rounded-xl p-3.5 bg-white hover:shadow-sm transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 text-[9px]">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-black text-[8px] uppercase px-2 py-0.5 rounded border tracking-wide",
                                log.action === "Lead Created" ? "bg-blue-50 text-blue-750 border-blue-200" :
                                log.action === "Stage Changed" ? "bg-purple-50 text-purple-750 border-purple-200" :
                                log.action === "Relationship Manager Transfer" ? "bg-amber-50 text-amber-750 border-amber-200" :
                                "bg-gray-50 text-gray-750 border-gray-200"
                              )}>
                                {log.action}
                              </span>
                              <span className="text-gray-400 font-mono">{log.id}</span>
                            </div>

                            <div className="flex items-center gap-2 font-bold text-gray-404">
                              <span>{log.date}</span>
                              <span>•</span>
                              <span>{log.time}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[11px] font-mono">
                            <div>
                              <span className="text-[8.5px] uppercase text-gray-404 font-black font-sans block mb-1">Previous Registry State</span>
                              <div className="p-1.5 border border-[#E8E2D6] rounded bg-gray-50/50 text-gray-655 min-h-[30px] flex items-center">
                                {log.previousValue || "N/A"}
                              </div>
                            </div>

                            <div>
                              <span className="text-[8.5px] uppercase text-gray-404 font-black font-sans block mb-1">New Registry State</span>
                              <div className="p-1.5 border border-emerald-100 rounded bg-emerald-50/20 text-[#1A3C2A] font-black min-h-[30px] flex items-center">
                                {log.newValue}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between pt-1.5 border-t border-gray-100 text-[9px] text-gray-450">
                            <div>
                              <span>Actor: </span>
                              <span className="font-extrabold text-gray-700">{log.user}</span>
                              <span className="ml-1 text-[8px] font-black bg-gray-100 text-gray-500 border rounded px-1 uppercase tracking-tight">
                                {log.role}
                              </span>
                            </div>

                            {log.ipAddress && (
                              <span className="font-mono text-gray-450">IP Node: {log.ipAddress}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMN 4: Next Actions (Right - span 1) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Next Best Action recomendations card */}
          <div className="bg-[#133C27] text-white border border-[#133C27] rounded-2xl p-5 shadow-md space-y-4 relative overflow-hidden">
            {/* Elegant overlay background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C9A82C]/20 to-transparent rounded-full -mr-8 -mt-8" />
            
            <h4 className="text-[10px] font-black uppercase tracking-wider text-[#C9A82C] flex items-center gap-1.5">
              <CheckCircle size={12} />
              <span>RECOMMENDED ACTION</span>
            </h4>
            
            <div className="space-y-1.5 relative z-10">
              {activeFollowup ? (
                <>
                  <p className="text-xs font-black leading-snug">
                    Confirm {activeFollowup.type} and log summary outcomes for stage progression.
                  </p>
                  <p className="text-[10px] text-white/70 font-semibold leading-relaxed">
                    Based on recent communications, requirements check indicates conversion likelihood is high.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFollowupId(activeFollowup.id);
                      setIsCompleteOpen(true);
                    }}
                    className="w-full mt-3 py-2 bg-[#C9A82C] hover:bg-[#B8960F] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Execute Action</span>
                    <ArrowRight size={10} />
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs font-black leading-snug">
                    Schedule next follow-up and define criteria match options.
                  </p>
                  <p className="text-[10px] text-white/70 font-semibold leading-relaxed">
                    No active follow-ups scheduled. Establish contact to keep the sales funnel moving forward.
                  </p>
                  <button
                    onClick={() => setIsScheduleOpen(true)}
                    className="w-full mt-3 py-2 bg-[#C9A82C] hover:bg-[#B8960F] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Plus size={10} />
                    <span>Schedule Task</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ======================= MODAL BOXES DIALOGS FORMS ======================= */}
      {/* ========================================================================= */}

      {/* A. REASSIGN RM DIALOG BOX */}
      {isReassignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsReassignOpen(false)}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
          />
          <div className="relative bg-white border border-[#E8E2D6] rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden z-10 text-left">
            <h3 className="text-base font-black text-[#1A3C2A] uppercase tracking-wider mb-4">Reassign Relationship Manager</h3>
            <form onSubmit={executeReassign} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Target RM</label>
                <select
                  value={reassignRM}
                  onChange={(e) => setReassignRM(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
                >
                  {relationshipManagers.map((rm) => (
                    <option key={rm} value={rm}>{rm}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Authorized By</label>
                <input
                  type="text"
                  required
                  value={reassignAuthor}
                  onChange={(e) => setReassignAuthor(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="Approver"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t mt-4 text-xs">
                <button
                  type="button"
                  onClick={() => setIsReassignOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-500 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C9A82C] text-white hover:bg-[#B8960F] font-bold rounded-lg cursor-pointer"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. STAGE FUNNEL CHANGE DIALOG BOX */}
      {isStageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsStageOpen(false)}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
          />
          <div className="relative bg-white border border-[#E8E2D6] rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden z-10 text-left">
            <h3 className="text-base font-black text-[#1A3C2A] uppercase tracking-wider mb-4">Advance Funnel Sales Stage</h3>
            <form onSubmit={executeStageChange} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Target Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
                  >
                    {leadStages.map((stg) => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Modified By</label>
                  <input
                    type="text"
                    required
                    value={stageAuthor}
                    onChange={(e) => setStageAuthor(e.target.value)}
                    className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                    placeholder="Approver"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 font-bold">Reason for Stage movement</label>
                <textarea
                  required
                  value={stageReason}
                  onChange={(e) => setStageReason(e.target.value)}
                  rows={3}
                  className="w-full text-xs font-medium p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Detail why customer transitioned stages (e.g. Budget pre-cleared, site visit booked for block B, negotiation closed...)"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t mt-4 text-xs">
                <button
                  type="button"
                  onClick={() => setIsStageOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-500 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#133C27] hover:bg-primary-dark text-white font-bold rounded-lg cursor-pointer"
                >
                  Update Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. SCHEDULE FOLLOWUP DIALOG */}
      <ScheduleFollowupModal
        leadId={leadId}
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultRM={basicLead?.rm || ""}
        onSuccess={reloadData}
      />

      {/* 2. LOG COMPLETION DIALOG */}
      <CompleteFollowupModal
        leadId={leadId}
        followupId={selectedFollowupId}
        isOpen={isCompleteOpen}
        onClose={() => setIsCompleteOpen(false)}
        defaultRM={basicLead?.rm || ""}
        defaultStage={basicLead?.stage || ""}
        defaultBudget={basicLead?.budget || 0}
        onSuccess={reloadData}
        onOpenScheduleNext={() => setIsScheduleOpen(true)}
      />

      {/* 3. RESCHEDULE FOLLOWUP DIALOG */}
      <RescheduleFollowupModal
        leadId={leadId}
        followupId={selectedFollowupId}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onSuccess={reloadData}
        initialDate={details?.followupHistory?.find(f => f.id === selectedFollowupId)?.scheduledDate || ""}
        initialPriority={details?.followupHistory?.find(f => f.id === selectedFollowupId)?.priority || "Medium"}
        defaultRM={basicLead?.rm || ""}
      />
    </div>
  );
}
