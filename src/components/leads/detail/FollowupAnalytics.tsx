// src/components/leads/detail/FollowupAnalytics.tsx
import React, { useMemo } from "react";
import { Shield, TrendingUp } from "lucide-react";
import { FollowupRecord } from "@/mock/leadDetails";
import { cn } from "@/lib/utils";

interface FollowupAnalyticsProps {
  followupHistory: FollowupRecord[];
}

export function FollowupAnalytics({ followupHistory }: FollowupAnalyticsProps) {
  const followupStats = useMemo(() => {
    const history = followupHistory || [];
    const pending = history.filter(f => ["Scheduled", "Upcoming", "Due Today"].includes(f.status)).length;
    const dueToday = history.filter(f => f.status === "Due Today").length;
    const overdue = history.filter(f => f.status === "Overdue").length;
    const completed = history.filter(f => f.status === "Completed").length;
    const rescheduled = history.filter(f => f.status === "Rescheduled").length;
    const total = history.length;

    const todayStr = new Date().toISOString().split("T")[0];
    const completedTodayCount = history.filter(
      f => f.status === "Completed" && f.completedDate?.startsWith(todayStr)
    ).length;

    const totalEnded = history.filter(f => ["Completed", "Overdue", "Cancelled"].includes(f.status)).length;
    const rate = totalEnded === 0 ? 100 : Math.round((completed / totalEnded) * 100);

    return { pending, dueToday, overdue, completedToday: completedTodayCount, rate, rescheduled, total };
  }, [followupHistory]);

  const avgCompletionTime = useMemo(() => {
    const completed = (followupHistory || []).filter(f => f.status === "Completed" && f.duration);
    if (completed.length === 0) return "10 mins";
    let total = 0;
    completed.forEach(f => {
      const num = parseInt(f.duration!.replace(/[^0-9]/g, "")) || 0;
      total += num;
    });
    return `${Math.round(total / completed.length)} mins`;
  }, [followupHistory]);

  const rmPerformance = useMemo(() => {
    const rmMap: Record<string, { completed: number; pending: number; overdue: number }> = {};
    (followupHistory || []).forEach(f => {
      const rm = f.conductedBy || "Unassigned";
      if (!rmMap[rm]) {
        rmMap[rm] = { completed: 0, pending: 0, overdue: 0 };
      }
      if (f.status === "Completed") rmMap[rm].completed++;
      else if (["Scheduled", "Upcoming", "Due Today"].includes(f.status)) rmMap[rm].pending++;
      else if (f.status === "Overdue") rmMap[rm].overdue++;
    });
    return Object.entries(rmMap).map(([name, stats]) => ({ name, ...stats }));
  }, [followupHistory]);

  return (
    <div className="bg-gray-55/40 border border-[#E8E2D6] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
      
      {/* SECTION 1: TASK ANALYTICS */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase text-primary tracking-wider flex items-center gap-1.5 border-b pb-2 border-[#E8E2D6]">
          <Shield size={12} className="text-[#C9A82C]" />
          <span>Super Admin Follow-up Analytics & Workload Auditing</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Completion Rate</span>
            <p className={cn(
              "text-lg font-black mt-1",
              followupStats.rate >= 80 ? "text-emerald-700" : followupStats.rate >= 50 ? "text-amber-600" : "text-red-650"
            )}>
              {followupStats.rate || 0}%
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Average Closure Time</span>
            <p className="text-lg font-black text-[#1A3C2A] mt-1">{avgCompletionTime}</p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Due Today / Overdue</span>
            <p className={cn(
              "text-lg font-black mt-1",
              (followupStats.dueToday + followupStats.overdue) > 0 ? "text-red-650" : "text-gray-700"
            )}>
              {followupStats.dueToday} / {followupStats.overdue}
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Pending Tasks</span>
            <p className="text-lg font-black text-amber-600 mt-1">{followupStats.pending}</p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Total Logged Tasks</span>
            <p className="text-lg font-black text-emerald-800 mt-1">{followupStats.total}</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: HEALTH & PROGRESSION METRICS */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase text-primary tracking-wider flex items-center gap-1.5 border-b pb-2 border-[#E8E2D6]">
          <TrendingUp size={12} className="text-[#C9A82C]" />
          <span>Super Admin Operations & Health Intelligence</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Lead Health Score</span>
            <p className="text-lg font-black text-emerald-700 mt-1">88% <span className="text-[8.5px] font-bold text-gray-400 font-sans block">Excellent</span></p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Conversion Prob</span>
            <p className="text-lg font-black text-primary mt-1">75% <span className="text-[8.5px] font-bold text-emerald-700 font-sans block font-sans">High Prob</span></p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Days In Stage</span>
            <p className="text-lg font-black text-[#1A3C2A] mt-1">4 Days <span className="text-[8.5px] font-bold text-gray-400 font-sans block font-sans">Within SLA</span></p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Customer Engagement</span>
            <p className="text-lg font-black text-emerald-700 mt-1">94/100 <span className="text-[8.5px] font-bold text-gray-400 block font-sans">Very Active</span></p>
          </div>

          <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 text-center shadow-sm">
            <span className="text-[9px] uppercase font-black text-gray-400">Avg Response Time</span>
            <p className="text-lg font-black text-primary mt-1">12 mins <span className="text-[8.5px] font-bold text-emerald-600 block font-sans">SLA met</span></p>
          </div>
        </div>
      </div>

      {rmPerformance.length > 0 && (
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-sm">
          <span className="text-[9px] uppercase font-black text-gray-400 block mb-2 tracking-wide">
            RM-wise Workload & Performance Ledger
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
            {rmPerformance.map(perf => (
              <div key={perf.name} className="flex justify-between items-center bg-[#FBF9F4] p-2.5 rounded-lg border border-gray-100">
                <span className="font-extrabold text-gray-700">{perf.name}</span>
                <div className="flex gap-2">
                  <span className="text-emerald-700 font-extrabold" title="Completed">C: {perf.completed}</span>
                  <span className="text-primary font-extrabold" title="Pending">P: {perf.pending}</span>
                  <span className="text-red-650 font-extrabold" title="Overdue">O: {perf.overdue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
