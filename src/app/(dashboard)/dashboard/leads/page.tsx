"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Edit2,
  Trash2,
  UserCheck,
  UserMinus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Calendar,
  Building,
  Target,
  DollarSign,
  AlertTriangle,
  Briefcase,
  Sparkles,
  Gem,
  ShieldCheck,
  ChevronDown,
  Globe,
  Home,
  MessageSquare,
  Phone,
  Megaphone,
  Share2,
  Compass,
  HelpCircle,
  Star,
  Mail,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Define TypeScript interfaces for our Lead model
interface Lead {
  id: string;
  name: string;
  mobile: string;
  secondaryMobile?: string;
  email: string;
  source: string;
  budget: number; // In INR (e.g. 7500000 for 75L)
  project: string;
  rm: string; // "Arun Kumar" | "Meera Nair" | "Divya Sharma" | "Suresh Pillai" | "Unassigned"
  score: number; // 1 to 100
  stage: "New" | "Contacted" | "Qualified" | "Site Visit" | "Negotiation" | "Booked" | "Lost";
  lastActivityTime: string; // e.g. "2 mins ago"
  lastActivityDesc: string; // e.g. "Lead created"
  nextFollowupText: string; // e.g. "Today, 3:00 PM"
  createdDate: string; // ISO date string
  preferredLocation?: string;
  remarks?: string;
}

// Initial mockup database matching the user's screenshot mockup EXACTLY
const initialMockLeads: Lead[] = [
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

// Master reference arrays for dropdowns and select lists
const relationshipManagers = ["Arun Kumar", "Meera Nair", "Divya Sharma", "Suresh Pillai", "Unassigned"];
const leadSources = ["Website", "99acres", "MagicBricks", "Facebook Ads", "Meta Ads", "Google Ads", "Housing.com", "Referral", "Walk-in", "WhatsApp", "Instagram", "Phone Call"];
const projectsList = ["Vasiyam Enclave", "Vasiyam Grandeur", "Vasiyam Meadows", "The Residency", "Sky Heights"];
const leadStages = ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Booked", "Lost"];

// Local custom SVG icons for social channels (avoiding lucide version mismatch)
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="#1877F2"
    {...props}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
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
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="#25D366"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24h.057zm5.952-3.666l.328.195c1.7.1 3.32-.4 4.72-1.25l.338-.2 3.51.92-.938-3.42.23-.37c.93-1.48 1.42-3.19 1.42-4.94.002-5.18-4.17-9.4-9.3-9.4-4.51 0-8.6 3.73-9.28 8.12-.46 2.94.41 5.86 2.38 8.01l.25.28-1.5 5.48 5.61-1.47z" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
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
    width="13"
    height="13"
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
      return (props: any) => <Globe {...props} />;
    case "99acres":
      return (props: any) => <Acres99Icon {...props} />;
    case "MagicBricks":
    case "Housing.com":
      return (props: any) => <Home {...props} />;
    case "WhatsApp":
      return (props: any) => <WhatsAppIcon {...props} />;
    case "Phone Call":
      return (props: any) => <Phone {...props} />;
    case "Instagram":
      return (props: any) => <InstagramIcon {...props} />;
    case "Facebook Ads":
    case "Meta Ads":
      return (props: any) => <FacebookIcon {...props} />;
    case "Google Ads":
      return (props: any) => <GoogleIcon {...props} />;
    case "Referral":
      return (props: any) => <Share2 {...props} />;
    case "Walk-in":
      return (props: any) => <Compass {...props} />;
    default:
      return (props: any) => <HelpCircle {...props} />;
  }
};

// Generates avatar text initials (e.g. "VN" for "Venkatesh Nair")
const getInitials = (name: string): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

