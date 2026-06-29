// Practical CRM mock data for a mid-size Indian real estate developer
// Covers ~3 active residential projects, ~12 field RMs

// @/mock/dashboard.ts

// Add explicit type with literal union
export interface KPIData {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";  // ← Literal type union
  tooltip: string;
}

export const kpiData: KPIData[] = [
  { label: "Enquiries", value: "312", change: 8.3, trend: "up", tooltip: "Total enquiries received this month across all channels" },
  { label: "Prospects", value: "178", change: 5.1, trend: "up", tooltip: "Enquiries where initial contact was established" },
  { label: "Qualified Leads", value: "94", change: -2.1, trend: "down", tooltip: "Leads that have confirmed budget, timeline & requirements" },
  { label: "Bookings", value: "11", change: 22.2, trend: "up", tooltip: "Token amount collected and booking confirmed this month" },
  { label: "Conversion Rate", value: "3.5%", change: 0.3, trend: "up", tooltip: "Bookings as a percentage of total enquiries" },
  { label: "Pipeline Value", value: "₹12.8Cr", change: 5.9, trend: "up", tooltip: "Total estimated revenue from active negotiation-stage leads" },
  { label: "SLA Compliance", value: "88.4%", change: -1.8, trend: "down", tooltip: "Percentage of leads responded to within the 30-minute SLA window" },
  { label: "Avg Response Time", value: "34 min", change: -11.5, trend: "up", tooltip: "Average time from lead creation to first RM contact. Lower is better." },
];
export const leadProgressData = [
  { label: "New", value: 134 },
  { label: "Contacted", value: 178 },
  { label: "Qualified", value: 94 },
  { label: "Site Visit", value: 52 },
  { label: "Negotiation", value: 18 },
  { label: "Booking Confirmed", value: 11 },
];

export const funnelData = [
  { stage: "New Enquiry", value: 312, color: "#4A5D23" },
  { stage: "Contacted", value: 178, color: "#5D732D" },
  { stage: "Qualified", value: 94, color: "#708937" },
  { stage: "Site Visit", value: 52, color: "#839F41" },
  { stage: "Negotiation", value: 18, color: "#96B54B" },
  { stage: "Booked", value: 11, color: "#C9A84C" },
];

export const trendData = [
  { name: "Mon", leads: 42, visits: 8, bookings: 1 },
  { name: "Tue", leads: 48, visits: 12, bookings: 2 },
  { name: "Wed", leads: 35, visits: 10, bookings: 1 },
  { name: "Thu", leads: 52, visits: 14, bookings: 2 },
  { name: "Fri", leads: 44, visits: 11, bookings: 2 },
  { name: "Sat", leads: 58, visits: 18, bookings: 3 },
  { name: "Sun", leads: 33, visits: 8, bookings: 0 },
];

export const sourcePerformanceData = [
  { name: "Website", total: 78, qualified: 32, bookings: 5 },
  { name: "99acres", total: 65, qualified: 28, bookings: 4 },
  { name: "MagicBricks", total: 52, qualified: 21, bookings: 3 },
  { name: "Facebook Ads", total: 42, qualified: 15, bookings: 2 },
  { name: "Housing.com", total: 38, qualified: 14, bookings: 2 },
  { name: "Instagram", total: 28, qualified: 8, bookings: 1 },
  { name: "Referral", total: 18, qualified: 16, bookings: 4 },
  { name: "Walk-in", total: 12, qualified: 11, bookings: 3 },
  { name: "WhatsApp", total: 22, qualified: 12, bookings: 2 },
  { name: "Phone Call", total: 15, qualified: 8, bookings: 1 },
];

// Derived bubble data for scatter chart: x=volume, y=conv%, z=bookings
export const sourceBubbleData = sourcePerformanceData.map((s) => ({
  name: s.name,
  volume: s.total,
  convRate: parseFloat(((s.bookings / s.total) * 100).toFixed(1)),
  bookings: s.bookings,
  qualified: s.qualified,
}));

export const projectPerformanceData = [
  { name: "Vasiyam Greens", leads: 145, visits: 45, bookings: 6, rate: "4.1%" },
  { name: "The Residency", leads: 98, visits: 28, bookings: 3, rate: "3.1%" },
  { name: "Sky Heights", leads: 52, visits: 18, bookings: 2, rate: "3.8%" },
  { name: "Park View (New)", leads: 17, visits: 8, bookings: 0, rate: "0.0%" },
];

export const attentionQueue = [
  { id: "LD-2847", type: "SLA Breach", lead: "Rajesh Kumar", time: "3.5h overdue", severity: "high" },
  { id: "LD-2831", type: "Overdue Follow-up", lead: "Sunitha Menon", time: "2h overdue", severity: "medium" },
  { id: "LD-2869", type: "Unassigned Lead", lead: "3 leads (Housing.com)", time: "Waiting 45 min", severity: "medium" },
  { id: "LD-2815", type: "No Next Action", lead: "Anand Krishnamurthy", time: "4d since contact", severity: "low" },
];

export const repPerformance = [
  { name: "Arun Kumar", activities: 68, visits: 18, bookings: 4, rate: "5.9%" },
  { name: "Meera Nair", activities: 55, visits: 14, bookings: 3, rate: "5.5%" },
  { name: "Divya Sharma", activities: 42, visits: 8, bookings: 2, rate: "4.8%" },
  { name: "Suresh Pillai", activities: 48, visits: 12, bookings: 2, rate: "4.2%" },
  { name: "Kiran Ramachandran", activities: 36, visits: 9, bookings: 1, rate: "2.8%" },
  { name: "Rajesh Kannan", activities: 32, visits: 7, bookings: 1, rate: "3.1%" },
];

export const activityTimeline = [
  { id: 1, type: "Lead Assigned", user: "System", desc: "Pradeep Kumar (99acres) assigned to Arun Kumar", time: "10:15 AM" },
  { id: 2, type: "Call Logged", user: "Arun Kumar", desc: "Outbound call – Pradeep Kumar, 8 min. Interested in 3BHK Vasiyam Greens.", time: "10:42 AM" },
  { id: 3, type: "Follow-up Added", user: "Arun Kumar", desc: "Site visit scheduled for Pradeep Kumar – Fri 27 Jun, 11:00 AM", time: "11:30 AM" },
  { id: 4, type: "Site Visit", user: "Meera Nair", desc: "Site visit completed – Anitha Rajan toured Vasiyam Greens Unit 302", time: "12:15 PM" },
  { id: 5, type: "Booking", user: "Suresh Pillai", desc: "Booking confirmed – Bhaskar Rao, Sky Heights 1403, ₹1.2Cr", time: "02:45 PM" },
];

export const recentLeads = [
  { name: "Venkatesh Nair", project: "Vasiyam Greens", source: "99acres", rm: "Arun Kumar", stage: "Site Visit", next: "27 Jun 11:00 AM" },
  { name: "Anitha Rajan", project: "The Residency", source: "Website", rm: "Meera Nair", stage: "Qualified", next: "Today 3:00 PM" },
  { name: "Bhaskar Rao", project: "Sky Heights", source: "Referral", rm: "Suresh Pillai", stage: "Negotiation", next: "Today 5:30 PM" },
  { name: "Lakshmi Devi", project: "Vasiyam Greens", source: "Walk-in", rm: "Divya Sharma", stage: "New", next: "Tomorrow 10:00 AM" },
  { name: "Prasad Iyer", project: "The Residency", source: "MagicBricks", rm: "Arun Kumar", stage: "Contacted", next: "Tomorrow 2:00 PM" },
];
