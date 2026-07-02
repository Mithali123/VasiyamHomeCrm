// src/mock/leadDetails.ts

export interface TransferRecord {
  fromRM: string;
  toRM: string;
  assignedBy: string;
  date: string;
}

export interface StageRecord {
  previousStage: string;
  currentStage: string;
  date: string;
  changedBy: string;
  reason: string;
  timeSpent: string;
}

export interface FollowupRecord {
  id: string;
  status: "Scheduled" | "Upcoming" | "Due Today" | "Overdue" | "Completed" | "Cancelled" | "Rescheduled";
  type: "Call" | "WhatsApp" | "Email" | "Meeting" | "Site Visit";
  priority: "Low" | "Medium" | "High" | "Critical";
  scheduledDate: string; // ISO-like string e.g., "2026-07-02 15:00"
  completedDate?: string; // date of completion
  conductedBy: string; // RM assigned
  createdBy: string; // who scheduled it
  scheduledBy: string; // who scheduled it
  completedBy?: string; // who completed it
  reminder?: string; // reminder details
  reminderTime?: string; // e.g. "15 minutes before"
  purpose: string; // purpose of follow-up
  notes?: string; // initial notes
  duration?: string; // completion duration e.g. "15 mins"
  leadTemperature?: "Hot" | "Warm" | "Cold";
  nextRecommendedAction?: string;
  relatedStageChange?: string; // e.g. "New -> Contacted"

  // Outcome fields collected upon completion
  outcome?: string;
  customerResponse?: "Positive" | "Neutral" | "Negative" | "No Response";
  discussionSummary?: string;
  budgetConfirmation?: number; // budget in INR
  propertyPreferenceUpdates?: string;
  objectionsRaised?: string;
  documentsShared?: string;
  siteVisitFeedback?: string;
  negotiationNotes?: string;
  internalNotes?: string;

  nextFollowupId?: string; // linked next follow-up
  lastModified?: string; // "timestamp by author"
}

export interface CommentRecord {
  id: string;
  content: string;
  type: "Internal" | "RM Note" | "Manager Note" | "Conversation Summary";
  date: string;
  author: string;
  editHistory?: { date: string; content: string }[];
}

export interface CounterOffer {
  offeredBy: "RM" | "Customer" | "Manager";
  amount: number; // in INR
  date: string;
  remark?: string;
}

export interface ApprovedDiscount {
  amount: number;
  approvedBy: string;
  date: string;
}

export interface NegotiationRecord {
  initialOfferedPrice: number;
  customerExpectedPrice: number;
  counterOffers: CounterOffer[];
  approvedDiscounts: ApprovedDiscount[];
  status: "Not Started" | "Ongoing" | "Agreed" | "Rejected";
  finalAgreedAmount?: number;
  remarks?: string;
}

export interface ActivityRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  performedBy: string;
  role?: string; // e.g., "Super Admin", "Relationship Manager"
  relatedStage?: string; // e.g., "Qualified"
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: "Quotation" | "Brochure" | "Agreement" | "Customer Document" | "Site Visit Photo" | "Other";
  url: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface InternalNoteRecord {
  id: string;
  content: string;
  author: string;
  date: string;
  editHistory?: { date: string; content: string }[];
}

export interface AuditRecord {
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}

export interface SystemAuditLogRecord {
  id: string;
  date: string;
  time: string;
  user: string;
  role: string;
  action: string;
  previousValue: string;
  newValue: string;
  ipAddress?: string;
}

export interface LeadDetails {
  id: string; // LD-2415 etc.
  address: string;
  city: string;
  preferredCommunication: "Call" | "WhatsApp" | "Email" | "Meeting";
  preferredContactTime: string;
  propertyType: string;
  expectedPurchaseTimeline: string;
  assignedBy: string;
  assignmentDate: string;

  transferHistory: TransferRecord[];
  stageHistory: StageRecord[];
  followupHistory: FollowupRecord[];
  comments: CommentRecord[];
  negotiation: NegotiationRecord;
  activities: ActivityRecord[];
  documents: DocumentRecord[];
  internalNotes: InternalNoteRecord[];
  auditInfo: AuditRecord;
  systemAuditLogs?: SystemAuditLogRecord[];
}

