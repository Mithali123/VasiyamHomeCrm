"use client";

import { 
  AlertCircle, 
  Clock, 
  UserPlus, 
  ChevronRight,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { 
  attentionQueue, 
  repPerformance, 
  activityTimeline, 
  recentLeads 
} from "@/mock/dashboard";
import { cn } from "@/lib/utils";

export function AttentionQueue() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-sm flex flex-col overflow-hidden">
      <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-text">Attention Queue</h3>
        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">4 Actions</span>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[350px]">
        {attentionQueue.map((item) => (
          <div key={item.id} className="p-4 border-b border-[#F1E9D4] last:border-0 hover:bg-[#F8F5EE] transition-colors group cursor-pointer">
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                item.severity === 'high' ? "bg-red-50 text-red-600" : 
                item.severity === 'medium' ? "bg-[#FDF5E1] text-[#B8960F]" : "bg-[#E1F0FA] text-[#1A6B8C]"
              )}>
                {item.type.includes('SLA') ? <Clock size={16} /> : <AlertCircle size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-brand-text truncate">{item.type}</p>
                  <span className="text-[10px] text-[#9AA1A9] font-medium whitespace-nowrap">{item.time}</span>
                </div>
                <p className="text-[10px] text-[#6B7283] mt-0.5">Lead: <span className="text-[#1A3C2A] font-semibold">{item.lead}</span></p>
              </div>
              <ChevronRight size={14} className="text-[#D8CFB9] group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => alert("Viewing all tasks...")}
        className="p-3 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-[#E8E2D6]"
      >
        View All Tasks
      </button>
    </div>
  );
}

export function RepresentativePerformance() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-sm flex flex-col overflow-hidden">
      <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-text">Top Performers</h3>
        <button className="text-[10px] font-bold text-primary hover:underline">View Team</button>
      </div>
      <div className="p-4 space-y-4">
        {repPerformance.map((rep, idx) => (
          <div key={rep.name} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold group-hover:bg-primary group-hover:text-white transition-all">
              {rep.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-brand-text truncate group-hover:text-primary transition-colors">{rep.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-[#9AA1A9]">Visits: <b className="text-[#1A3C2A]">{rep.visits}</b></span>
                <span className="text-[10px] text-[#9AA1A9]">Bookings: <b className="text-[#1A3C2A]">{rep.bookings}</b></span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-[#133C27]">{rep.rate}</p>
              <p className="text-[9px] text-[#9AA1A9] font-medium">Conv. Rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeadSummaryWidget() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-sm flex flex-col overflow-hidden col-span-1 lg:col-span-2">
      <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-text">Lead Summary</h3>
        <button 
          onClick={() => alert("Redirecting to detailed reports...")}
          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
        >
          View Detailed Report <ExternalLink size={12} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F1E9D4]/50">
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B7283] uppercase">Lead Name</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B7283] uppercase">Project</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B7283] uppercase">RM</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B7283] uppercase">Stage</th>
              <th className="px-5 py-3 text-[10px] font-bold text-[#6B7283] uppercase">Next Follow-up</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1E9D4]">
            {recentLeads.map((lead) => (
              <tr key={lead.name} className="hover:bg-[#F8F5EE] transition-colors cursor-pointer group">
                <td className="px-5 py-3">
                  <p className="text-xs font-bold text-brand-text group-hover:text-primary transition-colors">{lead.name}</p>
                  <p className="text-[10px] text-[#9AA1A9]">{lead.source}</p>
                </td>
                <td className="px-5 py-3 text-xs text-[#6B7283]">{lead.project}</td>
                <td className="px-5 py-3 text-xs text-[#6B7283]">{lead.rm}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    lead.stage === 'Qualified' ? "bg-[#E1F5E8] text-[#133C27]" :
                    lead.stage === 'New' ? "bg-[#E8F5EC] text-[#133C27]" :
                    lead.stage === 'Site Visit' ? "bg-[#E1F0FA] text-[#1A6B8C]" :
                    lead.stage === 'Negotiation' ? "bg-[#FDF5E1] text-[#B8960F]" :
                    lead.stage === 'Contacted' ? "bg-[#FCF3E1] text-[#C9A82C]" :
                    "bg-[#FCF3E1] text-[#C9A82C]"
                  )}>
                    {lead.stage}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-[#1A3C2A]">{lead.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ActivityTimeline() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D6] shadow-sm flex flex-col overflow-hidden">
      <div className="p-5 border-b border-[#E8E2D6] flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-text">Activity Timeline</h3>
        <button className="p-1.5 hover:bg-[#F1E9D4] rounded-lg transition-colors">
          <Clock size={14} className="text-[#9AA1A9]" />
        </button>
      </div>
      <div className="p-5 flex-1 relative">
        <div className="absolute left-7 top-5 bottom-5 w-px bg-[#E8E2D6]" />
        <div className="space-y-6">
          {activityTimeline.map((activity) => (
            <div key={activity.id} className="relative flex gap-4 pl-6">
              <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-primary z-10" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-tight">{activity.type}</p>
                  <span className="text-[10px] text-[#9AA1A9] font-medium">{activity.time}</span>
                </div>
                <p className="text-xs text-brand-text mt-0.5 font-medium">{activity.desc}</p>
                <p className="text-[10px] text-[#9AA1A9] mt-1 flex items-center gap-1">
                  <UserPlus size={10} /> {activity.user}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
