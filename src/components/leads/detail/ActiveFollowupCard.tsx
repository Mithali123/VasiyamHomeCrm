// src/components/leads/detail/ActiveFollowupCard.tsx
import React from "react";
import { Calendar, Plus, Info, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { FollowupRecord } from "@/mock/leadDetails";
import { cn } from "@/lib/utils";

interface ActiveFollowupCardProps {
  activeFollowup: FollowupRecord | null;
  leadContext: {
    id: string;
    name: string;
    mobile: string;
    project: string;
    stage: string;
    rm: string;
  };
  onLogCompletion?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
  onOpenSchedule?: () => void;
  readOnly?: boolean;
}

export function ActiveFollowupCard({
  activeFollowup,
  leadContext,
  onLogCompletion,
  onReschedule,
  onCancel,
  onOpenSchedule,
  readOnly = false
}: ActiveFollowupCardProps) {
  return (
    <div className="bg-white border border-[#E8E2D6] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h4 className="text-xs font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
          <Calendar size={13} className="text-[#C9A82C]" />
          <span>Active Scheduled Follow-up</span>
        </h4>

        <div className="flex items-center gap-2">
          {activeFollowup && (
            <span className={cn(
              "px-2.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-tight",
              activeFollowup.priority === "Critical" ? "bg-red-100 text-red-700 border-red-300" :
              activeFollowup.priority === "High" ? "bg-orange-100 text-orange-700 border-orange-250" :
              activeFollowup.priority === "Medium" ? "bg-amber-100 text-amber-700 border-amber-250" :
              "bg-gray-100 text-gray-600 border-gray-200"
            )}>
              {activeFollowup.priority} Priority
            </span>
          )}
          {activeFollowup ? (
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-tight",
              activeFollowup.status === "Due Today" ? "bg-amber-100 text-amber-800 border-amber-250 animate-pulse" :
              activeFollowup.status === "Overdue" ? "bg-red-100 text-red-700 border-red-200" :
              activeFollowup.status === "Upcoming" ? "bg-blue-50 text-blue-700 border-blue-150" :
              "bg-gray-100 text-gray-600 border-gray-200"
            )}>
              {activeFollowup.status}
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-gray-50 border rounded text-[9px] text-gray-400 font-bold uppercase">
              No Active Task
            </span>
          )}
        </div>
      </div>

      {activeFollowup ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-55/50 p-3 rounded-xl border border-dashed">
            <div>
              <span className="text-[9px] uppercase text-gray-400 font-black">Type & Date</span>
              <p className="font-extrabold text-[#1A3C2A] mt-0.5">
                {activeFollowup.type} — {new Date(activeFollowup.scheduledDate).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
            <div>
              <span className="text-[9px] uppercase text-gray-400 font-black">Reminder Time</span>
              <p className="font-bold text-gray-700 mt-0.5">{activeFollowup.reminderTime || "No Reminder Set"}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-gray-400 font-bold text-[9px] uppercase">Purpose</span>
              <p className="font-extrabold text-[#1A3C2A] mt-0.5">{activeFollowup.purpose || "No Purpose Stated"}</p>
            </div>

            <div>
              <span className="text-gray-400 font-bold text-[9px] uppercase">Customer Context</span>
              <p className="text-gray-700 mt-0.5">
                Name: <strong>{leadContext.name}</strong> ({leadContext.mobile}) | Project: <strong>{leadContext.project}</strong> | Stage: <strong>{leadContext.stage}</strong>
              </p>
            </div>

            {activeFollowup.reminder && (
              <div className="p-2 bg-yellow-50 border border-yellow-150 rounded-lg text-yellow-800 text-[10px] flex items-center gap-1 font-semibold">
                <Info size={11} className="shrink-0" />
                <span>Reminder Details: {activeFollowup.reminder}</span>
              </div>
            )}

            {activeFollowup.notes && (
              <div>
                <span className="text-gray-400 font-bold text-[9px] uppercase">RM Preparation Notes</span>
                <p className="text-gray-600 italic font-medium mt-0.5 bg-gray-50 p-2 rounded border border-gray-100">
                  "{activeFollowup.notes}"
                </p>
              </div>
            )}

            {activeFollowup.lastModified && (
              <div className="text-[9.5px] text-gray-400 italic">
                Last Updated: {activeFollowup.lastModified}
              </div>
            )}
          </div>

          {/* Standardized Key-Value ownership alignment */}
          <div className="border-t border-[#E8E2D6] pt-3 text-[11px] font-mono text-gray-700 space-y-0.5 bg-gray-50/50 p-3 rounded-xl">
            <div className="flex"><span className="w-40 text-gray-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">👤 Relationship Manager</span><span className="mr-2">:</span><span className="font-black text-primary">{activeFollowup.conductedBy || "Not Assigned"}</span></div>
            <div className="flex"><span className="w-40 text-gray-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">📝 Created By</span><span className="mr-2">:</span><span className="font-bold text-gray-600">{activeFollowup.scheduledBy || activeFollowup.createdBy || "System"}</span></div>
          </div>

          {!readOnly && (
            <div className="flex gap-2 justify-end pt-2 border-t text-xs">
              <button
                onClick={() => onLogCompletion && onLogCompletion(activeFollowup.id)}
                className="px-4 py-2 bg-[#133C27] hover:bg-primary-dark text-white font-extrabold rounded-lg cursor-pointer flex items-center gap-1 transition-transform active:scale-95 shadow-sm"
              >
                <CheckCircle size={13} />
                <span>Log Completion</span>
              </button>

              <button
                onClick={() => onReschedule && onReschedule(activeFollowup.id)}
                className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 font-extrabold rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
              >
                <RefreshCw size={13} className="text-[#C9A82C]" />
                <span>Reschedule</span>
              </button>

              <button
                onClick={() => onCancel && onCancel(activeFollowup.id)}
                className="px-3 py-2 bg-white hover:bg-red-50 border border-red-200 text-red-650 font-extrabold rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
              >
                <AlertCircle size={13} />
                <span>Cancel Task</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-xs text-gray-400 italic">No active scheduled follow-ups found for this client.</p>
          {!readOnly && onOpenSchedule && (
            <button
              onClick={onOpenSchedule}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#133C27] text-white hover:bg-primary-dark rounded-lg text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
            >
              <Plus size={14} /> Schedule Follow-up
            </button>
          )}
        </div>
      )}
    </div>
  );
}
