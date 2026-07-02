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

  const [chatMessageContent, setChatMessageContent] = useState("");
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

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

  const submitInternalChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageContent.trim()) return;
    addLeadComment(leadId, chatMessageContent, "Manager Note", "Admin Manager");
    setChatMessageContent("");
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

  const scoreProgressRadius = 42;
  const scoreProgressCircumference = 2 * Math.PI * scoreProgressRadius;
  const scoreProgressStrokeOffset = scoreProgressCircumference - (basicLead.score / 100) * scoreProgressCircumference;
  const scoreColor = basicLead.score >= 80 ? "#10B981" : basicLead.score >= 60 ? "#F59E0B" : "#EF4444";

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
            
            {/* Avatar Circle with score progress ring around it */}
            <div className="relative mt-2 w-24 h-24 flex items-center justify-center">
              {/* SVG Score Ring */}
              <svg className="absolute inset-0 w-24 h-24 transform -rotate-90">
                {/* Background track */}
                <circle
                  cx="48"
                  cy="48"
                  r={scoreProgressRadius}
                  stroke="#E8E2D6"
                  strokeWidth="3"
                  fill="transparent"
                />
                {/* Active progress */}
                <circle
                  cx="48"
                  cy="48"
                  r={scoreProgressRadius}
                  stroke={scoreColor}
                  strokeWidth="4"
                  strokeDasharray={scoreProgressCircumference}
                  strokeDashoffset={scoreProgressStrokeOffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Inner Avatar */}
              <div className="relative w-[76px] h-[76px] rounded-full bg-[#0D2E1D] flex items-center justify-center text-lg font-bold text-[#C9A82C] shadow-inner select-none">
                {basicLead.name.split(" ").map(n => n[0]).join("")}
              </div>
              
              {/* Numerical Score overlay badge at bottom right */}
              <div className={cn(
                "absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-[#FAF8F5] flex items-center justify-center text-[10px] font-black shadow-md",
                getScoreCircleColor(basicLead.score)
              )}>
                {basicLead.score}
              </div>
            </div>

            {/* Centered Status & Source Badge */}
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <span className="px-3 py-1 bg-[#FAF3E3] text-[#B5982C] border border-[#EBE3D0] rounded-full text-[9px] font-black uppercase tracking-wider">
                • {basicLead.stage}
              </span>
              <span className="px-3 py-1 bg-white border border-[#E8E2D6] text-gray-500 rounded-full text-[9px] font-black uppercase tracking-wider">
                {basicLead.source}
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
              {(!basicLead.rm || basicLead.rm === "Unassigned") && (
                <button
                  onClick={() => setIsReassignOpen(true)}
                  className="w-full py-3 bg-[#0D2E1D] hover:bg-[#184B31] text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck size={14} />
                  <span>Assign relationship manager</span>
                </button>
              )}
              <div className="w-full">
                <button
                  onClick={() => alert(`Exporting lead profile sheet as Excel report...`)}
                  className="w-full py-2.5 border border-[#E8E2D6] bg-white hover:bg-gray-55 text-gray-700 text-[10px] font-black rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload size={12} className="rotate-180 text-gray-400" />
                  <span>Export Profile Sheet</span>
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

            {/* Property Rendering Image */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-150 shadow-inner bg-gray-50">
              <img
                src="/property_preview.png"
                alt="Property Preference rendering preview Vasiyam Homes"
                className="w-full h-full object-cover"
              />
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
              
              {/* Timeline feed */}
              {activeTab === "timeline" && (() => {
                const getActivityComments = (act: any) => {
                  const matched = (details?.comments || []).filter(c => {
                    if (act.id === "A-3" && c.id === "C-1") return true;
                    return false;
                  });
                  if (matched.length > 0) return matched;
                  if (act.id === "A-1") {
                    return [{
                      id: "fallback-A1",
                      author: "System Integration",
                      date: act.date,
                      content: "Lead verified and captured successfully from website campaign landing page. Vasiyam Enclave 3BHK interest match identified."
                    }];
                  }
                  if (act.id === "A-2") {
                    return [{
                      id: "fallback-A2",
                      author: "Admin Manager",
                      date: act.date,
                      content: "Lead assigned to Relationship Manager Arun Kumar based on Chennai region allocation rules. Contact SLA set to 2 hours."
                    }];
                  }
                  return [];
                };
                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                      <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider">Activity Feed Trail</h4>
                      <span className="text-[9px] text-gray-400 font-bold">{details.activities.length} Total Entries</span>
                    </div>

                    <div className="relative border-l border-gray-150 pl-6 ml-3 space-y-6 text-xs">
                      {sortedActivities.map((act) => {
                        const styleConfig = getActivityIcon(act.type);
                        const ActIcon = styleConfig.icon;
                        return (
                          <div
                            key={act.id}
                            onClick={() => setSelectedActivityId(selectedActivityId === act.id ? null : act.id)}
                            className="relative min-h-[40px] flex flex-col justify-center cursor-pointer hover:bg-[#FAF8F5]/80 p-2.5 -ml-2.5 rounded-xl transition-all border border-transparent hover:border-gray-150 group"
                          >
                            <div className={cn(
                              "absolute -left-[37px] top-2.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
                              styleConfig.bg
                            )}>
                              <ActIcon size={10} />
                            </div>

                            <div className="space-y-1 pl-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="font-extrabold text-[#1A3C2A] uppercase text-[8px] tracking-wider bg-gray-100 border border-gray-150 px-1.5 py-0.2 rounded w-fit group-hover:bg-[#133C27] group-hover:text-white transition-colors">
                                  {act.type}
                                </span>
                                <span className="text-gray-400 font-medium text-[9px]">{act.date}</span>
                              </div>
                              <p className="text-gray-700 font-bold text-[10.5px] mt-0.5">{act.description}</p>
                              <div className="text-[9px] text-gray-404 font-semibold flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span>Actor:</span>
                                <span className="text-gray-650 font-black">{act.performedBy}</span>
                                {act.role && (
                                  <span className="text-[8px] bg-amber-50 text-amber-800 px-1 py-0.2 border border-amber-250 rounded font-black uppercase">
                                    {act.role}
                                  </span>
                                )}
                                {act.relatedStage && (
                                  <span className="text-[8px] bg-[#E8F5EC] text-emerald-800 px-1 py-0.2 border border-emerald-250 rounded font-black uppercase">
                                    Stage: {act.relatedStage}
                                  </span>
                                )}
                              </div>

                              {selectedActivityId === act.id && (
                                <div 
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-3 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-2 relative animate-in fade-in slide-in-from-top-1 duration-150 shadow-sm"
                                >
                                  <div className="absolute -top-1 left-4 w-2 h-2 bg-amber-50 border-t border-l border-amber-200/60 rotate-45" />
                                  <div className="flex items-center justify-between text-[8px] font-black uppercase text-[#B5982C]">
                                    <span>RM Notes / Remarks Log</span>
                                    <span className="text-[7.5px] font-black bg-amber-100 text-amber-850 px-1 rounded">Click to close</span>
                                  </div>
                                  
                                  {getActivityComments(act).length === 0 ? (
                                    <p className="text-gray-500 italic text-[10px] font-semibold">
                                      No detailed RM comments logged for this entry.
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {getActivityComments(act).map((c) => (
                                        <div key={c.id} className="text-[10px] space-y-1 font-semibold text-gray-700">
                                          <div className="flex items-center gap-1.5 text-[8.5px] text-gray-404 font-bold">
                                            <span className="font-extrabold text-[#1A3C2A]">{c.author}</span>
                                            <span>•</span>
                                            <span>{c.date}</span>
                                          </div>
                                          <p className="leading-relaxed font-bold bg-white border border-amber-100/50 p-2.5 rounded-lg text-[10.5px] text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                                            {c.content}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Follow-up Section */}
              {activeTab === "followups" && (() => {
                const followups = details.followupHistory || [];
                const totalFollowups = followups.length;
                const pendingFollowups = followups.filter(f => ["Scheduled", "Upcoming", "Due Today"].includes(f.status)).length;
                const overdueFollowups = followups.filter(f => f.status === "Overdue").length;
                
                const nextScheduled = activeFollowup;

                // Alerts calculation
                const alertsList = [];
                if (overdueFollowups > 0) {
                  alertsList.push(`${overdueFollowups} follow-up${overdueFollowups > 1 ? 's are' : ' is'} currently overdue. Immediate contact required.`);
                }
                
                const completedFollowups = followups.filter(f => f.status === "Completed");
                if (completedFollowups.length > 0) {
                  const latest = [...completedFollowups].sort((a, b) => new Date(b.completedDate || b.scheduledDate).getTime() - new Date(a.completedDate || a.scheduledDate).getTime())[0];
                  const diffMs = Math.abs(new Date().getTime() - new Date(latest.completedDate || latest.scheduledDate).getTime());
                  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  if (diffDays >= 5) {
                    alertsList.push(`Customer has not been contacted for ${diffDays} days.`);
                  }
                } else {
                  alertsList.push("Customer has not been contacted yet.");
                }
                
                const siteVisits = followups.filter(f => f.type === "Site Visit" && ["Scheduled", "Upcoming", "Due Today"].includes(f.status));
                if (siteVisits.length === 0) {
                  alertsList.push("Site visit not yet scheduled.");
                }

                const latestStageChange = details.stageHistory && details.stageHistory[0];
                if (latestStageChange) {
                  const diffMs = Math.abs(new Date().getTime() - new Date(latestStageChange.date).getTime());
                  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                  if (diffDays >= 5) {
                    alertsList.push(`Lead has stayed in ${basicLead.stage} stage for ${diffDays} days.`);
                  }
                }

                return (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#FAF8F5] border border-[#E8E2D6] p-4 rounded-xl flex flex-col justify-between shadow-sm">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">TOTAL FOLLOW-UPS</span>
                        <span className="text-lg font-extrabold text-[#1A3C2A] mt-1">{totalFollowups}</span>
                      </div>

                      <div className="bg-[#FAF8F5] border border-[#E8E2D6] p-4 rounded-xl flex flex-col justify-between shadow-sm">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">PENDING TASKS</span>
                        <span className="text-lg font-extrabold text-blue-705 mt-1">{pendingFollowups}</span>
                      </div>

                      <div className={cn(
                        "border p-4 rounded-xl flex flex-col justify-between shadow-sm",
                        overdueFollowups > 0 
                          ? "bg-red-50 border-red-200 text-red-900" 
                          : "bg-[#FAF8F5] border-[#E8E2D6]"
                      )}>
                        <span className="text-[9px] font-black uppercase tracking-wider opacity-60">OVERDUE TASKS</span>
                        <span className={cn(
                          "text-lg font-extrabold mt-1",
                          overdueFollowups > 0 ? "text-red-700" : "text-[#1A3C2A]"
                        )}>{overdueFollowups}</span>
                      </div>

                      <div className="bg-[#FAF8F5] border border-[#E8E2D6] p-4 rounded-xl flex flex-col justify-between shadow-sm">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">NEXT SCHEDULED</span>
                        <span className="text-[10px] font-black text-amber-600 truncate mt-1">
                          {nextScheduled ? nextScheduled.scheduledDate : "None Scheduled"}
                        </span>
                      </div>
                    </div>

                    {/* Section 2: Priority Card */}
                    <div className="bg-white border border-[#E8E2D6] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                      <div className="flex items-center justify-between border-b pb-2 mb-4">
                        <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider flex items-center gap-1.5">
                          <CheckCircle size={12} className="text-[#C9A82C]" />
                          <span>UPCOMING SCHEDULED ACTION</span>
                        </h4>
                        {nextScheduled && (
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase border tracking-wider",
                            nextScheduled.priority === "Critical" || nextScheduled.priority === "High"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          )}>
                            {nextScheduled.priority} PRIORITY
                          </span>
                        )}
                      </div>

                      {nextScheduled ? (
                        <div className="space-y-4 text-xs font-semibold text-gray-700">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <span className="text-[8.5px] uppercase text-gray-400 font-black block">Date & Time</span>
                              <span className="text-[#1A3C2A] font-extrabold">{nextScheduled.scheduledDate}</span>
                            </div>
                            <div>
                              <span className="text-[8.5px] uppercase text-gray-400 font-black block">Action Type</span>
                              <span className="text-emerald-700 font-extrabold flex items-center gap-1 mt-0.5">
                                {nextScheduled.type === "Call" ? "📞 Call" :
                                 nextScheduled.type === "WhatsApp" ? "💬 WhatsApp" :
                                 nextScheduled.type === "Site Visit" ? "🏗️ Site Visit" :
                                 nextScheduled.type === "Meeting" ? "🤝 Meeting" : "✉️ Email"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8.5px] uppercase text-gray-400 font-black block">Assigned Advisor</span>
                              <span className="text-[#1A3C2A] font-extrabold">{nextScheduled.conductedBy || basicLead.rm}</span>
                            </div>
                            <div>
                              <span className="text-[8.5px] uppercase text-gray-400 font-black block">Reminder Status</span>
                              <span className="text-[#B5982C] font-extrabold flex items-center gap-1">
                                <Clock size={10} />
                                <span>{nextScheduled.reminderTime ? `Remind ${nextScheduled.reminderTime}` : "No Reminder Set"}</span>
                              </span>
                            </div>
                          </div>

                          {nextScheduled.purpose && (
                            <div className="bg-[#FAF8F5] p-3 rounded-lg border border-gray-150">
                              <span className="text-[8px] uppercase text-gray-400 font-black block mb-1">TASK OBJECTIVE / NOTES</span>
                              <p className="text-[11px] text-gray-650 leading-relaxed font-bold">
                                {nextScheduled.purpose} {nextScheduled.notes && `— ${nextScheduled.notes}`}
                              </p>
                            </div>
                          )}

                          {/* CTAs */}
                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFollowupId(nextScheduled.id);
                                setIsCompleteOpen(true);
                              }}
                              className="px-3.5 py-1.8 bg-[#133C27] hover:bg-[#0d2e1d] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
                            >
                              Mark Completed
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFollowupId(nextScheduled.id);
                                setIsRescheduleOpen(true);
                              }}
                              className="px-3.5 py-1.8 border border-[#E8E2D6] bg-white hover:bg-gray-55 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 space-y-3">
                          <p className="text-xs text-gray-450 italic font-bold">No follow-up action currently scheduled for this lead profile.</p>
                          <button
                            type="button"
                            onClick={() => setIsScheduleOpen(true)}
                            className="px-4 py-2 bg-[#0D2E1D] hover:bg-[#184B31] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                          >
                            + Schedule Follow-up
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Section 4: Attention Required Alerts */}
                    {alertsList.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-red-800 tracking-wider flex items-center gap-1.5">
                          <AlertCircle size={12} className="text-red-700" />
                          <span>ATTENTION REQUIRED ALERTS</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {alertsList.map((alertText, idx) => (
                            <div key={idx} className="bg-red-50 border border-red-200 text-red-900 rounded-xl p-3.5 flex items-start gap-2 text-xs font-bold">
                              <AlertCircle size={14} className="text-red-700 shrink-0 mt-0.5" />
                              <span className="font-extrabold leading-normal text-red-800">{alertText}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 3: Follow-up Timeline */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider">CHRONOLOGICAL FOLLOW-UP TIMELINE</h4>
                        <span className="text-[9px] text-gray-400 font-bold">{followups.length} Total Logs</span>
                      </div>

                      {followups.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-4">No follow-ups recorded yet.</p>
                      ) : (
                        <div className="relative border-l border-gray-150 pl-6 ml-3 space-y-6 text-xs">
                          {[...followups]
                            .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
                            .map((f) => {
                              const isDone = f.status === "Completed";
                              const isMissed = f.status === "Overdue";
                              const isCancelled = f.status === "Cancelled";
                              
                              return (
                                <div key={f.id} className="relative min-h-[50px] flex flex-col justify-center bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                  {/* Bullet Status Icon */}
                                  <div className={cn(
                                    "absolute -left-[37px] top-4 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm text-[9px] font-black",
                                    isDone ? "bg-emerald-500 text-white" :
                                    isMissed ? "bg-red-500 text-white" :
                                    isCancelled ? "bg-gray-400 text-white" : "bg-blue-500 text-white"
                                  )}>
                                    {f.type === "Call" ? "📞" :
                                     f.type === "WhatsApp" ? "💬" :
                                     f.type === "Site Visit" ? "🏗️" :
                                     f.type === "Meeting" ? "🤝" : "✉️"}
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-1.5 border-gray-100">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-extrabold text-[#1A3C2A] text-[10.5px]">
                                          {f.type} {isDone ? "Completed" : "Scheduled"}
                                        </span>
                                        <span className={cn(
                                          "px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-tight",
                                          isDone ? "bg-[#E8F5EC] text-emerald-800 border border-emerald-250" :
                                          isMissed ? "bg-red-50 text-red-800 border border-red-200" :
                                          isCancelled ? "bg-gray-100 text-gray-700 border border-gray-200" :
                                          "bg-blue-50 text-blue-800 border border-blue-200"
                                        )}>
                                          {f.status}
                                        </span>
                                      </div>
                                      <span className="text-gray-400 font-medium text-[9px]">{f.scheduledDate}</span>
                                    </div>

                                    <div className="space-y-1.5 text-xs text-gray-700 font-bold">
                                      {isDone && f.outcome && (
                                        <div>
                                          <span className="text-[8.5px] uppercase text-gray-400 font-black block">Outcome Summary</span>
                                          <p className="text-gray-655 leading-relaxed font-bold mt-0.5">{f.outcome}</p>
                                        </div>
                                      )}

                                      {f.purpose && (
                                        <div>
                                          <span className="text-[8.5px] uppercase text-gray-400 font-black block">Purpose / Objective</span>
                                          <p className="text-gray-600 font-medium leading-relaxed mt-0.5">{f.purpose}</p>
                                        </div>
                                      )}

                                      {isDone && f.nextRecommendedAction && (
                                        <div className="pt-1.5 border-t border-dashed border-gray-100 flex items-center justify-between gap-2">
                                          <div>
                                            <span className="text-[8.5px] uppercase text-[#C9A82C] font-black block">Next Action Criteria</span>
                                            <span className="text-[10px] text-[#133C27] font-extrabold">{f.nextRecommendedAction}</span>
                                          </div>
                                          <div>
                                            <span className="text-[8.5px] uppercase text-gray-400 font-black block text-right font-bold">Conducted By</span>
                                            <span className="text-[9.5px] text-gray-700 block text-right font-black">{f.completedBy || f.conductedBy}</span>
                                          </div>
                                        </div>
                                      )}

                                      {!isDone && (
                                        <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-gray-100 text-[9px] text-gray-400 font-bold">
                                          <span>Priority: {f.priority}</span>
                                          <span>Assigned To: {f.conductedBy}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    {/* Section 5: Super Admin Actions */}
                    <div className="bg-[#FAF8F5] border border-[#E8E2D6] rounded-xl p-5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider flex items-center gap-1.5 border-b pb-2">
                        <Shield size={12} className="text-[#C9A82C]" />
                        <span>SUPER ADMIN OPERATIONS</span>
                      </h4>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setIsScheduleOpen(true)}
                          className="py-2 px-3 bg-[#133C27] hover:bg-[#0d2e1d] text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Calendar size={12} />
                          <span>Schedule Follow-up</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setIsReassignOpen(true)}
                          className="py-2 px-3 bg-white border border-[#E8E2D6] hover:bg-gray-55 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserCheck size={12} className="text-[#C9A82C]" />
                          <span>Reassign RM</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsStageOpen(true)}
                          className="py-2 px-3 bg-white border border-[#E8E2D6] hover:bg-gray-55 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <History size={12} className="text-[#133C27]" />
                          <span>Change Stage</span>
                        </button>



                        <button
                          type="button"
                          onClick={() => alert("Exporting lead profile sheet as Excel report...")}
                          className="py-2 px-3 bg-white border border-[#E8E2D6] hover:bg-gray-55 text-gray-700 text-[9px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload size={12} className="rotate-180 text-gray-400" />
                          <span>Export Profile Sheet</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Negotiation hub & Action Forms */}
              {/* Negotiation hub */}
              {activeTab === "negotiation" && (
                <div className="space-y-6">

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

          {/* RM Details Card */}
          {basicLead.rm && basicLead.rm !== "Unassigned" ? (
            <div className="bg-white border border-[#E8E2D6] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-4">
              <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider border-b pb-2 flex items-center gap-1.5">
                <User size={12} className="text-[#C9A82C]" />
                <span>RELATIONSHIP MANAGER</span>
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-[#E8E2D6] flex items-center justify-center text-sm font-extrabold text-[#B5982C]">
                  {basicLead.rm.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-sm text-[#1A3C2A]">{basicLead.rm}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Portfolio Advisor</p>
                </div>
              </div>
              <div className="space-y-2 text-xs pt-2 border-t border-gray-100 text-gray-650">
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-gray-455" />
                  <span className="font-bold">+91 99402 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-gray-455" />
                  <span className="font-bold break-all">{basicLead.rm.toLowerCase().replace(" ", ".")}@vasiyam.com</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsReassignOpen(true)}
                className="w-full py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-wider text-gray-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-2"
              >
                <UserCheck size={12} className="text-[#C9A82C]" />
                <span>Transfer Ownership RM</span>
              </button>

              <div className="pt-2 border-t border-dashed border-gray-150 w-full">
                <a
                  href="tel:+919940212345"
                  className="w-full py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-[9px] font-black uppercase tracking-wider text-gray-600 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Phone size={11} className="text-emerald-600" />
                  <span>Call RM</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E2D6] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] space-y-3 text-center">
              <h4 className="text-[10px] font-black uppercase text-[#1a3c2a] tracking-wider border-b pb-2 text-left flex items-center gap-1.5">
                <User size={12} className="text-gray-400" />
                <span>RELATIONSHIP MANAGER</span>
              </h4>
              <p className="text-[10.5px] text-gray-450 font-bold leading-normal">
                No Relationship Manager assigned to this lead profile yet.
              </p>
              <button
                onClick={() => setIsReassignOpen(true)}
                className="w-full py-2.5 bg-[#0D2E1D] hover:bg-[#184B31] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck size={12} />
                <span>Assign advisor</span>
              </button>
            </div>
          )}
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