export const initialLeadDetailsList: LeadDetails[] = [
  {
    id: "LD-2415",
    address: "No. 45, Gandhi Street, Thoraipakkam",
    city: "Chennai",
    preferredCommunication: "WhatsApp",
    preferredContactTime: "Afternoon (2 PM - 5 PM)",
    propertyType: "3BHK Apartment",
    expectedPurchaseTimeline: "Immediate (Within 30 days)",
    assignedBy: "Admin Manager",
    assignmentDate: "2026-06-25 10:00 AM",
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "None",
        currentStage: "New",
        date: "2026-06-25 10:00 AM",
        changedBy: "Admin System",
        reason: "Lead generated via Website Enquiry Form",
        timeSpent: "Current"
      }
    ],
    followupHistory: [
      {
        id: "F-1",
        status: "Completed",
        type: "Call",
        priority: "Medium",
        scheduledDate: "2026-06-25 10:30 AM",
        completedDate: "2026-06-25 10:30 AM",
        conductedBy: "Arun Kumar",
        createdBy: "Admin Manager",
        scheduledBy: "Admin Manager",
        completedBy: "Arun Kumar",
        reminder: "Call client to confirm modular wood request",
        reminderTime: "15 minutes before",
        purpose: "Initial call verification",
        notes: "Referral contact",
        duration: "8 mins",
        leadTemperature: "Warm",
        nextRecommendedAction: "Ping layout plans on WhatsApp",
        relatedStageChange: "None",
        outcome: "Spoke to customer. Verified requirement for a 3BHK east-facing apartment in Vasiyam Enclave.",
        customerResponse: "Positive",
        discussionSummary: "Ravi is highly interested. Budget is rigid at 75L.",
        budgetConfirmation: 7500000,
        propertyPreferenceUpdates: "3BHK apartments in Enclave",
        objectionsRaised: "Wants registration fee waived",
        documentsShared: "Vasiyam_Enclave_Brochure.pdf",
        lastModified: "2026-06-25 10:30 by Arun Kumar",
        nextFollowupId: "F-2"
      },
      {
        id: "F-2",
        status: "Scheduled",
        type: "WhatsApp",
        priority: "High",
        scheduledDate: "2026-07-05 15:00", // Scheduled future date (Upcoming)
        conductedBy: "Arun Kumar",
        createdBy: "Arun Kumar",
        scheduledBy: "Arun Kumar",
        reminder: "Ping on WhatsApp to verify Modular Kitchen final choices",
        reminderTime: "30 minutes before",
        purpose: "Layout check feedback",
        notes: "Shared brochure files previously"
      }
    ],
    comments: [
      {
        id: "C-1",
        content: "Customer requires high floor and vastu compliance (East facing entrance is mandatory). Budget is strictly up to 75L including registration.",
        type: "RM Note",
        date: "2026-06-25 10:35 AM",
        author: "Arun Kumar"
      }
    ],
    negotiation: {
      initialOfferedPrice: 7800000,
      customerExpectedPrice: 7200000,
      counterOffers: [],
      approvedDiscounts: [],
      status: "Not Started"
    },
    activities: [
      {
        id: "A-1",
        type: "Lead Created",
        description: "Enquiry form submitted on Vasiyam Homes website",
        date: "2026-06-25 10:00 AM",
        performedBy: "System",
        role: "System Integration",
        relatedStage: "New"
      },
      {
        id: "A-2",
        type: "RM Assigned",
        description: "Assigned relationship manager Arun Kumar",
        date: "2026-06-25 10:05 AM",
        performedBy: "Admin Manager",
        role: "Super Admin",
        relatedStage: "New"
      },
      {
        id: "A-3",
        type: "Call Logged",
        description: "First call completed. Shared project brochure via WhatsApp.",
        date: "2026-06-25 10:30 AM",
        performedBy: "Arun Kumar",
        role: "Relationship Manager",
        relatedStage: "New"
      }
    ],
    documents: [
      {
        id: "D-1",
        name: "Vasiyam_Enclave_Brochure.pdf",
        type: "Brochure",
        url: "#",
        size: "4.2 MB",
        uploadDate: "2026-06-25 10:07 AM",
        uploadedBy: "System"
      }
    ],
    internalNotes: [
      {
        id: "IN-1",
        content: "Check if Unit 402 East facing in block B is available. Block A is fully booked.",
        author: "Arun Kumar",
        date: "2026-06-25 10:40 AM"
      }
    ],
    auditInfo: {
      createdBy: "Website Integration",
      createdOn: "2026-06-25 10:00 AM",
      lastModifiedBy: "Arun Kumar",
      lastModifiedOn: "2026-06-25 10:40 AM"
    }
  },
  {
    id: "LD-2414",
    address: "Apartment 3A, Orchid Block, Medavakkam",
    city: "Chennai",
    preferredCommunication: "WhatsApp",
    preferredContactTime: "Evening (5 PM - 8 PM)",
    propertyType: "2BHK Apartment",
    expectedPurchaseTimeline: "30-60 Days",
    assignedBy: "Admin Manager",
    assignmentDate: "2026-06-25 09:15 AM",
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "New",
        currentStage: "Contacted",
        date: "2026-06-25 11:30 AM",
        changedBy: "Meera Nair",
        reason: "Initial phone call completed, customer requested pricing over WhatsApp",
        timeSpent: "2 hours"
      },
      {
        previousStage: "None",
        currentStage: "New",
        date: "2026-06-25 09:15 AM",
        changedBy: "Meta Ads API",
        reason: "Lead generated via Facebook Lead Form",
        timeSpent: "2 hours"
      }
    ],
    followupHistory: [
      {
        id: "F-1",
        status: "Completed",
        type: "Call",
        priority: "Low",
        scheduledDate: "2026-06-25 11:30 AM",
        completedDate: "2026-06-25 11:30 AM",
        conductedBy: "Meera Nair",
        createdBy: "Meta Ads Router",
        scheduledBy: "Meta Ads Router",
        completedBy: "Meera Nair",
        reminderTime: "15 minutes before",
        purpose: "Initial callback",
        duration: "10 mins",
        leadTemperature: "Warm",
        nextRecommendedAction: "WhatsApp Grandeur layout brochure",
        outcome: "Spoke to Priya. She saw our FB ad for Vasiyam Grandeur. Requested pricing catalog.",
        customerResponse: "Positive",
        lastModified: "2026-06-25 11:30 by Meera Nair",
        nextFollowupId: "F-2"
      },
      {
        id: "F-2",
        status: "Scheduled",
        type: "Call",
        priority: "Medium",
        scheduledDate: "2026-07-02 11:00", // Scheduled for Today (current date: 2026-07-02)
        conductedBy: "Meera Nair",
        createdBy: "Meera Nair",
        scheduledBy: "Meera Nair",
        reminder: "Call to confirm catalog review",
        reminderTime: "15 minutes before",
        purpose: "Catalog follow-up notes"
      }
    ],
    comments: [
      {
        id: "C-1",
        content: "Shared layout files for Grandeur 2BHK on WhatsApp. Customer liked the layout. Waiting for spouse feedback.",
        type: "RM Note",
        date: "2026-06-25 11:45 AM",
        author: "Meera Nair"
      }
    ],
    negotiation: {
      initialOfferedPrice: 6500000,
      customerExpectedPrice: 6000000,
      counterOffers: [],
      approvedDiscounts: [],
      status: "Not Started"
    },
    activities: [
      {
        id: "A-1",
        type: "Lead Created",
        description: "Enquiry submitted via Facebook Ads Lead Forms",
        date: "2026-06-25 09:15 AM",
        performedBy: "Meta Ads Integration",
        role: "System Integration",
        relatedStage: "New"
      },
      {
        id: "A-2",
        type: "RM Assigned",
        description: "Assigned manager Meera Nair",
        date: "2026-06-25 09:20 AM",
        performedBy: "System Router",
        role: "System Router",
        relatedStage: "New"
      },
      {
        id: "A-3",
        type: "Status Changed",
        description: "Stage shifted from New to Contacted",
        date: "2026-06-25 11:30 AM",
        performedBy: "Meera Nair",
        role: "Relationship Manager",
        relatedStage: "Contacted"
      },
      {
        id: "A-4",
        type: "WhatsApp Sent",
        description: "Pricing sheet and floor layouts shared on WhatsApp",
        date: "2026-06-25 11:40 AM",
        performedBy: "Meera Nair",
        role: "Relationship Manager",
        relatedStage: "Contacted"
      }
    ],
    documents: [
      {
        id: "D-1",
        name: "Vasiyam_Grandeur_Layouts.pdf",
        type: "Brochure",
        url: "#",
        size: "3.1 MB",
        uploadDate: "2026-06-25 09:25 AM",
        uploadedBy: "Meera Nair"
      }
    ],
    internalNotes: [],
    auditInfo: {
      createdBy: "Meta Ads Router",
      createdOn: "2026-06-25 09:15 AM",
      lastModifiedBy: "Meera Nair",
      lastModifiedOn: "2026-06-25 11:45 AM"
    }
  },
  {
    id: "LD-2413",
    address: "Flat 4B, Ruby Block, Velachery",
    city: "Chennai",
    preferredCommunication: "WhatsApp",
    preferredContactTime: "Morning (9 AM - 12 PM)",
    propertyType: "3BHK Apartment",
    expectedPurchaseTimeline: "Within 3 months",
    assignedBy: "Admin Manager",
    assignmentDate: "2026-06-25 08:00 AM",
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "Contacted",
        currentStage: "Qualified",
        date: "2026-06-25 10:45 AM",
        changedBy: "Divya Sharma",
        reason: "Financing checked, pre-approval letter provided. Criteria match confirmed.",
        timeSpent: "2 hours"
      },
      {
        previousStage: "New",
        currentStage: "Contacted",
        date: "2026-06-25 08:30 AM",
        changedBy: "Divya Sharma",
        reason: "First follow-up call, lead responded and shared requirements",
        timeSpent: "30 mins"
      },
      {
        previousStage: "None",
        currentStage: "New",
        date: "2026-06-25 08:00 AM",
        changedBy: "WhatsApp API",
        reason: "Lead generated via WhatsApp query",
        timeSpent: "30 mins"
      }
    ],
    followupHistory: [
      {
        id: "F-1",
        status: "Completed",
        type: "Call",
        priority: "Medium",
        scheduledDate: "2026-06-25 08:30 AM",
        completedDate: "2026-06-25 08:30 AM",
        conductedBy: "Divya Sharma",
        createdBy: "WhatsApp API",
        scheduledBy: "WhatsApp API",
        completedBy: "Divya Sharma",
        reminderTime: "15 minutes before",
        purpose: "Initial call verification",
        duration: "5 mins",
        leadTemperature: "Warm",
        nextRecommendedAction: "Collect HDFC loan pre-approval proof",
        outcome: "Verified income levels and budget.",
        customerResponse: "Positive",
        lastModified: "2026-06-25 08:30 by Divya Sharma",
        nextFollowupId: "F-2"
      },
      {
        id: "F-2",
        status: "Scheduled",
        type: "WhatsApp",
        priority: "Critical",
        scheduledDate: "2026-06-28 16:00", // Scheduled in the PAST (Overdue)
        conductedBy: "Divya Sharma",
        createdBy: "Divya Sharma",
        scheduledBy: "Divya Sharma",
        reminder: "Verify pre-approval loan letter",
        reminderTime: "1 hour before",
        purpose: "Document checklist"
      }
    ],
    comments: [
      {
        id: "C-1",
        content: "Qualified prospect. HDFC pre-approved loan letter of 75L. Seeking premium wood work package. Will pay 10L cash down payment.",
        type: "RM Note",
        date: "2026-06-25 10:50 AM",
        author: "Divya Sharma"
      }
    ],
    negotiation: {
      initialOfferedPrice: 8800000,
      customerExpectedPrice: 8300000,
      counterOffers: [
        {
          offeredBy: "Customer",
          amount: 8300000,
          date: "2026-06-25 10:45 AM",
          remark: "Expected final price with standard woodwork included."
        }
      ],
      approvedDiscounts: [],
      status: "Ongoing"
    },
    activities: [
      {
        id: "A-1",
        type: "Lead Created",
        description: "WhatsApp ping initiated lead record",
        date: "2026-06-25 08:00 AM",
        performedBy: "System",
        role: "System Integration",
        relatedStage: "New"
      },
      {
        id: "A-2",
        type: "Status Changed",
        description: "Shifted to Contacted stage",
        date: "2026-06-25 08:30 AM",
        performedBy: "Divya Sharma",
        role: "Relationship Manager",
        relatedStage: "Contacted"
      },
      {
        id: "A-3",
        type: "Status Changed",
        description: "Qualified as lead criteria matches and pre-approved loan letter is provided",
        date: "2026-06-25 10:45 AM",
        performedBy: "Divya Sharma",
        role: "Relationship Manager",
        relatedStage: "Qualified"
      }
    ],
    documents: [
      {
        id: "D-1",
        name: "HDFC_PreApproved_Letter.pdf",
        type: "Customer Document",
        url: "#",
        size: "1.2 MB",
        uploadDate: "2026-06-25 10:42 AM",
        uploadedBy: "Divya Sharma"
      }
    ],
    internalNotes: [
      {
        id: "IN-1",
        content: "Manager discount approval needed. They are asking for a 5L discount. Margin is high enough if we exclude standard wood modular closets.",
        author: "Divya Sharma",
        date: "2026-06-25 10:55 AM"
      }
    ],
    auditInfo: {
      createdBy: "WhatsApp Hook",
      createdOn: "2026-06-25 08:00 AM",
      lastModifiedBy: "Divya Sharma",
      lastModifiedOn: "2026-06-25 10:55 AM"
    }
  },
  {
    id: "LD-2412",
    address: "Old No. 12, New No. 24, Kamaraj Avenue, Adyar",
    city: "Chennai",
    preferredCommunication: "Meeting",
    preferredContactTime: "Morning (10 AM - 12 PM)",
    propertyType: "Duplex Villa",
    expectedPurchaseTimeline: "3-6 months",
    assignedBy: "Meera Nair (Referral Code)",
    assignmentDate: "2026-06-24 11:00 AM",
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "Qualified",
        currentStage: "Site Visit",
        date: "2026-06-24 03:00 PM",
        changedBy: "Suresh Pillai",
        reason: "Site visit booked for duplex apartments at Vasiyam Enclave",
        timeSpent: "Current"
      },
      {
        previousStage: "New",
        currentStage: "Qualified",
        date: "2026-06-24 11:30 AM",
        changedBy: "Suresh Pillai",
        reason: "Customer budget and premium location match, referral validated",
        timeSpent: "3.5 hours"
      },
      {
        previousStage: "None",
        currentStage: "New",
        date: "2026-06-24 11:00 AM",
        changedBy: "Suresh Pillai",
        reason: "Referred by Vasiyam customer #C-901",
        timeSpent: "30 mins"
      }
    ],
    followupHistory: [
      {
        id: "F-1",
        status: "Completed",
        type: "Call",
        priority: "High",
        scheduledDate: "2026-06-24 11:30 AM",
        completedDate: "2026-06-24 11:30 AM",
        conductedBy: "Suresh Pillai",
        createdBy: "Referral Code",
        scheduledBy: "Referral Code",
        completedBy: "Suresh Pillai",
        reminderTime: "15 minutes before",
        purpose: "Initial call verification",
        duration: "12 mins",
        leadTemperature: "Hot",
        nextRecommendedAction: "Book luxury cab pickup for Enclave duplex tour",
        outcome: "Verified referral. Anitha is looking for a premium duplex flat.",
        customerResponse: "Positive",
        lastModified: "2026-06-24 11:30 by Suresh Pillai"
      },
      {
        id: "F-2",
        status: "Scheduled",
        type: "Meeting",
        priority: "Critical",
        scheduledDate: "2026-07-02 15:30", // Scheduled for Today (current date: 2026-07-02)
        conductedBy: "Suresh Pillai",
        createdBy: "Suresh Pillai",
        scheduledBy: "Suresh Pillai",
        reminder: "Provide luxury cab pick-up service.",
        reminderTime: "2 hours before",
        purpose: "Show options at site"
      }
    ],
    comments: [
      {
        id: "C-1",
        content: "Needs high-end luxury duplex. Referral by existing resident Anand Krishnan. Treat as VIP prospect. Pick up scheduled with RM.",
        type: "Manager Note",
        date: "2026-06-24 04:00 PM",
        author: "Meera Nair"
      }
    ],
    negotiation: {
      initialOfferedPrice: 12500000,
      customerExpectedPrice: 11800000,
      counterOffers: [],
      approvedDiscounts: [],
      status: "Not Started"
    },
    activities: [
      {
        id: "A-1",
        type: "Lead Created",
        description: "Created via referral code C-901",
        date: "2026-06-24 11:00 AM",
        performedBy: "Suresh Pillai",
        role: "Relationship Manager",
        relatedStage: "New"
      },
      {
        id: "A-2",
        type: "Site Visit Scheduled",
        description: "Site visit booked for duplex apartment",
        date: "2026-06-24 03:00 PM",
        performedBy: "Suresh Pillai",
        role: "Relationship Manager",
        relatedStage: "Site Visit"
      }
    ],
    documents: [
      {
        id: "D-1",
        name: "Enclave_Duplex_Brochure.pdf",
        type: "Brochure",
        url: "#",
        size: "5.4 MB",
        uploadDate: "2026-06-24 11:05 AM",
        uploadedBy: "Suresh Pillai"
      }
    ],
    internalNotes: [
      {
        id: "IN-1",
        content: "RM will accompany customer in the sales vehicle. Keep standard presentation packets and refreshments ready.",
        author: "Suresh Pillai",
        date: "2026-06-24 03:10 PM"
      }
    ],
    auditInfo: {
      createdBy: "Suresh Pillai",
      createdOn: "2026-06-24 11:00 AM",
      lastModifiedBy: "Meera Nair",
      lastModifiedOn: "2026-06-24 04:00 PM"
    }
  },
  {
    id: "LD-2411",
    address: "Block 10, Cloud 9 Villas, OMR Sholinganallur",
    city: "Chennai",
    preferredCommunication: "Call",
    preferredContactTime: "Afternoon (3 PM - 6 PM)",
    propertyType: "2BHK Apartment",
    expectedPurchaseTimeline: "Immediate (Within 30 days)",
    assignedBy: "Admin Manager",
    assignmentDate: "2026-06-24 09:00 AM",
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "Site Visit",
        currentStage: "Negotiation",
        date: "2026-06-25 11:00 AM",
        changedBy: "Arun Kumar",
        reason: "Price discussion started. Customer demanded waiver of registration charges.",
        timeSpent: "Current"
      },
      {
        previousStage: "Qualified",
        currentStage: "Site Visit",
        date: "2026-06-24 02:00 PM",
        changedBy: "Arun Kumar",
        reason: "Site visit completed and customer chose block B unit 203",
        timeSpent: "21 hours"
      },
      {
        previousStage: "New",
        currentStage: "Qualified",
        date: "2026-06-24 10:00 AM",
        changedBy: "Arun Kumar",
        reason: "Spoke to client, confirmed requirements and budget.",
        timeSpent: "1 hour"
      },
      {
        previousStage: "None",
        currentStage: "New",
        date: "2026-06-24 09:00 AM",
        changedBy: "Walk-in Desk",
        reason: "Walk-in client register",
        timeSpent: "1 hour"
      }
    ],
    followupHistory: [
      {
        id: "F-1",
        status: "Completed",
        type: "Site Visit",
        priority: "High",
        scheduledDate: "2026-06-24 14:00",
        completedDate: "2026-06-24 14:00",
        conductedBy: "Arun Kumar",
        createdBy: "Walk-in Desk",
        scheduledBy: "Walk-in Desk",
        completedBy: "Arun Kumar",
        reminderTime: "1 hour before",
        purpose: "Site visit conduct",
        duration: "45 mins",
        leadTemperature: "Hot",
        nextRecommendedAction: "Propose covered car parking waiver offer",
        outcome: "Conducted site visit. Vikram liked Grandeur unit 203.",
        customerResponse: "Positive",
        lastModified: "2026-06-24 14:00 by Arun Kumar"
      },
      {
        id: "F-2",
        status: "Scheduled",
        type: "Call",
        priority: "Critical",
        scheduledDate: "2026-07-06 14:00", // Scheduled future date (Upcoming)
        conductedBy: "Arun Kumar",
        createdBy: "Arun Kumar",
        scheduledBy: "Arun Kumar",
        reminder: "Verify if discount approved is accepted",
        reminderTime: "15 minutes before",
        purpose: "Bargain rate closure",
        notes: "Wants parking lot promotional waiver"
      }
    ],
    comments: [
      {
        id: "C-1",
        content: "Client is extremely price-sensitive but highly motivated to close this week. Recommended a 2.5% discount waiver to move to booking stage.",
        type: "RM Note",
        date: "2026-06-25 11:15 AM",
        author: "Arun Kumar"
      }
    ],
    negotiation: {
      initialOfferedPrice: 5200000,
      customerExpectedPrice: 4800000,
      counterOffers: [
        {
          offeredBy: "Customer",
          amount: 4800000,
          date: "2026-06-25 11:00 AM",
          remark: "Final offer with registration included."
        },
        {
          offeredBy: "RM",
          amount: 5000000,
          date: "2026-06-25 11:10 AM",
          remark: "Counter offered 50L (excl. registration) with free covered parking space."
        }
      ],
      approvedDiscounts: [],
      status: "Ongoing"
    },
    activities: [
      {
        id: "A-1",
        type: "Lead Created",
        description: "Created via Walk-in reception desk",
        date: "2026-06-24 09:00 AM",
        performedBy: "Walk-in Desk",
        role: "Receptionist",
        relatedStage: "New"
      },
      {
        id: "A-2",
        type: "Site Visit Completed",
        description: "Site visit conducted for Vasiyam Grandeur Unit 203",
        date: "2026-06-24 02:00 PM",
        performedBy: "Arun Kumar",
        role: "Relationship Manager",
        relatedStage: "Site Visit"
      },
      {
        id: "A-3",
        type: "Negotiation Started",
        description: "Price bargaining log initiated",
        date: "2026-06-25 11:00 AM",
        performedBy: "Arun Kumar",
        role: "Relationship Manager",
        relatedStage: "Negotiation"
      }
    ],
    documents: [
      {
        id: "D-1",
        name: "Grandeur_Unit203_SitePhoto.jpg",
        type: "Site Visit Photo",
        url: "#",
        size: "1.8 MB",
        uploadDate: "2026-06-24 02:30 PM",
        uploadedBy: "Arun Kumar"
      }
    ],
    internalNotes: [
      {
        id: "IN-1",
        content: "If they close booking by June 30th, we can offer the parking lot promotional waiver which saves them 1.5L.",
        author: "Arun Kumar",
        date: "2026-06-25 11:20 AM"
      }
    ],
    auditInfo: {
      createdBy: "Reception Desk",
      createdOn: "2026-06-24 09:00 AM",
      lastModifiedBy: "Arun Kumar",
      lastModifiedOn: "2026-06-25 11:20 AM"
    }
  },
  {
    id: "LD-2410",
    address: "Plot 89, Sector 2, Adyar",
    city: "Chennai",
    preferredCommunication: "Call",
    preferredContactTime: "Morning (9 AM - 12 PM)",
    propertyType: "3BHK Apartment",
    expectedPurchaseTimeline: "Within 6 months",
    assignedBy: "Admin Manager",
    assignmentDate: "2026-06-24 10:00 AM",
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "None",
        currentStage: "New",
        date: "2026-06-24 10:00 AM",
        changedBy: "99acres API Parser",
        reason: "Lead generated via 99acres integration",
        timeSpent: "Current"
      }
    ],
    followupHistory: [],
    comments: [],
    negotiation: {
      initialOfferedPrice: 7200000,
      customerExpectedPrice: 6800000,
      counterOffers: [],
      approvedDiscounts: [],
      status: "Not Started"
    },
    activities: [
      {
        id: "A-1",
        type: "Lead Created",
        description: "Enquiry pulled from 99acres property portal",
        date: "2026-06-24 10:00 AM",
        performedBy: "99acres Integration",
        role: "System Integration",
        relatedStage: "New"
      }
    ],
    documents: [],
    internalNotes: [],
    auditInfo: {
      createdBy: "99acres Integration",
      createdOn: "2026-06-24 10:00 AM",
      lastModifiedBy: "System",
      lastModifiedOn: "2026-06-24 10:00 AM"
    }
  },
  {
    id: "LD-2409",
    address: "Villa 3, Signature Meadows, Velachery",
    city: "Chennai",
    preferredCommunication: "Email",
    preferredContactTime: "Afternoon (1 PM - 4 PM)",
    propertyType: "Premium Penthouse",
    expectedPurchaseTimeline: "3-6 months",
    assignedBy: "Admin Manager",
    assignmentDate: "2026-06-23 02:00 PM",
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "New",
        currentStage: "Contacted",
        date: "2026-06-23 04:30 PM",
        changedBy: "Divya Sharma",
        reason: "Called, spoke to customer, sent details of Sky Heights via email",
        timeSpent: "Current"
      },
      {
        previousStage: "None",
        currentStage: "New",
        date: "2026-06-23 02:00 PM",
        changedBy: "Google Ads Integration",
        reason: "Lead generated via AdWords landing page form",
        timeSpent: "2.5 hours"
      }
    ],
    followupHistory: [
      {
        id: "F-1",
        status: "Completed",
        type: "Call",
        priority: "Low",
        scheduledDate: "2026-06-23 16:30",
        completedDate: "2026-06-23 16:30",
        conductedBy: "Divya Sharma",
        createdBy: "Google Ads API",
        scheduledBy: "Google Ads API",
        completedBy: "Divya Sharma",
        reminderTime: "15 minutes before",
        purpose: "Initial call check",
        duration: "4 mins",
        leadTemperature: "Cold",
        nextRecommendedAction: "Send project specification email",
        outcome: "Customer is searching for a top floor penthouse. Budget is flexible.",
        customerResponse: "Positive",
        lastModified: "2026-06-23 16:30 by Divya Sharma"
      }
    ],
    comments: [
      {
        id: "C-1",
        content: "Requires higher floor penthouse with double height ceiling. Sent brochure and floor plans for Sky Heights block C top level.",
        type: "RM Note",
        date: "2026-06-23 04:50 PM",
        author: "Divya Sharma"
      }
    ],
    negotiation: {
      initialOfferedPrice: 16500000,
      customerExpectedPrice: 15500000,
      counterOffers: [],
      approvedDiscounts: [],
      status: "Not Started"
    },
    activities: [
      {
        id: "A-1",
        type: "Lead Created",
        description: "Enquiry submitted on Google Ads landing page",
        date: "2026-06-23 02:00 PM",
        performedBy: "Google Ads API",
        role: "System Integration",
        relatedStage: "New"
      },
      {
        id: "A-2",
        type: "Status Changed",
        description: "Shifted to Contacted",
        date: "2026-06-23 04:30 PM",
        performedBy: "Divya Sharma",
        role: "Relationship Manager",
        relatedStage: "Contacted"
      }
    ],
    documents: [
      {
        id: "D-1",
        name: "Sky_Heights_PenthouseSpecs.pdf",
        type: "Brochure",
        url: "#",
        size: "6.8 MB",
        uploadDate: "2026-06-23 04:40 PM",
        uploadedBy: "Divya Sharma"
      }
    ],
    internalNotes: [],
    auditInfo: {
      createdBy: "Google Ads API",
      createdOn: "2026-06-23 02:00 PM",
      lastModifiedBy: "Divya Sharma",
      lastModifiedOn: "2026-06-23 04:50 PM"
    }
  }
];

