// src/mock/dashboard.ts

// ============ TYPES ============
export type KPIItem = {
  label: string;
  value: string;
  change?: string;
  detail?: string;
  tone: "green" | "blue" | "gold" | "purple" | "teal" | "orange" | "red";
};

// ============ PROJECTS ============
export const projects = [
  { name: "Vasiyam Pride", status: "Ongoing", type: "Apartments", location: "Medavakkam, Chennai" },
  { name: "King's Garden", status: "Ongoing", type: "Independent Plots", location: "Tambaram, Chennai" },
  { name: "BGR Garden", status: "Ongoing", type: "Villa Plots", location: "Chennai" },
  { name: "Vasiyam Florence", status: "Ongoing", type: "Apartments", location: "Chennai" },
  { name: "Grandeur", status: "Completed", type: "Premium Apartments", location: "Medavakkam" },
  { name: "Aspire", status: "Completed", type: "Designer Residences", location: "Sithalapakkam" },
  { name: "Magnum", status: "Completed", type: "Premium Apartments", location: "Sithalapakkam" },
];

// ============ KPI DATA ============
export const kpiData: KPIItem[] = [
  { label: "Total Leads", value: "4,128", change: "12.4%", detail: "vs last month", tone: "green" },
  { label: "New Leads", value: "312", change: "12.1%", detail: "vs last month", tone: "blue" },
  { label: "Pipeline", value: "₹48.80 Cr", change: "13.2%", detail: "vs last month", tone: "gold" },
  { label: "Conversion Rate", value: "11.4%", change: "1.6%", detail: "vs industry benchmark 8.2%", tone: "purple" },
  { label: "Bookings (MTD)", value: "47 | ₹5.56 Cr", change: "5%", detail: "vs last month", tone: "teal" },
  { label: "Follow-ups Due", value: "86", detail: "21 overdue  •  65 today", tone: "orange" },
];

// ============ FUNNEL STAGES ============
export const funnelStages = [
  { name: "New Lead", leads: "1,248", conversion: "—", dropOff: "—", stage: "100%", color: "#064734", width: 100 },
  { name: "Contacted", leads: "847", conversion: "67.4%", dropOff: "32.6%", stage: "67.4%", color: "#07563d", width: 90 },
  { name: "Qualified", leads: "423", conversion: "33.8%", dropOff: "33.6%", stage: "33.8%", color: "#208345", width: 78 },
  { name: "Site Visit", leads: "218", conversion: "17.5%", dropOff: "16.3%", stage: "17.5%", color: "#dda90c", width: 66 },
  { name: "Negotiation", leads: "104", conversion: "8.3%", dropOff: "9.2%", stage: "8.3%", color: "#f29b0b", width: 54 },
  { name: "Booking", leads: "60", conversion: "4.7%", dropOff: "3.6%", stage: "4.7%", color: "#f36c13", width: 43 },
  { name: "Won", leads: "126", conversion: "9.8%", dropOff: "—", stage: "9.8%", color: "#0e4a38", width: 32 },
  { name: "Lost", leads: "312", conversion: "24.3%", dropOff: "—", stage: "24.3%", color: "#e92329", width: 22 },
];

// ============ LEAD TREND ============
export const leadTrendData = [
  { date: "1 May", leads: 235, conversions: 120, bookings: 32 },
  { date: "8 May", leads: 292, conversions: 150, bookings: 58 },
  { date: "15 May", leads: 345, conversions: 180, bookings: 78 },
  { date: "22 May", leads: 398, conversions: 210, bookings: 98 },
  { date: "29 May", leads: 445, conversions: 245, bookings: 118 },
  { date: "", leads: 488, conversions: 288, bookings: 148 },
];

// ============ LEAD SOURCES ============
export const leadSources = [
  { name: "Website", value: 1184, percent: "28.7%", color: "#004b36" },
  { name: "Referral", value: 612, percent: "14.8%", color: "#087d62" },
  { name: "Instagram", value: 488, percent: "11.8%", color: "#f1a208" },
  { name: "Google Ads", value: 466, percent: "11.3%", color: "#ff7a00" },
  { name: "MagicBricks", value: 352, percent: "8.5%", color: "#e72d2f" },
  { name: "99acres", value: 296, percent: "7.2%", color: "#2582be" },
  { name: "Others", value: 730, percent: "17.7%", color: "#7d858c" },
];

