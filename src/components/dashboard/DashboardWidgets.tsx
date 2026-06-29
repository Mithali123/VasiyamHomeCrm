"use client";

import {
  Activity,
  CalendarCheck,
  ChevronRight,
  Clock3,
  Handshake,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { activities, insights, liveLeadStatus, recentLeads, repPerformance } from "@/mock/dashboard";
import { useRouter } from "next/navigation";

const tones: Record<string, { bg: string; text: string; line: string }> = {
  green: { bg: "bg-emerald-50", text: "text-emerald-700", line: "bg-emerald-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", line: "bg-blue-600" },
  gold: { bg: "bg-amber-50", text: "text-amber-600", line: "bg-amber-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", line: "bg-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", line: "bg-orange-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", line: "bg-teal-600" },
  red: { bg: "bg-red-50", text: "text-red-600", line: "bg-red-500" },
};

// Helper Components
const Title = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <h2 className="text-[13px] font-bold uppercase text-[#161a1b]">{title}</h2>
    <p className="mt-1 text-[10px] text-[#7c8387]">{subtitle}</p>
  </div>
);

const ViewAll = ({ onClick, path }: { onClick?: () => void; path?: string }) => {
  const router = useRouter();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      router.push(path);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="rounded-md border border-[#e6e8e9] px-3 py-2 text-[10px] hover:bg-gray-50 transition-colors"
    >
      View all
    </button>
  );
};

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)] ${className}`}
  >
    {children}
  </section>
);

const statusIcons = [
  UsersRound,
  UserRoundCheck,
  Clock3,
  CalendarCheck,
  Handshake,
  Trophy,
  ShieldCheck,
  Activity,
];

const statusClass: Record<string, string> = {
  New: "bg-emerald-50 text-emerald-700",
  Contacted: "bg-blue-50 text-blue-700",
  Qualified: "bg-amber-50 text-amber-700",
  "Site Visit": "bg-purple-50 text-purple-700",
  Negotiation: "bg-red-50 text-red-600",
};

// Live Lead Status Widget
export function LiveLeadStatus() {
  const router = useRouter();

  const handleViewAll = () => {
    console.log("View all live lead status");
    router.push("/leads");
  };

  const handleStatusClick = (status: string) => {
    console.log(`Status clicked: ${status}`);
    router.push(`/leads?status=${status}`);
  };

  return (
    <Card className="h-full">
      <div className="mb-3 flex items-start justify-between">
        <Title title="Live Lead Status" subtitle="Real-time distribution of leads" />
        <ViewAll onClick={handleViewAll} />
      </div>

      <div className="grid grid-cols-4 gap-x-3 gap-y-3">
        {liveLeadStatus.map((item, index) => {
          const Icon = statusIcons[index];
          const tone = tones[item.tone];

          return (
            <div 
              key={item.label} 
              className="min-w-0 border-b border-[#eef0f1] pb-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
              onClick={() => handleStatusClick(item.label)}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}
                >
                  <Icon size={13} />
                </span>
                <span>
                  <small className="block text-[9px] text-[#6f767a]">{item.label}</small>
                  <b className="text-[13px]">{item.value}</b>
                </span>
              </div>

              <div className="mt-1 flex items-center gap-1">
                <i className={`h-[2px] flex-1 ${tone.line}`} />
                <span className="text-[9px] text-[#7a8185]">{item.percent}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// RM Performance Widget
export function RMPerformance() {
  const router = useRouter();

  const handleViewAll = () => {
    console.log("View all RM performance");
    router.push("/rm");
  };

  const handleRMClick = (rmName: string) => {
    console.log(`RM clicked: ${rmName}`);
    router.push(`/rm/${rmName.toLowerCase().replace(" ", "-")}`);
  };

  return (
    <Card className="h-full">
      <div className="mb-3 flex items-start justify-between">
        <Title title="RM Performance" subtitle="Top performing relationship managers" />
        <ViewAll onClick={handleViewAll} />
      </div>

      <div className="grid grid-cols-[1.4fr_.55fr_.55fr_.5fr] border-b border-[#eef0f1] pb-2 text-[9px] uppercase text-[#858c90]">
        <span>RM Name</span>
        <span>Assigned</span>
        <span>Bookings</span>
        <span>Conv. %</span>
      </div>

      {repPerformance.map((rep, index) => (
        <div
          key={rep.name}
          className="grid h-8 grid-cols-[1.4fr_.55fr_.55fr_.5fr] items-center border-b border-[#f1f2f2] text-[10px] last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleRMClick(rep.name)}
        >
          <span className="flex items-center gap-2 font-medium">
            <i className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8eee9] text-[8px] text-[#174f3d]">
              {rep.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </i>
            {rep.name}
          </span>
          <span>{rep.assigned}</span>
          <span>{rep.bookings}</span>
          <span>
            <b
              className={`rounded-full px-2 py-0.5 ${
                index < 3 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
            >
              {rep.rate}
            </b>
          </span>
        </div>
      ))}
    </Card>
  );
}

