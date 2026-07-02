// src/components/leads/detail/FollowupHistoryLog.tsx
import React from "react";
import { Info } from "lucide-react";
import { FollowupRecord } from "@/mock/leadDetails";
import { cn } from "@/lib/utils";

interface FollowupHistoryLogProps {
  followupHistory: FollowupRecord[];
  currentRM: string;
}

export function FollowupHistoryLog({ followupHistory, currentRM }: FollowupHistoryLogProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-black uppercase text-[#1A3C2A] border-b pb-1 tracking-wider">
        Permanent Chronological Follow-up History Log
      </h4>

      {(!followupHistory || followupHistory.length === 0) ? (
        <p className="text-xs text-gray-400 italic">No follow-ups logged yet.</p>
      ) : (
        <div className="space-y-3">
          {followupHistory.map((f) => (
            <div
              key={f.id}
              className="border border-[#E8E2D6] rounded-xl p-4 bg-white space-y-3 text-xs hover:shadow-[0_1px_5px_rgba(0,0,0,0.02)] transition-shadow"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-primary px-2.5 py-0.5 bg-[#E8F5EC] border rounded text-[10px] tracking-wide uppercase">
                    {f.type || "Follow-up"}
                  </span>
                  <span className="text-[9px] font-black border uppercase px-1 py-0.2 rounded bg-gray-50 text-gray-500">
                    {f.priority || "Medium"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-extrabold">
                    Sched:{" "}
                    {f.scheduledDate
                      ? new Date(f.scheduledDate).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "Date Unavailable"}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-black text-[9px] uppercase px-2 py-0.5 rounded-full border tracking-wide",
                    f.status === "Completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : f.status === "Cancelled"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : f.status === "Rescheduled"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : f.status === "Overdue"
                      ? "bg-red-100 text-red-700 border-red-300 animate-pulse"
                      : "bg-gray-55/70 text-gray-500 border-gray-200"
                  )}
                >
                  {f.status || "Scheduled"}
                </span>
              </div>

              {/* Purpose & Context */}
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-[#1A3C2A] flex flex-wrap items-center gap-1">
                  <span className="text-gray-400 font-bold uppercase text-[9px]">Purpose:</span>
                  <span>{f.purpose || "No Purpose Stated"}</span>
                  {f.reminderTime && (
                    <span className="text-gray-400 text-[9px] font-medium ml-2">• Remind: {f.reminderTime}</span>
                  )}
                </div>
                {f.notes && <p className="text-gray-550 italic text-[10px]">Preparation Notes: "{f.notes}"</p>}
              </div>

              {/* Completion outcome detailed audit block */}
              {f.status === "Completed" && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2 mt-2">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[9px] uppercase text-emerald-800">Outcome & Discussion Ledger</span>
                      {f.leadTemperature && (
                        <span
                          className={cn(
                            "text-[8px] font-black uppercase px-1 py-0.2 border rounded",
                            f.leadTemperature === "Hot"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : f.leadTemperature === "Warm"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          )}
                        >
                          {f.leadTemperature} Temp
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold font-bold">
                      Closed: {f.completedDate || "Date Unavailable"} (Dur: {f.duration || "10 mins"})
                    </span>
                  </div>

                  <p className="text-[#1A3C2A] font-extrabold text-[11px] leading-relaxed">
                    {f.outcome || "No Outcome Recorded"}
                  </p>

                  {f.discussionSummary && (
                    <div className="text-[11px] text-gray-700 font-medium">
                      <span className="text-gray-400 font-black uppercase text-[8px] mr-1">Conversation Summary:</span>
                      <span>{f.discussionSummary}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-gray-200/50">
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[8px]">Cust Sentiment:</span>
                      <span
                        className={cn(
                          "font-black ml-1 uppercase text-[9px]",
                          f.customerResponse === "Positive"
                            ? "text-emerald-700"
                            : f.customerResponse === "Negative"
                            ? "text-red-650"
                            : "text-gray-500"
                        )}
                      >
                        {f.customerResponse || "Neutral"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[8px]">Confirmed Budget:</span>
                      <span className="font-extrabold ml-1 text-[#1A3C2A]">
                        {f.budgetConfirmation ? `₹${f.budgetConfirmation.toLocaleString("en-IN")}` : "No Update"}
                      </span>
                    </div>

                    {f.nextRecommendedAction && (
                      <div className="col-span-2">
                        <span className="text-gray-400 font-bold uppercase text-[8px]">Next Recommended Action:</span>
                        <span className="font-extrabold text-emerald-800 ml-1">{f.nextRecommendedAction}</span>
                      </div>
                    )}

                    {f.relatedStageChange && f.relatedStageChange !== "None" && (
                      <div className="col-span-2">
                        <span className="text-purple-600 font-bold uppercase text-[8px]">Stage Progression:</span>
                        <span className="font-black text-purple-700 ml-1 uppercase text-[9.5px]">
                          {f.relatedStageChange}
                        </span>
                      </div>
                    )}

                    {f.propertyPreferenceUpdates && (
                      <div className="col-span-2">
                        <span className="text-gray-400 font-bold uppercase text-[8px]">Property Preferences:</span>
                        <span className="font-bold ml-1 text-gray-700">{f.propertyPreferenceUpdates}</span>
                      </div>
                    )}
                    {f.objectionsRaised && (
                      <div className="col-span-2">
                        <span className="text-red-555 font-bold uppercase text-[8px]">Objections Flagged:</span>
                        <span className="font-bold ml-1 text-red-650 italic">"{f.objectionsRaised}"</span>
                      </div>
                    )}
                    {f.documentsShared && (
                      <div className="col-span-2">
                        <span className="text-gray-400 font-bold uppercase text-[8px]">Documents Transacted:</span>
                        <span className="font-bold ml-1 text-gray-600">{f.documentsShared}</span>
                      </div>
                    )}
                    {f.siteVisitFeedback && (
                      <div className="col-span-2">
                        <span className="text-purple-600 font-bold uppercase text-[8px]">Site Visit Feedback:</span>
                        <span className="font-bold ml-1 text-purple-700">{f.siteVisitFeedback}</span>
                      </div>
                    )}
                    {f.negotiationNotes && (
                      <div className="col-span-2">
                        <span className="text-orange-600 font-bold uppercase text-[8px]">Negotiation Notes:</span>
                        <span className="font-bold ml-1 text-orange-700">{f.negotiationNotes}</span>
                      </div>
                    )}
                    {f.internalNotes && (
                      <div className="col-span-2 bg-[#FDF5E1]/30 p-1.5 rounded border border-[#E8E2D6] text-[9.5px]">
                        <span className="text-[#B8960F] font-black uppercase text-[8px] mr-1">RM Ledger Note:</span>
                        <span className="italic text-gray-600 font-medium">"{f.internalNotes}"</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Completion / rescheduling summaries for cancelled / reschedule statuses */}
              {f.status === "Rescheduled" && (
                <div className="bg-amber-55/10 border border-amber-200 p-2.5 rounded-lg text-[10px] text-amber-800 flex items-center gap-1 font-semibold">
                  <Info size={11} className="shrink-0 text-amber-600" />
                  <span>Reschedule Audit: {f.outcome || "Rescheduled"}</span>
                  {f.nextFollowupId && (
                    <span className="text-gray-400 text-[9px] font-medium ml-auto">Chained Task: {f.nextFollowupId}</span>
                  )}
                </div>
              )}

              {f.status === "Cancelled" && (
                <div className="bg-red-50/10 border border-red-200 p-2.5 rounded-lg text-[10px] text-red-800 flex items-center gap-1 font-semibold">
                  <Info size={11} className="shrink-0 text-red-650" />
                  <span>Cancellation Audit: {f.outcome || "Cancelled by relationship manager"}</span>
                </div>
              )}

              {/* Standardized Monospace Audit Footer */}
              <div className="border-t border-[#E8E2D6] pt-3 text-[11px] font-mono text-gray-700 space-y-0.5 bg-gray-50/50 p-3 rounded-xl mt-2">
                <div className="flex">
                  <span className="w-40 text-gray-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">👤 Relationship Manager</span>
                  <span className="mr-2">:</span>
                  <span className="font-black text-primary">
                    {f.conductedBy || "Not Assigned"}
                    {f.conductedBy && currentRM && f.conductedBy !== currentRM ? " (Previous RM)" : ""}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-40 text-gray-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">📝 Created By</span>
                  <span className="mr-2">:</span>
                  <span className="font-bold text-gray-650">{f.scheduledBy || f.createdBy || "System"}</span>
                </div>
                {f.status === "Completed" && (
                  <div className="flex">
                    <span className="w-40 text-gray-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">✅ Completed On</span>
                    <span className="mr-2">:</span>
                    <span className="font-extrabold text-emerald-700">
                      {f.completedDate || "Date N/A"} • {f.duration || "10 mins"}
                    </span>
                  </div>
                )}
                {f.status === "Cancelled" && (
                  <div className="flex">
                    <span className="w-40 text-gray-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">❌ Cancelled On</span>
                    <span className="mr-2">:</span>
                    <span className="font-extrabold text-red-650">
                      {f.completedDate || "Date N/A"}
                    </span>
                  </div>
                )}
                {f.status === "Rescheduled" && (
                  <div className="flex">
                    <span className="w-40 text-gray-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1">🔁 Rescheduled On</span>
                    <span className="mr-2">:</span>
                    <span className="font-extrabold text-amber-700">
                      {f.completedDate || "Date N/A"}
                    </span>
                  </div>
                )}
                {f.lastModified && (
                  <div className="text-[9px] text-gray-400 italic pt-1 border-t border-gray-100 mt-1">
                    Last Audit Change: {f.lastModified}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