// Selects dynamic color based on string hash to persist color per individual
const getAvatarColorClass = (name: string) => {
  const colors = [
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800",
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800",
    "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-200 dark:border-indigo-800",
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800",
    "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/40 dark:text-pink-200 dark:border-pink-800",
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800",
    "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200 dark:border-teal-800",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Selects RM specific avatars colors
const getRMColorClass = (rm: string) => {
  switch (rm) {
    case "Arun Kumar":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
    case "Meera Nair":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
    case "Divya Sharma":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900";
    case "Suresh Pillai":
      return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
  }
};

const rmPhotos: Record<string, string> = {
  "Arun Kumar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
  "Meera Nair": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
  "Divya Sharma": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces",
  "Suresh Pillai": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
};

// Circular score indicators styling helper
const getScoreCircleColor = (score: number) => {
  if (score >= 80) return "text-emerald-500 border-emerald-500 bg-emerald-50/20";
  if (score >= 70) return "text-orange-500 border-orange-500 bg-orange-50/20";
  if (score >= 50) return "text-amber-500 border-amber-500 bg-amber-50/20";
  return "text-red-500 border-red-500 bg-red-50/20";
};

// Inline SVG Sparklines for KPI Cards
const Sparkline = ({ color, points, index }: { color: string; points: [number, number][]; index: number }) => {
  const getSharpPath = (pts: [number, number][]) => {
    if (pts.length === 0) return "";
    return `M ${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(([x, y]) => `L ${x} ${y}`).join(" ");
  };

  const linePath = getSharpPath(points);
  const fillPath = `${linePath} L 100 30 L 0 30 Z`;

  return (
    <div className="w-full h-8 mt-3.5 relative overflow-visible">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
        <defs>
          <linearGradient id={`sparkline-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gradient Fill */}
        <motion.path
          d={fillPath}
          fill={`url(#sparkline-gradient-${index})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
        />

        {/* Glowing Shadow line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          className="opacity-15 blur-[1px]"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.05 }}
        />

        {/* Main Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="square"
          strokeLinejoin="miter"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.05 }}
        />

        {/* Vertices/Dots */}
        {points.map(([x, y], idx) => {
          const isLast = idx === points.length - 1;
          return (
            <g key={idx}>
              {isLast && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill={color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.4, scale: [1, 2, 1] }}
                  transition={{
                    opacity: { delay: index * 0.05 + 0.7, duration: 0.2 },
                    scale: {
                      delay: index * 0.05 + 0.7,
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r="1.6"
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="0.8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.05 + 0.4 + idx * 0.05,
                  duration: 0.2,
                  type: "spring",
                  stiffness: 300
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Stage badge layout helper
const getStageBadgeStyles = (stage: Lead["stage"]) => {
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

// Custom Dropdowns layout selector
interface CustomDropdownProps {
  label: string;
  value: string;
  options: string[];
  icon: React.ComponentType<any>;
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

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-1.5 py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D2E1D] rounded-xl text-xs text-[#1F1F1F] dark:text-white hover:border-[#C59A2C] focus:outline-none transition-all text-left shadow-sm select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon size={13} className="text-gray-400 dark:text-[#C59A2C] shrink-0" />
          <span className="truncate text-gray-500 dark:text-gray-400">
            {label === "Date Range" || label === "Score" || label === "Filters" ? "" : `${label}: `}
            <span className="text-[#1F1F1F] dark:text-white font-bold">{value}</span>
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
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left py-2 px-3 text-xs flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                  opt === value ? "text-primary dark:text-[#C59A2C] font-black bg-primary/5 dark:bg-white/5" : "text-gray-700 dark:text-gray-300"
                )}
              >
                <span className="truncate">{opt}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialMockLeads);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; message: string }[]>([]);

  // Filter Bar states
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [filterProject, setFilterProject] = useState("All Projects");
  const [filterRM, setFilterRM] = useState("All RMs");
  const [filterScoreRange, setFilterScoreRange] = useState("Lead Score");
  const [filterCreatedDate, setFilterCreatedDate] = useState("This Month");
  const [sortBy, setSortBy] = useState("newest");

  // Modals visibility
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [bulkAssignTarget, setBulkAssignTarget] = useState<string>("");
  const [rowActionsOpenId, setRowActionsOpenId] = useState<string | null>(null);

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

  // Listen to the custom global Header refresh event
  useEffect(() => {
    const handleRefreshEvent = () => {
      triggerPageRefresh();
    };
    window.addEventListener("leads-refresh", handleRefreshEvent);
    return () => {
      window.removeEventListener("leads-refresh", handleRefreshEvent);
    };
  }, []);

  const triggerPageRefresh = () => {
    setIsLoading(true);
    setRowActionsOpenId(null);
    setTimeout(() => {
      setIsLoading(false);
      showToast("success", "Lead database refreshed successfully.");
    }, 800);
  };

  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Re-calculate KPI values based on state
  const summaryKPIs = useMemo(() => {
    const total = 2415 + (leads.length - initialMockLeads.length);
    const newToday = 842 + leads.filter((l) => l.createdDate === "2026-06-25" && l.stage === "New").length;
    const assigned = 1156 + leads.filter((l) => l.rm !== "Unassigned" && !initialMockLeads.some((il) => il.id === l.id)).length;
    const unassigned = 128 + leads.filter((l) => l.rm === "Unassigned" && !initialMockLeads.some((il) => il.id === l.id)).length;
    const qualified = 312 + leads.filter((l) => l.stage === "Qualified" && !initialMockLeads.some((il) => il.id === l.id)).length;

    return { total, newToday, assigned, unassigned, qualified };
  }, [leads]);

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
    let typedValue: any = value;
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
    setFilterStatus("All Status");
    setFilterSource("All Sources");
    setFilterProject("All Projects");
    setFilterRM("All RMs");
    setFilterScoreRange("Lead Score");
    setFilterCreatedDate("This Month");
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
          l.email.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q) ||
          l.project.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "All Status") {
      result = result.filter((l) => l.stage === filterStatus);
    }

    if (filterRM !== "All RMs") {
      result = result.filter((l) => l.rm === filterRM);
    }

    if (filterSource !== "All Sources") {
      result = result.filter((l) => l.source === filterSource);
    }

    if (filterProject !== "All Projects") {
      result = result.filter((l) => l.project === filterProject);
    }

    if (filterScoreRange !== "Lead Score") {
      if (filterScoreRange === "Hot (80+)") {
        result = result.filter((l) => l.score >= 80);
      } else if (filterScoreRange === "Warm (50-79)") {
        result = result.filter((l) => l.score >= 50 && l.score < 80);
      } else if (filterScoreRange === "Cold (<50)") {
        result = result.filter((l) => l.score < 50);
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
  }, [leads, searchQuery, filterStatus, filterRM, filterSource, filterProject, filterScoreRange, filterCreatedDate, sortBy]);

  // Paginated Rows
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return processedLeads.slice(startIndex, startIndex + rowsPerPage);
  }, [processedLeads, currentPage, rowsPerPage]);

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

      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. METRICS GRID & QUICK ACTIONS */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Metric Cards Carousel */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1: Total Leads */}
          <div className="bg-white dark:bg-[#0D2E1D] p-5 rounded-2xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_1.5px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[155px]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-sm">
                <Users size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold tracking-wider text-gray-450 dark:text-gray-400 uppercase leading-none">Total Leads</span>
                <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-white mt-2 leading-none">
                  {summaryKPIs.total.toLocaleString()}
                </h3>
                <div className="flex items-center gap-0.5 mt-2.5 text-[9.5px] text-[#16A34A] font-bold leading-none">
                  <TrendingUp size={10} className="shrink-0" />
                  <span>12% <span className="text-gray-400 font-normal ml-0.5">vs last 30 days</span></span>
                </div>
              </div>
            </div>
            <Sparkline index={0} color="#16A34A" points={[[0, 25], [11, 18], [22, 20], [33, 10], [44, 22], [55, 17], [66, 16], [77, 8], [88, 15], [100, 7]]} />
          </div>

          {/* Card 2: New Leads */}
          <div className="bg-white dark:bg-[#0D2E1D] p-5 rounded-2xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_1.5px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[155px]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold tracking-wider text-gray-450 dark:text-gray-400 uppercase leading-none">New Leads</span>
                <h3 className="text-xl font-black text-[#1F1F1F] dark:text-white mt-2 leading-none">
                  {summaryKPIs.newToday.toLocaleString()}
                </h3>
                <div className="flex items-center gap-0.5 mt-2.5 text-[9.5px] text-[#16A34A] font-bold leading-none">
                  <TrendingUp size={10} className="shrink-0" />
                  <span>8% <span className="text-gray-400 font-normal ml-0.5">vs last 30 days</span></span>
                </div>
              </div>
            </div>
            <Sparkline index={1} color="#2563EB" points={[[0, 28], [11, 20], [22, 21], [33, 10], [44, 22], [55, 18], [66, 17], [77, 8], [88, 14], [100, 5]]} />
          </div>

          {/* Card 3: Assigned Leads */}
          <div className="bg-white dark:bg-[#0D2E1D] p-5 rounded-2xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_1.5px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[155px]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#C59A2C] dark:text-[#C59A2C] flex items-center justify-center shrink-0 shadow-sm">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold tracking-wider text-gray-450 dark:text-gray-400 uppercase leading-none">Assigned Leads</span>
                <h3 className="text-xl font-black text-[#1F1F1F] dark:text-white mt-2 leading-none">
                  {summaryKPIs.assigned.toLocaleString()}
                </h3>
                <div className="flex items-center gap-0.5 mt-2.5 text-[9.5px] text-[#16A34A] font-bold leading-none">
                  <TrendingUp size={10} className="shrink-0" />
                  <span>10% <span className="text-gray-400 font-normal ml-0.5">vs last 30 days</span></span>
                </div>
              </div>
            </div>
            <Sparkline index={2} color="#C59A2C" points={[[0, 27], [10, 20], [20, 16], [30, 18], [40, 8], [50, 22], [60, 17], [70, 15], [80, 6], [90, 16], [100, 11]]} />
          </div>

          {/* Card 4: Unassigned Leads */}
          <div className="bg-white dark:bg-[#0D2E1D] p-5 rounded-2xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_1.5px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[155px]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-sm">
                <UserMinus size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold tracking-wider text-gray-450 dark:text-gray-400 uppercase leading-none">Unassigned Leads</span>
                <h3 className="text-xl font-black text-[#1F1F1F] dark:text-white mt-2 leading-none">
                  {summaryKPIs.unassigned.toLocaleString()}
                </h3>
                <div className="flex items-center gap-0.5 mt-2.5 text-[9.5px] text-red-500 font-bold leading-none">
                  <TrendingDown size={10} className="shrink-0" />
                  <span>5% <span className="text-gray-400 font-normal ml-0.5">vs last 30 days</span></span>
                </div>
              </div>
            </div>
            <Sparkline index={3} color="#8B5CF6" points={[[0, 27], [9, 20], [18, 16], [27, 18], [36, 8], [45, 22], [54, 17], [63, 17], [72, 14], [81, 6], [90, 15], [100, 10]]} />
          </div>

          {/* Card 5: Follow-up Needed */}
          <div className="bg-white dark:bg-[#0D2E1D] p-5 rounded-2xl border border-[#E8E2D6] dark:border-white/10 shadow-[0_1.5px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[155px]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 flex items-center justify-center shrink-0 shadow-sm">
                <Clock size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold tracking-wider text-gray-450 dark:text-gray-400 uppercase leading-none">Follow-up Needed</span>
                <h3 className="text-xl font-black text-[#1F1F1F] dark:text-white mt-2 leading-none">
                  {summaryKPIs.qualified.toLocaleString()}
                </h3>
                <div className="flex items-center gap-0.5 mt-2.5 text-[9.5px] text-[#16A34A] font-bold leading-none">
                  <TrendingUp size={10} className="shrink-0" />
                  <span>15% <span className="text-gray-400 font-normal ml-0.5">vs last 30 days</span></span>
                </div>
              </div>
            </div>
            <Sparkline index={4} color="#EF4444" points={[[0, 28], [9, 21], [18, 16], [27, 18], [36, 8], [45, 22], [54, 18], [63, 17], [72, 10], [81, 4], [90, 14], [100, 5]]} />
          </div>
        </div>

        {/* Right Side Column (Create button + Quick Actions) */}
        <div className="w-full lg:w-[260px] flex flex-col gap-3.5 shrink-0 self-stretch justify-between">
          {/* Create Button */}
          <button
            onClick={handleOpenCreate}
            className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-[#133C27] hover:bg-[#184B31] text-white py-3.5 text-xs font-black transition-all shadow-[0_4px_12px_rgba(19,60,39,0.2)] active:scale-[0.98] select-none"
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
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-black gap-1.5 transition-all select-none"
              >
                <Upload size={14} className="stroke-[2.5]" />
                <span>Import Leads</span>
              </button>
              <button
                onClick={handleOpenAssignBulk}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-amber-250 bg-amber-50/20 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-700 dark:text-[#C59A2C] text-[9px] font-black gap-1.5 transition-all select-none"
              >
                <UserCheck size={14} className="stroke-[2.5]" />
                <span>Assign Leads</span>
              </button>
              <button
                onClick={handleExportLeads}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-blue-200 bg-blue-50/20 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-[9px] font-black gap-1.5 transition-all select-none"
              >
                <Download size={14} className="stroke-[2.5]" />
                <span>Export Leads</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. FILTER ROW & CREATE LEAD BUTTON */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 pt-1.5 w-full">
        
        {/* Aligned Row of Filters */}
        <div className="w-full flex flex-wrap items-center gap-2 text-xs">
          
          {/* Search leads */}
          <div className="relative flex-1 sm:flex-initial sm:w-[160px] min-w-[130px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-3 py-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D2E1D] rounded-xl text-xs w-full text-[#1F1F1F] dark:text-white focus:outline-none focus:border-[#C59A2C] transition-all font-semibold"
            />
          </div>

          {/* Status custom select */}
          <div className="w-full sm:w-[135px] shrink-0">
            <CustomSelect
              label="Status"
              value={filterStatus}
              options={["All Status", ...leadStages]}
              icon={Target}
              onChange={setFilterStatus}
            />
          </div>

          {/* Sources custom select */}
          <div className="w-full sm:w-[135px] shrink-0">
            <CustomSelect
              label="Sources"
              value={filterSource}
              options={["All Sources", ...leadSources]}
              icon={Globe}
              onChange={setFilterSource}
            />
          </div>

          {/* Projects custom select */}
          <div className="w-full sm:w-[135px] shrink-0">
            <CustomSelect
              label="Projects"
              value={filterProject}
              options={["All Projects", ...projectsList]}
              icon={Building}
              onChange={setFilterProject}
            />
          </div>

          {/* RMs custom select */}
          <div className="w-full sm:w-[135px] shrink-0">
            <CustomSelect
              label="RMs"
              value={filterRM}
              options={["All RMs", ...relationshipManagers]}
              icon={UserCheck}
              onChange={setFilterRM}
            />
          </div>

          {/* Lead Score custom select */}
          <div className="w-full sm:w-[125px] shrink-0">
            <CustomSelect
              label="Score"
              value={filterScoreRange}
              options={["Lead Score", "Hot (80+)", "Warm (50-79)", "Cold (<50)"]}
              icon={Star}
              onChange={setFilterScoreRange}
            />
          </div>

          {/* Date Range custom select */}
          <div className="w-full sm:w-[130px] shrink-0">
            <CustomSelect
              label="Date Range"
              value={filterCreatedDate}
              options={["This Month", "Today", "Yesterday", "Last 7 Days"]}
              icon={Calendar}
              onChange={setFilterCreatedDate}
            />
          </div>

          {/* More Filters & Clear Action Buttons */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0 w-full sm:w-auto justify-end">
            <button className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D2E1D] rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-primary transition-all shadow-sm shrink-0">
              <SlidersHorizontal size={12} />
              <span>More Filters</span>
            </button>
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-1 py-2 px-2.5 border border-transparent rounded-xl text-xs font-bold text-gray-500 hover:text-primary dark:hover:text-[#C59A2C] transition-colors pl-1 shrink-0"
            >
              <RefreshCw size={11} className="text-gray-400 shrink-0 mr-1" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. BULK OPERATION BAR (Shown only when selected) */}
      {/* ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedLeadIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F8F5EE] dark:bg-white/5 p-2.5 px-4 rounded-xl border border-[#E8E2D6] dark:border-white/10 shadow-sm gap-2"
          >
            {/* Left side actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 accent-[#133C27] cursor-pointer"
                  checked={true}
                  onChange={() => setSelectedLeadIds([])}
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
                  <span>Export</span>
                </button>

                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white dark:bg-[#0D2E1D] border border-red-200 dark:border-red-500/25 text-[11px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 transition-all select-none cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
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
                onClick={() => setSelectedLeadIds([])}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded cursor-pointer"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. LEADS TABLE (Exactly replicates mockup columns) */}
      {/* ──────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0D2E1D] border border-[#E8E2D6] dark:border-white/10 rounded-2xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-full" />
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
                  className="rounded-lg border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Clear Search Filters
                </button>
                <button
                  onClick={handleOpenCreate}
                  className="rounded-lg bg-primary text-white px-4 py-2 text-xs font-bold hover:bg-[#184B31]"
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
                  <th className="py-3 px-4 w-10 sticky left-0 bg-gray-50 dark:bg-[#0D2E1D] z-20">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 accent-[#133C27] cursor-pointer"
                      checked={paginatedLeads.length > 0 && paginatedLeads.every((l) => selectedLeadIds.includes(l.id))}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-3 w-16">Lead</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Lead Stage</th>
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
                      <td className="py-3 px-4 sticky left-0 bg-white dark:bg-[#0D2E1D] group-hover:bg-[#FBF9F4] dark:group-hover:bg-[#0E3521] z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)] transition-colors">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 accent-[#133C27] cursor-pointer"
                          checked={isChecked}
                          onChange={() => handleSelectRow(lead.id)}
                        />
                      </td>

                      {/* Lead (Avatar + Name + ID underneath) */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm transition-all group-hover:scale-105",
                            getAvatarColorClass(lead.name)
                          )}>
                            {getInitials(lead.name)}
                          </div>
                          <div className="flex flex-col text-left">
                            <span 
                              className="font-extrabold text-primary dark:text-[#C59A2C] leading-tight hover:underline cursor-pointer"
                              onClick={() => handleOpenEdit(lead)}
                            >
                              {lead.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold mt-0.5">
                              {lead.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact (Phone + Email underneath) */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-extrabold text-gray-700 dark:text-gray-300">
                            {lead.mobile}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5 font-medium">
                            {lead.email}
                          </span>
                        </div>
                      </td>

                      {/* Source with Branded Icon */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-750 dark:text-gray-300">
                          <SrcIcon className="shrink-0" />
                          <span>{lead.source}</span>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="py-3 px-3 font-bold text-gray-700 dark:text-gray-300">
                        {lead.project}
                      </td>

                      {/* Lead Stage Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-tight",
                            getStageBadgeStyles(lead.stage)
                          )}
                        >
                          {lead.stage}
                        </span>
                      </td>

                      {/* RM with initials circle avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {lead.rm !== "Unassigned" ? (
                            <img
                              src={rmPhotos[lead.rm]}
                              alt={lead.rm}
                              className="w-5 h-5 rounded-full object-cover shrink-0 border border-gray-150"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-black shrink-0 bg-amber-50 text-amber-700 border-amber-200">
                              ?
                            </div>
                          )}
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
                        </div>
                      </td>

                      {/* Last Activity (Time + action subtext) */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-left leading-tight">
                          <span className="font-extrabold text-gray-700 dark:text-gray-300">
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
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                          <Calendar size={13} className="text-gray-400 shrink-0" />
                          <span className="font-bold text-[11px]">{lead.nextFollowupText}</span>
                        </div>
                      </td>

                      {/* Row Action Icons (Phone, Mail, ⋮ dropdown) */}
                      <td className="py-3 px-4 text-right pr-6 relative">
                        <div className="inline-flex items-center gap-2.5">
                          <button
                            onClick={() => alert(`Calling ${lead.name} at ${lead.mobile}...`)}
                            className="p-1 hover:bg-[#F8F5EE] dark:hover:bg-white/10 rounded text-gray-400 hover:text-primary transition-colors"
                            title="Call Lead"
                          >
                            <Phone size={13} />
                          </button>
                          
                          <button
                            onClick={() => window.open(`mailto:${lead.email}`)}
                            className="p-1 hover:bg-[#F8F5EE] dark:hover:bg-white/10 rounded text-gray-400 hover:text-primary transition-colors"
                            title="Send Email"
                          >
                            <Mail size={13} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRowActionsOpenId(rowActionsOpenId === lead.id ? null : lead.id);
                            }}
                            className="p-1 hover:bg-[#F8F5EE] dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-white"
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
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-bold"
                                >
                                  <Edit2 size={13} className="text-[#C59A2C]" />
                                  <span>Edit Lead</span>
                                </button>
                                
                                <button
                                  onClick={() => handleOpenAssignSingle(lead)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors font-bold"
                                >
                                  <UserCheck size={13} className="text-[#C59A2C]" />
                                  <span>Assign Manager</span>
                                </button>
                                
                                <hr className="border-gray-100 dark:border-white/5" />
                                
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-bold"
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

        {/* ──────────────────────────────────────────────────────── */}
        {/* 5. TABLE PAGINATION CONTROLS */}
        {/* ──────────────────────────────────────────────────────── */}
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
                  className="py-0.5 px-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-md text-xs font-bold focus:outline-none"
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
                className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-white transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-bold transition-all border",
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
                  "w-8 h-8 rounded-lg text-xs font-bold transition-all border",
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
                className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-white transition-colors"
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
                className="py-1 px-2 border border-gray-250 dark:border-white/15 bg-white dark:bg-[#0D2E1D] rounded-lg focus:outline-none text-[11px] font-bold cursor-pointer"
              >
                <option value="10">10 / page</option>
                <option value="20">20 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 6. CREATE LEAD MODAL */}
      {/* ──────────────────────────────────────────────────────── */}
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
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
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
                      value={formData.name}
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
                      value={formData.mobile}
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
                      value={formData.secondaryMobile}
                      onChange={handleInputChange}
                      placeholder="Optional number"
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="customer@domain.com"
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Lead Source
                    </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Interested Project
                    </label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                      value={formData.preferredLocation}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Assign Relationship Manager
                    </label>
                    <select
                      name="rm"
                      value={formData.rm}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                      value={formData.score}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={3}
                    className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-gray-250 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateSubmit(true)}
                  className="px-4 py-2 border border-[#C59A2C] dark:border-[#C59A2C]/40 text-[#C59A2C] hover:bg-[#C59A2C]/5 rounded-xl text-xs font-bold"
                >
                  Save & Create Another
                </button>
                <button
                  onClick={() => handleCreateSubmit(false)}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#184B31] shadow-md shadow-primary/10"
                >
                  Save Lead
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 7. EDIT LEAD MODAL */}
      {/* ──────────────────────────────────────────────────────── */}
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
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
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
                      value={formData.name}
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
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
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
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Secondary Mobile
                    </label>
                    <input
                      type="text"
                      name="secondaryMobile"
                      value={formData.secondaryMobile}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Lead Source
                    </label>
                    <select
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Interested Project
                    </label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                      value={formData.preferredLocation}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Relationship Manager
                    </label>
                    <select
                      name="rm"
                      value={formData.rm}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                      value={formData.score}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                      Current Stage Status
                    </label>
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      className="py-2 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                  <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows={3}
                    className="py-2 px-3 border border-gray-250 dark:border-white/10 bg-white dark:bg-white/5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-150 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-gray-250 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#184B31] shadow-md shadow-primary/10"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 8. ASSIGN RELATIONSHIP MANAGER MODAL */}
      {/* ──────────────────────────────────────────────────────── */}
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
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
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
                    className="py-2.5 px-3 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d2e1d] rounded-xl text-xs text-[#1F1F1F] dark:text-white focus:outline-none"
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
                  className="px-4 py-2 border border-gray-250 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignSubmit}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-[#184B31] shadow-md shadow-primary/10"
                >
                  Assign Manager
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