// Recent Leads Widget
export function RecentLeads() {
  const router = useRouter();

  const handleViewAll = () => {
    console.log("View all recent leads");
    router.push("/leads");
  };

  const handleLeadClick = (leadName: string) => {
    console.log(`Lead clicked: ${leadName}`);
    router.push(`/leads/${leadName.toLowerCase().replace(" ", "-")}`);
  };

  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Status clicked: ${status}`);
    router.push(`/leads?status=${status}`);
  };

  return (
    <Card className="h-full overflow-hidden">
      <div className="mb-3 flex items-start justify-between">
        <Title title="Recent Leads" subtitle="Latest leads added to the system" />
        <ViewAll onClick={handleViewAll} />
      </div>

      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-[1fr_1.05fr_.78fr_1fr_.78fr_.65fr] gap-x-2 border-b border-[#eef0f1] pb-2 text-[8px] uppercase text-[#858c90]">
          <span>Lead</span>
          <span>Project</span>
          <span>Source</span>
          <span>Assigned RM</span>
          <span>Status</span>
          <span>Time</span>
        </div>

        {recentLeads.map((lead) => (
          <div
            key={lead.name}
            className="grid min-h-[36px] grid-cols-[1fr_1.05fr_.78fr_1fr_.78fr_.65fr] items-center gap-x-2 border-b border-[#f1f2f2] text-[9px] last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleLeadClick(lead.name)}
          >
            <b className="truncate">{lead.name}</b>
            <span className="truncate">{lead.project}</span>
            <span className="truncate">{lead.source}</span>
            <span className="truncate">{lead.rm}</span>
            <span>
              <i
                className={`whitespace-nowrap rounded-full px-1.5 py-0.5 not-italic ${statusClass[lead.status]} cursor-pointer hover:opacity-70 transition-opacity`}
                onClick={(e) => handleStatusClick(lead.status, e)}
              >
                {lead.status}
              </i>
            </span>
            <span className="whitespace-nowrap text-[#6f767a]">
              {lead.time.replace("Today, ", "")}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Business Insights Widget
export function BusinessInsights() {
  const router = useRouter();

  const handleInsightClick = (insight: string) => {
    console.log(`Insight clicked: ${insight}`);
    router.push("/analytics/insights");
  };

  return (
    <Card className="h-full">
      <div className="mb-3">
        <Title title="Business Insights" subtitle="Key insights to help you make better decisions" />
      </div>

      <div className="space-y-2.5">
        {insights.map((item) => {
          const tone = tones[item.tone];

          return (
            <div
              key={item.title}
              className="flex min-h-[62px] items-center rounded-lg border border-[#edf0f1] px-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleInsightClick(item.title)}
            >
              <span
                className={`mr-2 flex h-7 w-7 items-center justify-center rounded-md ${tone.bg} ${tone.text}`}
              >
                <Sparkles size={12} />
              </span>

              <span className="min-w-0 flex-1 text-[9px] leading-relaxed text-[#5f666a]">
                {item.title}
                <b className="block text-[12px] leading-tight text-[#171b1c]">
                  {item.value}
                  <small className="font-normal text-[#7b8286]">{item.note}</small>
                </b>
              </span>

              <ChevronRight size={11} className={tone.text} />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Recent Activities Widget
export function RecentActivities() {
  const router = useRouter();

  const handleViewAll = () => {
    console.log("View all recent activities");
    router.push("/activities");
  };

  const handleActivityClick = (activity: string) => {
    console.log(`Activity clicked: ${activity}`);
    router.push("/activities");
  };

  const handleBadgeClick = (badge: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Badge clicked: ${badge}`);
    router.push(`/activities?type=${badge.toLowerCase()}`);
  };

  return (
    <Card className="h-full">
      <div className="mb-3 flex items-start justify-between">
        <Title title="Recent Activities" subtitle="Latest updates across your leads and team" />
        <ViewAll onClick={handleViewAll} />
      </div>

      <div className="relative ml-1 space-y-0.5 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-[#dfe3e4]">
        {activities.map((item) => {
          const tone = tones[item.tone];

          return (
            <div
              key={`${item.time}-${item.title}`}
              className="relative grid min-h-[43px] grid-cols-[66px_minmax(0,1fr)_auto] items-center gap-2 pl-4 text-[9px] cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => handleActivityClick(item.title)}
            >
              <i
                className={`absolute left-0 z-10 h-2 w-2 rounded-full border-2 border-white ${tone.line}`}
              />
              <span className="text-[#7d8488]">{item.time}</span>
              <span className="min-w-0 leading-snug">
                <b className="block text-[#171b1c]">{item.title}</b>
                <span className="block truncate text-[#5f666a]">{item.detail}</span>
              </span>
              <em
                className={`whitespace-nowrap rounded px-1.5 py-1 text-[8px] not-italic ${tone.bg} ${tone.text} cursor-pointer hover:opacity-70 transition-opacity`}
                onClick={(e) => handleBadgeClick(item.badge, e)}
              >
                {item.badge}
              </em>
            </div>
          );
        })}
      </div>
    </Card>
  );
}