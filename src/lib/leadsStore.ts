// src/lib/leadsStore.ts

import { LeadDetails, initialLeadDetailsList, generateDefaultDetails, FollowupRecord } from "@/mock/leadDetails";

export interface Lead {
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

export const initialMockLeads: Lead[] = [
  {
    id: "LD-2415",
    name: "Ravi Kumar",
    mobile: "+91 98765 43210",
    secondaryMobile: "",
    email: "ravi.kumar@gmail.com",
    source: "Website",
    budget: 7500000,
    project: "Vasiyam Enclave",
    rm: "Arun Kumar",
    score: 85,
    stage: "New",
    lastActivityTime: "2 mins ago",
    lastActivityDesc: "Lead created",
    nextFollowupText: "Today, 3:00 PM",
    createdDate: "2026-06-25",
    preferredLocation: "Thoraipakkam",
    remarks: "Very interested in 3BHK east-facing apartment. Clean prospect."
  },
  {
    id: "LD-2414",
    name: "Priya Sharma",
    mobile: "+91 87654 32109",
    secondaryMobile: "",
    email: "priya.sharma@gmail.com",
    source: "Facebook Ads",
    budget: 6500000,
    project: "Vasiyam Grandeur",
    rm: "Meera Nair",
    score: 72,
    stage: "Contacted",
    lastActivityTime: "15 mins ago",
    lastActivityDesc: "Called",
    nextFollowupText: "Tomorrow, 11:00 AM",
    createdDate: "2026-06-25",
    preferredLocation: "Medavakkam",
    remarks: "Responded to Meta advertisement. Shared project details over WhatsApp."
  },
  {
    id: "LD-2413",
    name: "Suresh Babu",
    mobile: "+91 91234 56789",
    secondaryMobile: "",
    email: "suresh.babu@gmail.com",
    source: "WhatsApp",
    budget: 8500000,
    project: "Vasiyam Meadows",
    rm: "Divya Sharma",
    score: 64,
    stage: "Qualified",
    lastActivityTime: "1 hour ago",
    lastActivityDesc: "Details shared",
    nextFollowupText: "28 Jun, 4:00 PM",
    createdDate: "2026-06-25",
    preferredLocation: "Velachery",
    remarks: "Financing approved. Seeking 3BHK flats with wood work options."
  },
  {
    id: "LD-2412",
    name: "Anitha Rajan",
    mobile: "+91 99876 54321",
    secondaryMobile: "",
    email: "anitha.rajan@gmail.com",
    source: "Referral",
    budget: 12000000,
    project: "Vasiyam Enclave",
    rm: "Suresh Pillai",
    score: 55,
    stage: "Site Visit",
    lastActivityTime: "3 hours ago",
    lastActivityDesc: "Site visit scheduled",
    nextFollowupText: "28 Jun, 11:00 AM",
    createdDate: "2026-06-24",
    preferredLocation: "Adyar",
    remarks: "Wants premium duplex flats. Referral from existing customer."
  },
  {
    id: "LD-2411",
    name: "Vikram M",
    mobile: "+91 93456 78901",
    secondaryMobile: "",
    email: "vikram.m@gmail.com",
    source: "Walk-in",
    budget: 5000000,
    project: "Vasiyam Grandeur",
    rm: "Arun Kumar",
    score: 48,
    stage: "Negotiation",
    lastActivityTime: "1 day ago",
    lastActivityDesc: "Price discussion",
    nextFollowupText: "29 Jun, 3:30 PM",
    createdDate: "2026-06-24",
    preferredLocation: "OMR Sholinganallur",
    remarks: "Demanding discount on registrar charges. Discussing final rates."
  },
  {
    id: "LD-2410",
    name: "Deepa Nair",
    mobile: "+91 90321 45678",
    secondaryMobile: "",
    email: "deepa.nair@gmail.com",
    source: "99acres",
    budget: 7000000,
    project: "The Residency",
    rm: "Meera Nair",
    score: 42,
    stage: "New",
    lastActivityTime: "1 day ago",
    lastActivityDesc: "Lead created",
    nextFollowupText: "30 Jun, 10:00 AM",
    createdDate: "2026-06-24",
    preferredLocation: "Adyar",
    remarks: "Enquiry through 99acres portal for 3BHK flat."
  },
  {
    id: "LD-2409",
    name: "Aravind K",
    mobile: "+91 88990 12345",
    secondaryMobile: "",
    email: "aravind.k@gmail.com",
    source: "Google Ads",
    budget: 16000000,
    project: "Sky Heights",
    rm: "Divya Sharma",
    score: 36,
    stage: "Contacted",
    lastActivityTime: "2 days ago",
    lastActivityDesc: "Called",
    nextFollowupText: "30 Jun, 2:00 PM",
    createdDate: "2026-06-23",
    preferredLocation: "Velachery",
    remarks: "High budget lead. Seeking premium top floor penthouse."
  }
];

const LEADS_KEY = "vasiyam_leads";
const DETAILS_KEY_PREFIX = "vasiyam_details_";

export function getStoredLeads(initialLeads?: Lead[]): Lead[] {
  if (typeof window === "undefined") return initialLeads || initialMockLeads;
  const stored = localStorage.getItem(LEADS_KEY);
  if (!stored || stored === "[]") {
    const fallback = (initialLeads && initialLeads.length > 0) ? initialLeads : initialMockLeads;
    localStorage.setItem(LEADS_KEY, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(stored);
}

export function saveStoredLeads(leads: Lead[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export function getStoredLeadDetails(id: string, basicLead?: Lead): LeadDetails | null {
  if (typeof window === "undefined") return null;
  const key = `${DETAILS_KEY_PREFIX}${id}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }

  // Fallback to initial mock list
  const initialDetail = initialLeadDetailsList.find((d) => d.id === id);
  if (initialDetail) {
    if (!initialDetail.systemAuditLogs || initialDetail.systemAuditLogs.length === 0) {
      initialDetail.systemAuditLogs = [
        {
          id: "AUD-101",
          date: initialDetail.auditInfo.createdOn.split(" ")[0] || "2026-06-25",
          time: "10:15 AM",
          user: initialDetail.auditInfo.createdBy || "System Ads Router",
          role: "System",
          action: "Lead Created",
          previousValue: "None",
          newValue: `Interested Project: ${basicLead?.project || "Grandeur"}, Budget: ₹${basicLead?.budget ? (basicLead.budget / 100000).toFixed(0) : "85"} Lakhs`,
          ipAddress: "192.168.1.15"
        },
        {
          id: "AUD-102",
          date: initialDetail.assignmentDate.split(" ")[0] || "2026-06-25",
          time: "10:30 AM",
          user: "Admin Manager",
          role: "Super Admin",
          action: "Relationship Manager Assignment",
          previousValue: "None",
          newValue: initialDetail.assignedBy || "Suresh Pillai",
          ipAddress: "192.168.1.10"
        }
      ];

      // Seed stage logs
      initialDetail.stageHistory.forEach((sh, idx) => {
        initialDetail.systemAuditLogs!.push({
          id: `AUD-STG-${idx}-${Date.now()}`,
          date: sh.date.split(" ")[0] || "2026-06-25",
          time: "11:00 AM",
          user: sh.changedBy,
          role: sh.changedBy === "Super Admin" ? "Super Admin" : "Relationship Manager",
          action: "Stage Changed",
          previousValue: idx === initialDetail.stageHistory.length - 1 ? "New" : initialDetail.stageHistory[idx + 1].currentStage,
          newValue: sh.currentStage,
          ipAddress: "10.123.18.12"
        });
      });

      // Seed transfer logs
      initialDetail.transferHistory.forEach((th, idx) => {
        initialDetail.systemAuditLogs!.push({
          id: `AUD-TRF-${idx}-${Date.now()}`,
          date: th.date.split(" ")[0] || "2026-06-25",
          time: "02:00 PM",
          user: th.assignedBy,
          role: "Super Admin",
          action: "Relationship Manager Transfer",
          previousValue: th.fromRM,
          newValue: th.toRM,
          ipAddress: "192.168.1.10"
        });
      });
    }

    localStorage.setItem(key, JSON.stringify(initialDetail));
    return initialDetail;
  }

  // Generate default if basicLead is provided
  if (basicLead) {
    const generated = generateDefaultDetails(basicLead);
    if (!generated.systemAuditLogs) {
      generated.systemAuditLogs = [
        {
          id: "AUD-G101",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          user: "Meta Ads Router",
          role: "System",
          action: "Lead Created",
          previousValue: "None",
          newValue: `Interested Project: ${basicLead.project || "Grandeur"}, Budget: ₹${(basicLead.budget / 100000).toFixed(0)} Lakhs`,
          ipAddress: "192.168.1.1"
        }
      ];
    }
    localStorage.setItem(key, JSON.stringify(generated));
    return generated;
  }

  return null;
}

export function saveStoredLeadDetails(id: string, details: LeadDetails) {
  if (typeof window === "undefined") return;
  const key = `${DETAILS_KEY_PREFIX}${id}`;
  localStorage.setItem(key, JSON.stringify(details));
}

// Log an activity for the lead detail timeline
export function logLeadActivity(
  id: string,
  type: string,
  description: string,
  performedBy: string,
  role?: string,
  relatedStage?: string
) {
  const details = getStoredLeadDetails(id);
  if (!details) return;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newActivity = {
    id: `ACT-${Date.now()}`,
    type,
    description,
    date: nowStr,
    performedBy,
    role: role || "Relationship Manager",
    relatedStage: relatedStage || (details.stageHistory[0]?.currentStage || "New")
  };

  details.activities = [newActivity, ...details.activities];
  details.auditInfo.lastModifiedOn = nowStr;
  details.auditInfo.lastModifiedBy = performedBy;

  saveStoredLeadDetails(id, details);
}

// 1. ADD COMMENT
export function addLeadComment(
  id: string,
  content: string,
  type: LeadDetails["comments"][0]["type"],
  author: string
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newComment = {
    id: `C-${Date.now()}`,
    content,
    type,
    date: nowStr,
    author
  };

  details.comments = [newComment, ...details.comments];
  saveStoredLeadDetails(id, details);

  // Sync to basic lead's activity details
  updateBasicLeadActivity(id, "Comment added", `Added: "${content.substring(0, 30)}..."`);
  logLeadActivity(id, "Comment Added", `Logged a ${type}: "${content.substring(0, 50)}..."`, author);

  return newComment;
}

// 2. ADD FOLLOWUP
export function calculateStatusByDate(scheduledDateStr: string): "Overdue" | "Due Today" | "Upcoming" | "Scheduled" {
  const now = new Date();
  const sched = new Date(scheduledDateStr);
  
  if (isNaN(sched.getTime())) return "Scheduled";

  // Check if same day
  const isSameDay = 
    now.getFullYear() === sched.getFullYear() &&
    now.getMonth() === sched.getMonth() &&
    now.getDate() === sched.getDate();

  if (sched.getTime() < now.getTime() && !isSameDay) {
    return "Overdue";
  }
  if (isSameDay) {
    return "Due Today";
  }
  
  // check if within next 48 hours
  const diffMs = sched.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours > 0 && diffHours <= 48) {
    return "Upcoming";
  }
  
  return "Scheduled";
}

// 2. SCHEDULE FOLLOW-UP
export function scheduleFollowupAction(
  id: string,
  followup: {
    type: "Call" | "WhatsApp" | "Email" | "Meeting" | "Site Visit";
    priority: "Low" | "Medium" | "High" | "Critical";
    scheduledDate: string;
    conductedBy: string;
    createdBy: string;
    scheduledBy: string;
    reminder?: string;
    reminderTime?: string;
    purpose: string;
    notes?: string;
  }
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const status = calculateStatusByDate(followup.scheduledDate);

  const newFollowup: FollowupRecord = {
    id: `F-${Date.now()}`,
    status,
    type: followup.type,
    priority: followup.priority,
    scheduledDate: followup.scheduledDate,
    conductedBy: followup.conductedBy,
    createdBy: followup.createdBy,
    scheduledBy: followup.scheduledBy,
    reminder: followup.reminder,
    reminderTime: followup.reminderTime,
    purpose: followup.purpose,
    notes: followup.notes,
    lastModified: `${nowStr} by ${followup.scheduledBy}`
  };

  // Ensure only one active scheduled follow-up exists at a time (mark previous scheduled ones as Cancelled)
  details.followupHistory = details.followupHistory.map(f => {
    if (["Scheduled", "Upcoming", "Due Today", "Overdue"].includes(f.status)) {
      return {
        ...f,
        status: "Cancelled",
        outcome: "Cancelled automatically due to new follow-up scheduling.",
        lastModified: `${nowStr} by System`
      };
    }
    return f;
  });

  details.followupHistory = [newFollowup, ...details.followupHistory];
  saveStoredLeadDetails(id, details);

  // Sync basic lead next follow-up and activity
  const nextText = new Date(followup.scheduledDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });

  updateBasicLeadFollowup(id, nextText, `Follow-up Scheduled`, followup.purpose);
  logLeadActivity(
    id, 
    "Follow-up Scheduled", 
    `Scheduled a ${followup.priority}-priority ${followup.type} for ${nextText} - Purpose: ${followup.purpose}`, 
    followup.scheduledBy, 
    "Super Admin", 
    details.stageHistory[0]?.currentStage || "New"
  );

  return newFollowup;
}

// 3. COMPLETE FOLLOW-UP
export function completeFollowupAction(
  id: string,
  followupId: string,
  completion: {
    outcome: string;
    customerResponse: "Positive" | "Neutral" | "Negative" | "No Response";
    discussionSummary: string;
    budgetConfirmation?: number;
    propertyPreferenceUpdates?: string;
    objectionsRaised?: string;
    documentsShared?: string;
    siteVisitFeedback?: string;
    negotiationNotes?: string;
    internalNotes?: string;
    performedBy: string;
    completedBy: string;
    duration?: string;
    leadTemperature?: "Hot" | "Warm" | "Cold";
    nextRecommendedAction?: string;
    // Optional actions
    advanceStage?: "New" | "Contacted" | "Qualified" | "Site Visit" | "Negotiation" | "Booked" | "Lost";
    reassignRM?: string;
  }
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);

  const idx = details.followupHistory.findIndex((f) => f.id === followupId);
  if (idx === -1) return null;

  // 1. Process stage progression if requested
  let stageChangeStr = "None";
  if (completion.advanceStage && typeof window !== "undefined") {
    const basicStored = localStorage.getItem(LEADS_KEY);
    if (basicStored) {
      const leadsList: Lead[] = JSON.parse(basicStored);
      const basicLead = leadsList.find((l) => l.id === id);
      if (basicLead && basicLead.stage !== completion.advanceStage) {
        const oldStage = basicLead.stage;
        stageChangeStr = `${oldStage} ➔ ${completion.advanceStage}`;
        
        // Invoke the stage store update
        changeLeadStageStore(id, completion.advanceStage, completion.completedBy, `Follow-up completion stage advance: ${completion.outcome}`);
      }
    }
  }

  // 2. Process RM reassignment if requested
  if (completion.reassignRM && typeof window !== "undefined") {
    const basicStored = localStorage.getItem(LEADS_KEY);
    if (basicStored) {
      const leadsList: Lead[] = JSON.parse(basicStored);
      const basicLead = leadsList.find((l) => l.id === id);
      if (basicLead && basicLead.rm !== completion.reassignRM) {
        changeLeadRMStore(id, completion.reassignRM, completion.completedBy);
      }
    }
  }

  // Load details again to ensure we don't overwrite the RM/Stage changes in localStorage
  const updatedDetails = getStoredLeadDetails(id) || details;

  const targetFollowup: FollowupRecord = {
    ...updatedDetails.followupHistory[idx],
    status: "Completed",
    completedDate: nowStr,
    completedBy: completion.completedBy,
    outcome: completion.outcome,
    customerResponse: completion.customerResponse,
    discussionSummary: completion.discussionSummary,
    budgetConfirmation: completion.budgetConfirmation,
    propertyPreferenceUpdates: completion.propertyPreferenceUpdates,
    objectionsRaised: completion.objectionsRaised,
    documentsShared: completion.documentsShared,
    siteVisitFeedback: completion.siteVisitFeedback,
    negotiationNotes: completion.negotiationNotes,
    internalNotes: completion.internalNotes,
    duration: completion.duration || "10 mins",
    leadTemperature: completion.leadTemperature,
    nextRecommendedAction: completion.nextRecommendedAction,
    relatedStageChange: stageChangeStr,
    lastModified: `${nowStr} by ${completion.completedBy}`
  };

  updatedDetails.followupHistory = updatedDetails.followupHistory.map((f, i) => (i === idx ? targetFollowup : f));

  saveStoredLeadDetails(id, updatedDetails);

  // Sync back to basic lead's budget if budgetConfirmation is provided
  if (completion.budgetConfirmation && typeof window !== "undefined") {
    const basicStored = localStorage.getItem(LEADS_KEY);
    if (basicStored) {
      const leadsList: Lead[] = JSON.parse(basicStored);
      const updatedList = leadsList.map((l) =>
        l.id === id ? { ...l, budget: completion.budgetConfirmation! } : l
      );
      localStorage.setItem(LEADS_KEY, JSON.stringify(updatedList));
    }
  }

  // Update basic lead's activity info
  updateBasicLeadActivity(id, `Follow-up Completed`, completion.outcome);
  logLeadActivity(
    id, 
    "Follow-up Completed", 
    `Completed follow-up ${targetFollowup.type} - Temp: ${completion.leadTemperature}, Response: ${completion.customerResponse}`, 
    completion.completedBy, 
    "Super Admin", 
    updatedDetails.stageHistory[0]?.currentStage || "New"
  );

  // Run status sync to update next followup text on basic lead
  syncFollowupStatuses(id);

  return targetFollowup;
}

// 4. CANCEL FOLLOW-UP
export function cancelFollowupAction(id: string, followupId: string, performedBy: string) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  
  const idx = details.followupHistory.findIndex((f) => f.id === followupId);
  if (idx === -1) return null;

  const targetFollowup: FollowupRecord = {
    ...details.followupHistory[idx],
    status: "Cancelled",
    outcome: "Cancelled by Super Admin/Manager.",
    lastModified: `${nowStr} by ${performedBy}`
  };

  details.followupHistory = details.followupHistory.map((f, i) => (i === idx ? targetFollowup : f));

  saveStoredLeadDetails(id, details);

  updateBasicLeadActivity(id, "Follow-up Cancelled", `Follow-up ${targetFollowup.type} was cancelled.`);
  logLeadActivity(
    id, 
    "Follow-up Cancelled", 
    `Cancelled scheduled ${targetFollowup.type}`, 
    performedBy, 
    "Super Admin", 
    details.stageHistory[0]?.currentStage || "New"
  );

  syncFollowupStatuses(id);

  return targetFollowup;
}

// 5. RESCHEDULE FOLLOW-UP
export function rescheduleFollowupAction(
  id: string,
  followupId: string,
  reschedule: {
    type: "Call" | "WhatsApp" | "Email" | "Meeting" | "Site Visit";
    priority: "Low" | "Medium" | "High" | "Critical";
    scheduledDate: string;
    conductedBy: string;
    createdBy: string;
    scheduledBy: string;
    reminder?: string;
    reminderTime?: string;
    purpose: string;
    notes?: string;
    reason: string;
    performedBy: string;
  }
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  
  // 1. Mark previous follow-up as Rescheduled
  const newNextId = `F-${Date.now()}`;
  let oldFollowupType = "Follow-up";

  const idx = details.followupHistory.findIndex((f) => f.id === followupId);
  if (idx !== -1) {
    oldFollowupType = details.followupHistory[idx].type;
    details.followupHistory = details.followupHistory.map((f, i) =>
      i === idx
        ? {
            ...f,
            status: "Rescheduled",
            outcome: `Rescheduled. Reason: ${reschedule.reason}`,
            nextFollowupId: newNextId,
            lastModified: `${nowStr} by ${reschedule.performedBy}`
          }
        : f
    );
  }

  // 2. Create the successor scheduled follow-up
  const status = calculateStatusByDate(reschedule.scheduledDate);
  const newFollowup: FollowupRecord = {
    id: newNextId,
    status,
    type: reschedule.type,
    priority: reschedule.priority,
    scheduledDate: reschedule.scheduledDate,
    conductedBy: reschedule.conductedBy,
    createdBy: reschedule.createdBy,
    scheduledBy: reschedule.scheduledBy,
    reminder: reschedule.reminder,
    reminderTime: reschedule.reminderTime,
    purpose: reschedule.purpose,
    notes: reschedule.notes,
    lastModified: `${nowStr} by ${reschedule.performedBy}`
  };

  details.followupHistory = [newFollowup, ...details.followupHistory];
  saveStoredLeadDetails(id, details);

  const nextText = new Date(reschedule.scheduledDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });

  updateBasicLeadFollowup(id, nextText, `Follow-up Rescheduled`, `Rescheduled: ${reschedule.reason}`);
  logLeadActivity(
    id,
    "Follow-up Rescheduled",
    `Rescheduled ${oldFollowupType} to ${nextText} - Reason: ${reschedule.reason}`,
    reschedule.performedBy,
    "Super Admin",
    details.stageHistory[0]?.currentStage || "New"
  );

  return newFollowup;
}

// 6. SYNC FOLLOW-UP STATUSES (Date checker)
export function syncFollowupStatuses(id: string): FollowupRecord[] {
  const details = getStoredLeadDetails(id);
  if (!details || !details.followupHistory) return [];

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  let listChanged = false;

  const updatedHistory = details.followupHistory.map((f) => {
    if (["Scheduled", "Upcoming", "Due Today", "Overdue"].includes(f.status)) {
      const calculated = calculateStatusByDate(f.scheduledDate);
      if (calculated !== f.status) {
        listChanged = true;
        return {
          ...f,
          status: calculated,
          lastModified: `${nowStr} by System (Auto Status Sync)`
        };
      }
    }
    return f;
  });

  if (listChanged) {
    details.followupHistory = updatedHistory;
    saveStoredLeadDetails(id, details);
  }

  // Update basic lead nextFollowupText to show the closest pending follow-up date
  const pending = updatedHistory.filter((f) =>
    ["Scheduled", "Upcoming", "Due Today", "Overdue"].includes(f.status)
  );

  let nextText = "None";
  if (pending.length > 0) {
    // Sort by scheduledDate ascending (closest first)
    const sortedPending = [...pending].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    nextText = new Date(sortedPending[0].scheduledDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  if (typeof window !== "undefined") {
    const basicStored = localStorage.getItem(LEADS_KEY);
    if (basicStored) {
      const leadsList: Lead[] = JSON.parse(basicStored);
      const updatedList = leadsList.map((l) =>
        l.id === id ? { ...l, nextFollowupText: nextText } : l
      );
      localStorage.setItem(LEADS_KEY, JSON.stringify(updatedList));
    }
  }

  return updatedHistory;
}

// 3. NEGOTIATION OFFERS
export function addLeadCounterOffer(
  id: string,
  offer: {
    offeredBy: "RM" | "Customer" | "Manager";
    amount: number;
    remark?: string;
    performedBy: string;
  }
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newOffer = {
    offeredBy: offer.offeredBy,
    amount: offer.amount,
    date: nowStr,
    remark: offer.remark
  };

  details.negotiation.counterOffers = [...details.negotiation.counterOffers, newOffer];
  details.negotiation.status = "Ongoing";
  saveStoredLeadDetails(id, details);

  const formattedAmount = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(offer.amount);
  updateBasicLeadActivity(id, "Negotiation Updated", `Counter offer of ${formattedAmount} proposed by ${offer.offeredBy}`);
  logLeadActivity(id, "Negotiation Updated", `Proposed ${offer.offeredBy} counter-offer of ${formattedAmount}`, offer.performedBy);

  return newOffer;
}

// 4. APPROVE DISCOUNT
export function approveLeadDiscount(
  id: string,
  discount: {
    amount: number;
    approvedBy: string;
  }
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newDiscount = {
    amount: discount.amount,
    approvedBy: discount.approvedBy,
    date: nowStr
  };

  details.negotiation.approvedDiscounts = [...details.negotiation.approvedDiscounts, newDiscount];
  saveStoredLeadDetails(id, details);

  const formattedAmount = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(discount.amount);
  updateBasicLeadActivity(id, "Discount Approved", `Discount of ${formattedAmount} approved by ${discount.approvedBy}`);
  logLeadActivity(id, "Negotiation Updated", `Approved discount of ${formattedAmount} for the lead`, discount.approvedBy);

  return newDiscount;
}

// 5. FINALIZE NEGOTIATION
export function finalizeLeadNegotiation(
  id: string,
  negotiation: {
    status: "Agreed" | "Rejected";
    finalAgreedAmount?: number;
    remarks?: string;
    performedBy: string;
  }
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  details.negotiation.status = negotiation.status;
  details.negotiation.finalAgreedAmount = negotiation.finalAgreedAmount;
  details.negotiation.remarks = negotiation.remarks;
  saveStoredLeadDetails(id, details);

  if (negotiation.status === "Agreed" && negotiation.finalAgreedAmount) {
    const formattedAmount = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(negotiation.finalAgreedAmount);
    updateBasicLeadActivity(id, "Price Agreed", `Final agreed rate: ${formattedAmount}`);
    logLeadActivity(id, "Negotiation Won", `Agreed on final rate of ${formattedAmount}`, negotiation.performedBy);
  } else {
    updateBasicLeadActivity(id, "Negotiation Rejected", `Negotiation closed as rejected`);
    logLeadActivity(id, "Negotiation Closed", `Negotiation closed: rejected. Reason: ${negotiation.remarks}`, negotiation.performedBy);
  }
}

// 6. UPLOAD DOCUMENT
export function uploadLeadDocument(
  id: string,
  doc: {
    name: string;
    type: LeadDetails["documents"][0]["type"];
    size: string;
    uploadedBy: string;
  }
) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newDoc = {
    id: `DOC-${Date.now()}`,
    name: doc.name,
    type: doc.type,
    url: "#",
    size: doc.size,
    uploadDate: nowStr,
    uploadedBy: doc.uploadedBy
  };

  details.documents = [newDoc, ...details.documents];
  saveStoredLeadDetails(id, details);

  updateBasicLeadActivity(id, "Document Uploaded", `File: ${doc.name}`);
  logLeadActivity(id, "Documents Uploaded", `Uploaded file: ${doc.name} (${doc.type})`, doc.uploadedBy);

  return newDoc;
}

// 7. PRIVATE NOTE
export function addLeadPrivateNote(id: string, content: string, author: string) {
  const details = getStoredLeadDetails(id);
  if (!details) return null;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newNote = {
    id: `PN-${Date.now()}`,
    content,
    author,
    date: nowStr
  };

  details.internalNotes = [newNote, ...details.internalNotes];
  saveStoredLeadDetails(id, details);

  // We do not sync private notes to basic lead's public activity status for security/privacy.
  logLeadActivity(id, "Comment Added", `Added private internal note`, author);

  return newNote;
}

// 8. CHANGE RM / REASSIGN
export function changeLeadRMStore(id: string, newRM: string, assignedBy: string) {
  const details = getStoredLeadDetails(id);
  if (!details) return;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const oldRM = details.transferHistory.length > 0 ? details.transferHistory[0].toRM : (details.assignedBy || "Unassigned");

  const transferRecord = {
    fromRM: oldRM,
    toRM: newRM,
    assignedBy,
    date: nowStr
  };

  details.transferHistory = [transferRecord, ...details.transferHistory];
  details.auditInfo.lastModifiedBy = assignedBy;
  details.auditInfo.lastModifiedOn = nowStr;

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (!details.systemAuditLogs) details.systemAuditLogs = [];
  details.systemAuditLogs.push({
    id: `AUD-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    user: assignedBy,
    role: "Super Admin",
    action: "Relationship Manager Transfer",
    previousValue: oldRM,
    newValue: newRM,
    ipAddress: "192.168.1.10"
  });

  saveStoredLeadDetails(id, details);

  // Update basic lead record
  if (typeof window !== "undefined") {
    const basicStored = localStorage.getItem(LEADS_KEY);
    if (basicStored) {
      const leadsList: Lead[] = JSON.parse(basicStored);
      const updatedList = leadsList.map((l) =>
        l.id === id
          ? {
              ...l,
              rm: newRM,
              lastActivityTime: "Just now",
              lastActivityDesc: `RM assigned: ${newRM}`
            }
          : l
      );
      localStorage.setItem(LEADS_KEY, JSON.stringify(updatedList));
    }
  }

  logLeadActivity(id, "RM Assigned/Reassigned", `RM transfer from ${oldRM} to ${newRM} executed by ${assignedBy}`, assignedBy);
}

// 9. CHANGE STAGE
export function changeLeadStageStore(
  id: string,
  newStage: Lead["stage"],
  changedBy: string,
  reason: string
) {
  const details = getStoredLeadDetails(id);
  if (!details) return;

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const oldStage = details.stageHistory.length > 0 ? details.stageHistory[0].currentStage : "New";

  const stageRecord = {
    previousStage: oldStage,
    currentStage: newStage,
    date: nowStr,
    changedBy,
    reason,
    timeSpent: "Current" // Time spent for the prior stage would be calculated in a real DB
  };

  // Update previous stage's record's timeSpent if exists
  if (details.stageHistory.length > 0) {
    const diffMs = Math.abs(new Date(nowStr).getTime() - new Date(details.stageHistory[0].date).getTime());
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const timeText = diffHours < 1 ? "less than an hour" : diffHours < 24 ? `${diffHours} hours` : `${Math.round(diffHours / 24)} days`;
    details.stageHistory[0].timeSpent = timeText;
  }

  details.stageHistory = [stageRecord, ...details.stageHistory];
  details.auditInfo.lastModifiedBy = changedBy;
  details.auditInfo.lastModifiedOn = nowStr;

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (!details.systemAuditLogs) details.systemAuditLogs = [];
  details.systemAuditLogs.push({
    id: `AUD-${Date.now()}`,
    date: dateStr,
    time: timeStr,
    user: changedBy,
    role: "Super Admin",
    action: "Stage Changed",
    previousValue: oldStage,
    newValue: newStage,
    ipAddress: "192.168.1.10"
  });

  saveStoredLeadDetails(id, details);

  // Update basic lead record
  if (typeof window !== "undefined") {
    const basicStored = localStorage.getItem(LEADS_KEY);
    if (basicStored) {
      const leadsList: Lead[] = JSON.parse(basicStored);
      const updatedList = leadsList.map((l) =>
        l.id === id
          ? {
              ...l,
              stage: newStage,
              lastActivityTime: "Just now",
              lastActivityDesc: `Stage changed to ${newStage}`
            }
          : l
      );
      localStorage.setItem(LEADS_KEY, JSON.stringify(updatedList));
    }
  }

  logLeadActivity(id, "Status Changed", `Stage transitioned from ${oldStage} to ${newStage}. Reason: ${reason}`, changedBy);
}

// Helpers to update basic lead list states
function updateBasicLeadActivity(id: string, title: string, desc: string) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(LEADS_KEY);
  if (!stored) return;

  const leadsList: Lead[] = JSON.parse(stored);
  const updatedList = leadsList.map((l) =>
    l.id === id
      ? {
          ...l,
          lastActivityTime: "Just now",
          lastActivityDesc: desc
        }
      : l
  );
  localStorage.setItem(LEADS_KEY, JSON.stringify(updatedList));
}

function updateBasicLeadFollowup(id: string, nextFollowupText: string, title: string, desc: string) {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(LEADS_KEY);
  if (!stored) return;

  const leadsList: Lead[] = JSON.parse(stored);
  const updatedList = leadsList.map((l) =>
    l.id === id
      ? {
          ...l,
          nextFollowupText,
          lastActivityTime: "Just now",
          lastActivityDesc: desc
        }
      : l
  );
  localStorage.setItem(LEADS_KEY, JSON.stringify(updatedList));
}