// ============ LIVE LEAD STATUS ============
export const liveLeadStatus = [
  { label: "New", value: 312, percent: "7.6%", tone: "green" },
  { label: "Contacted", value: 486, percent: "11.8%", tone: "blue" },
  { label: "Qualified", value: 274, percent: "6.6%", tone: "gold" },
  { label: "Site Visit", value: 138, percent: "3.3%", tone: "purple" },
  { label: "Negotiation", value: 92, percent: "2.2%", tone: "orange" },
  { label: "Booked", value: 47, percent: "1.1%", tone: "teal" },
  { label: "Won", value: 28, percent: "0.7%", tone: "green" },
  { label: "Lost", value: 19, percent: "0.5%", tone: "red" },
];

// ============ RM PERFORMANCE ============
export const repPerformance = [
  { name: "Arvind Kumar", assigned: 187, bookings: 18, rate: "9.6%" },
  { name: "Priya Sharma", assigned: 163, bookings: 14, rate: "8.6%" },
  { name: "Meera Rajan", assigned: 145, bookings: 12, rate: "8.3%" },
  { name: "Suresh Kumar", assigned: 134, bookings: 9, rate: "6.7%" },
  { name: "Nisha Varma", assigned: 121, bookings: 7, rate: "5.8%" },
];

// ============ RECENT LEADS ============
export const recentLeads = [
  { name: "Rohit Kumar", project: "Vasiyam Pride", source: "Website", rm: "Arvind Kumar", status: "New", time: "Today, 10:15 AM" },
  { name: "Anita Shankar", project: "King's Garden", source: "Referral", rm: "Priya Sharma", status: "Contacted", time: "Today, 09:42 AM" },
  { name: "Meera Iyer", project: "BGR Garden", source: "Instagram", rm: "Meera Rajan", status: "Qualified", time: "Today, 09:18 AM" },
  { name: "Suresh R", project: "Vasiyam Florence", source: "99acres", rm: "Suresh Kumar", status: "Site Visit", time: "Today, 08:51 AM" },
  { name: "Divya Nair", project: "Vasiyam Pride", source: "Walk-in", rm: "Nisha Varma", status: "Negotiation", time: "Today, 08:30 AM" },
  { name: "Karthik S", project: "King's Garden", source: "Google Ads", rm: "Arvind Kumar", status: "Contacted", time: "Today, 08:12 AM" },
  { name: "Lakshmi Priya", project: "BGR Garden", source: "MagicBricks", rm: "Priya Sharma", status: "New", time: "Today, 07:58 AM" },
  { name: "Naveen Raj", project: "Vasiyam Florence", source: "Website", rm: "Meera Rajan", status: "Qualified", time: "Today, 07:41 AM" },
  { name: "Sanjay Kumar", project: "Vasiyam Pride", source: "Referral", rm: "Suresh Kumar", status: "Site Visit", time: "Today, 07:20 AM" },
];

// ============ BUSINESS INSIGHTS ============
export const insights = [
  { title: "Lead conversion has improved by", value: "12.4%", note: "vs last month", tone: "green" },
  { title: "Website leads are your top source with", value: "28.7%", note: "of total leads", tone: "blue" },
  { title: "Site visit to booking conversion is", value: "27.5%", note: "this month", tone: "gold" },
  { title: "Sales pipeline has increased by", value: "13.2%", note: "to ₹248.6M this month", tone: "green" },
  { title: "Bookings recorded this month", value: "47", note: "5% higher than last month", tone: "blue" },
  { title: "21 follow-ups are currently overdue", value: "", note: "Take action to avoid potential loss", tone: "red" },
];

// ============ RECENT ACTIVITIES ============
export const activities = [
  { time: "10:15 AM", title: "New lead", detail: "Rohit Kumar from Website has been created", badge: "New", tone: "green" },
  { time: "09:42 AM", title: "Site visit completed", detail: "for Anita Shankar — King's Garden", badge: "Site Visit", tone: "blue" },
  { time: "09:18 AM", title: "Booking confirmed", detail: "for Meera Iyer — BGR Garden, Unit 4B", badge: "Booking", tone: "gold" },
  { time: "08:51 AM", title: "Lead assigned", detail: "Divya Nair has been assigned to Nisha Varma", badge: "Assignment", tone: "green" },
  { time: "08:30 AM", title: "Follow-up added", detail: "for Suresh R — Call scheduled at 3 PM", badge: "Follow-up", tone: "blue" },
  { time: "08:12 AM", title: "Lead contacted", detail: "Karthik S responded to the initial call", badge: "Contacted", tone: "blue" },
  { time: "07:58 AM", title: "New lead", detail: "Lakshmi Priya from MagicBricks has been created", badge: "New", tone: "green" },
  { time: "07:41 AM", title: "Lead qualified", detail: "Naveen Raj confirmed budget and timeline for Vasiyam Florence", badge: "Qualified", tone: "gold" },
  { time: "07:20 AM", title: "Site visit scheduled", detail: "for Sanjay Kumar at Vasiyam Pride", badge: "Site Visit", tone: "purple" },
];