export function generateDefaultDetails(lead: any): LeadDetails {
  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  return {
    id: lead.id,
    address: "",
    city: lead.preferredLocation || "Chennai",
    preferredCommunication: "Call",
    preferredContactTime: "Anytime",
    propertyType: "Apartment",
    expectedPurchaseTimeline: "3-6 months",
    assignedBy: "Admin System",
    assignmentDate: nowStr,
    transferHistory: [],
    stageHistory: [
      {
        previousStage: "None",
        currentStage: lead.stage,
        date: nowStr,
        changedBy: "System",
        reason: "Lead created and registered",
        timeSpent: "Current"
      }
    ],
    followupHistory: [],
    comments: lead.remarks ? [
      {
        id: "C-init",
        content: lead.remarks,
        type: "RM Note",
        date: nowStr,
        author: lead.rm !== "Unassigned" ? lead.rm : "System"
      }
    ] : [],
    negotiation: {
      initialOfferedPrice: lead.budget || 5000000,
      customerExpectedPrice: lead.budget ? Math.round(lead.budget * 0.95) : 4750000,
      counterOffers: [],
      approvedDiscounts: [],
      status: "Not Started"
    },
    activities: [
      {
        id: "A-init",
        type: "Lead Created",
        description: lead.lastActivityDesc || "Lead created",
        date: nowStr,
        performedBy: "System",
        role: "System Integration",
        relatedStage: lead.stage
      }
    ],
    documents: [],
    internalNotes: [],
    auditInfo: {
      createdBy: "CRM User",
      createdOn: nowStr,
      lastModifiedBy: "CRM User",
      lastModifiedOn: nowStr
    }
  };
}
