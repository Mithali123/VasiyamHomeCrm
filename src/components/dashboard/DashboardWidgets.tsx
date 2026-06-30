"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import {
  activities,
  insights,
  liveLeadStatus,
  recentLeads,
  repPerformance,
} from "@/mock/dashboard";

// ============ TYPES ============
interface Tone {
  bg: string;
  text: string;
  line: string;
}

// ============ CONSTANTS ============
const tones: Record<string, Tone> = {
  green: { bg: "bg-emerald-50", text: "text-emerald-700", line: "bg-emerald-600" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", line: "bg-blue-600" },
  gold: { bg: "bg-amber-50", text: "text-amber-600", line: "bg-amber-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", line: "bg-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", line: "bg-orange-500" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", line: "bg-teal-600" },
  red: { bg: "bg-red-50", text: "text-red-600", line: "bg-red-500" },
};

const statusClass: Record<string, string> = {
  New: "bg-emerald-50 text-emerald-700",
  Contacted: "bg-blue-50 text-blue-700",
  Qualified: "bg-amber-50 text-amber-700",
  "Site Visit": "bg-purple-50 text-purple-700",
  Negotiation: "bg-red-50 text-red-600",
};

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

// ============ SHARED COMPONENTS ============
const Title = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <h2 className="text-[13px] font-bold uppercase text-[#161a1b]">{title}</h2>
    <p className="mt-1 text-[10px] text-[#7c8387]">{subtitle}</p>
  </div>
);

const ViewAll = ({ path, label = "View all" }: { path: string; label?: string }) => (
  <Link
    href={path}
    aria-label={label}
    className="group inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#dfe4e6] bg-white px-3 text-[10px] font-semibold text-[#26302d] shadow-sm transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 active:scale-[0.98]"
  >
    <span>{label}</span>
    <ChevronRight
      size={13}
      aria-hidden="true"
      className="transition-transform duration-200 group-hover:translate-x-0.5"
    />
  </Link>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section
    className={`rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)] ${className}`}
  >
    {children}
  </section>
);

// ============ WIDGETS ============

// 1. Live Lead Status Widget
export function LiveLeadStatus() {
  const router = useRouter();

  const handleStatusClick = (status: string) => {
    router.push(`/dashboard/leads?status=${encodeURIComponent(status)}`);
  };

  return (
    <Card className="h-full">
      <div className="mb-3 flex items-start justify-between gap-4">
        <Title title="Live Lead Status" subtitle="Real-time distribution of leads" />
        <ViewAll path="/dashboard/leads" />
      </div>

      <div className="grid grid-cols-4 gap-x-3 gap-y-3">
        {liveLeadStatus.map((item, index) => {
          const Icon = statusIcons[index];
          const tone = tones[item.tone];

          return (
            <div
              key={item.label}
              className="min-w-0 cursor-pointer rounded border-b border-[#eef0f1] p-1 pb-2 transition-colors hover:bg-gray-50"
              onClick={() => handleStatusClick(item.label)}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone.bg} ${tone.text}`}
                >
                  <Icon size={13} />
                </span>
                <span className="min-w-0 flex-1">
                  <small className="block whitespace-nowrap text-[9px] leading-none text-[#6f767a]">
                    {item.label}
                  </small>
                  <b className="mt-1 block text-[13px] leading-none">{item.value}</b>
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <i className={`h-[2px] flex-1 ${tone.line}`} />
                <span className="whitespace-nowrap text-[9px] text-[#7a8185]">
                  {item.percent}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// 2. RM Performance Widget
export function RMPerformance() {
  const router = useRouter();

  const handleRMClick = (rmName: string) => {
    const slug = rmName.toLowerCase().replaceAll(" ", "-");
    router.push(`/rm/${slug}`);
  };

  return (
    <Card className="h-full">
      <div className="mb-3 flex items-start justify-between gap-4">
        <Title title="RM Performance" subtitle="Top performing relationship managers" />
        <ViewAll path="/rm" />
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
          className="grid h-8 grid-cols-[1.4fr_.55fr_.55fr_.5fr] cursor-pointer items-center border-b border-[#f1f2f2] text-[10px] transition-colors last:border-0 hover:bg-gray-50"
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

// 3. Recent Leads Widget
export function RecentLeads() {
  const router = useRouter();

  const handleLeadClick = (leadName: string) => {
    router.push(`/dashboard/leads`);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("global-search", { detail: leadName }));
    }, 100);
  };

  const handleStatusClick = (status: string, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/dashboard/leads?status=${encodeURIComponent(status)}`);
  };

  const columns =
    "grid-cols-[minmax(120px,1.15fr)_minmax(140px,1.3fr)_minmax(95px,.9fr)_minmax(130px,1.15fr)_minmax(105px,.9fr)_76px]";

  return (
    <Card className="h-full overflow-hidden">
      <div className="mb-3 flex items-start justify-between gap-4">
        <Title title="Recent Leads" subtitle="Latest leads added to the system" />
        <ViewAll path="/dashboard/leads" />
      </div>

      <div className="w-full overflow-x-auto pb-1">
        <div className="min-w-[760px]">
          {/* Header */}
          <div
            className={`grid ${columns} gap-x-4 border-b border-[#eef0f1] pb-2 text-[9px] uppercase tracking-wide text-[#858c90]`}
          >
            <span>Lead</span>
            <span>Project</span>
            <span>Source</span>
            <span>Assigned RM</span>
            <span>Status</span>
            <span>Time</span>
          </div>

          {/* Rows */}
          {recentLeads.map((lead) => (
            <div
              key={lead.name}
              onClick={() => handleLeadClick(lead.name)}
              className={`grid min-h-10 ${columns} cursor-pointer items-center gap-x-4 border-b border-[#f1f2f2] text-[10px] transition-colors last:border-0 hover:bg-gray-50`}
            >
              <b className="min-w-0 truncate" title={lead.name}>
                {lead.name}
              </b>
              <span className="min-w-0 truncate" title={lead.project}>
                {lead.project}
              </span>
              <span className="min-w-0 truncate" title={lead.source}>
                {lead.source}
              </span>
              <span className="min-w-0 truncate" title={lead.rm}>
                {lead.rm}
              </span>
              <span className="min-w-0">
                <button
                  type="button"
                  className={`whitespace-nowrap rounded-full px-2 py-1 ${statusClass[lead.status]} transition-opacity hover:opacity-70`}
                  onClick={(event) => handleStatusClick(lead.status, event)}
                >
                  {lead.status}
                </button>
              </span>
              <span className="whitespace-nowrap text-[#6f767a]">
                {lead.time.replace("Today, ", "")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// 4. Business Insights Widget
export function BusinessInsights() {
  const router = useRouter();

  const handleInsightClick = () => {
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
              className="flex min-h-[62px] cursor-pointer items-center rounded-lg border border-[#edf0f1] px-3 transition-colors hover:bg-gray-50"
              onClick={handleInsightClick}
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

// 5. Recent Activities Widget
export function RecentActivities() {
  const router = useRouter();

  const handleActivityClick = () => {
    router.push("/activities");
  };

  const handleBadgeClick = (badge: string, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/activities?type=${encodeURIComponent(badge.toLowerCase())}`);
  };

  return (
    <Card className="h-full">
      <div className="mb-3 flex items-start justify-between gap-4">
        <Title title="Recent Activities" subtitle="Latest updates across your leads and team" />
        <ViewAll path="/activities" />
      </div>

      <div className="relative ml-1 space-y-0.5 before:absolute before:bottom-2 before:left-[3px] before:top-2 before:w-px before:bg-[#dfe3e4]">
        {activities.map((item) => {
          const tone = tones[item.tone];

          return (
            <div
              key={`${item.time}-${item.title}`}
              className="relative grid min-h-[43px] grid-cols-[66px_minmax(0,1fr)_auto] cursor-pointer items-center gap-2 rounded-lg pl-4 text-[9px] transition-colors hover:bg-gray-50"
              onClick={handleActivityClick}
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
                className={`whitespace-nowrap rounded px-1.5 py-1 text-[8px] not-italic ${tone.bg} ${tone.text} cursor-pointer transition-opacity hover:opacity-70`}
                onClick={(event) => handleBadgeClick(item.badge, event)}
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