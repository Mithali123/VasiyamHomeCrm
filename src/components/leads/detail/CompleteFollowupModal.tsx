// src/components/leads/detail/CompleteFollowupModal.tsx
import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { completeFollowupAction } from "@/lib/leadsStore";

const relationshipManagers = ["Arun Kumar", "Meera Nair", "Divya Sharma", "Suresh Pillai", "Rajesh Khanna"];
const leadStages = ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Booked", "Lost"];

interface CompleteFollowupModalProps {
  leadId: string;
  followupId: string | null;
  isOpen: boolean;
  onClose: () => void;
  defaultRM: string;
  defaultStage: string;
  defaultBudget: number;
  onSuccess: () => void;
  onOpenScheduleNext: () => void;
}

export function CompleteFollowupModal({
  leadId,
  followupId,
  isOpen,
  onClose,
  defaultRM,
  defaultStage,
  defaultBudget,
  onSuccess,
  onOpenScheduleNext
}: CompleteFollowupModalProps) {
  const [compOutcome, setCompOutcome] = useState("");
  const [compResponse, setCompResponse] = useState<"Positive" | "Neutral" | "Negative" | "No Response">("Positive");
  const [compDiscussion, setCompDiscussion] = useState("");
  const [compBudget, setCompBudget] = useState(defaultBudget ? defaultBudget.toString() : "");
  const [compPreferences, setCompPreferences] = useState("");
  const [compObjections, setCompObjections] = useState("");
  const [compDocs, setCompDocs] = useState("");
  const [compSiteFeedback, setCompSiteFeedback] = useState("");
  const [compNegNotes, setCompNegNotes] = useState("");
  const [compInternalNotes, setCompInternalNotes] = useState("");
  const [compScheduleNext, setCompScheduleNext] = useState(false);

  const [compActualTime, setCompActualTime] = useState("");
  const [compLeadTemperature, setCompLeadTemperature] = useState<"Hot" | "Warm" | "Cold">("Warm");
  const [compNextAction, setCompNextAction] = useState("");
  const [compDuration, setCompDuration] = useState("15 mins");
  const [compCompletedBy, setCompCompletedBy] = useState("Super Admin");

  const [compStageChangeEnabled, setCompStageChangeEnabled] = useState(false);
  const [compNextStage, setCompNextStage] = useState<any>(defaultStage || "Contacted");
  const [compRMChangeEnabled, setCompRMChangeEnabled] = useState(false);
  const [compNextRM, setCompNextRM] = useState(defaultRM || relationshipManagers[0]);

  // Set default times and preferences upon mounting or opening
  useEffect(() => {
    if (isOpen) {
      setCompActualTime(new Date().toISOString().replace("T", " ").substring(0, 16));
      setCompBudget(defaultBudget ? defaultBudget.toString() : "");
      setCompNextStage(defaultStage || "Contacted");
      setCompNextRM(defaultRM || relationshipManagers[0]);
    }
  }, [isOpen, defaultBudget, defaultStage, defaultRM]);

  if (!isOpen || !followupId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const budgetNum = compBudget ? parseInt(compBudget.replace(/[^0-9]/g, "")) : undefined;

    completeFollowupAction(leadId, followupId, {
      outcome: compOutcome,
      customerResponse: compResponse,
      discussionSummary: compDiscussion,
      budgetConfirmation: budgetNum,
      propertyPreferenceUpdates: compPreferences || undefined,
      objectionsRaised: compObjections || undefined,
      documentsShared: compDocs || undefined,
      siteVisitFeedback: compSiteFeedback || undefined,
      negotiationNotes: compNegNotes || undefined,
      internalNotes: compInternalNotes || undefined,
      performedBy: defaultRM || "RM",
      completedBy: compCompletedBy,
      duration: compDuration,
      leadTemperature: compLeadTemperature,
      nextRecommendedAction: compNextAction || undefined,
      advanceStage: compStageChangeEnabled ? compNextStage : undefined,
      reassignRM: compRMChangeEnabled ? compNextRM : undefined
    });

    // Reset local states
    setCompOutcome("");
    setCompDiscussion("");
    setCompPreferences("");
    setCompObjections("");
    setCompDocs("");
    setCompSiteFeedback("");
    setCompNegNotes("");
    setCompInternalNotes("");
    setCompNextAction("");
    setCompStageChangeEnabled(false);
    setCompRMChangeEnabled(false);

    onSuccess();
    onClose();

    if (compScheduleNext) {
      setTimeout(() => {
        onOpenScheduleNext();
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="relative bg-white border border-[#E8E2D6] rounded-2xl shadow-xl w-full max-w-2xl p-6 overflow-hidden z-10 text-left flex flex-col max-h-[90vh]">
        <h3 className="text-base font-black text-primary uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 shrink-0">
          <CheckCircle size={16} className="text-[#C9A82C]" />
          <span>Log Follow-up Outcomes & Close Task</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 py-3 overflow-y-auto pr-1 flex-1">
          {/* Mandatory Fields */}
          <div className="p-3 bg-gray-50 border rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-black text-gray-400 block border-b pb-1">Mandatory Completion Fields</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
              <div>
                <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1">Outcome / Subject</label>
                <input
                  type="text"
                  required
                  value={compOutcome}
                  onChange={(e) => setCompOutcome(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="e.g. Pricing verified, layout finalized"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1">Customer Sentiment / Response</label>
                <select
                  value={compResponse}
                  onChange={(e) => setCompResponse(e.target.value as any)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="Positive">Positive Response</option>
                  <option value="Neutral">Neutral Response</option>
                  <option value="Negative">Negative / Hesitant</option>
                  <option value="No Response">No Response / Silent</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1">Lead Temperature</label>
                <select
                  value={compLeadTemperature}
                  onChange={(e) => setCompLeadTemperature(e.target.value as any)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="Hot">🔥 Hot (Highly Interested)</option>
                  <option value="Warm">⚡ Warm (Nurturing Needed)</option>
                  <option value="Cold">❄️ Cold (Low Interest)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1">Next Recommended Action</label>
                <input
                  type="text"
                  required
                  value={compNextAction}
                  onChange={(e) => setCompNextAction(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="e.g. Schedule loan callback, prepare agreement draft"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1 font-bold">Actual Completion Date & Time</label>
                <input
                  type="text"
                  required
                  value={compActualTime}
                  onChange={(e) => setCompActualTime(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1">Call / Meeting Duration</label>
                <input
                  type="text"
                  required
                  value={compDuration}
                  onChange={(e) => setCompDuration(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="e.g. 15 mins, 1 hour"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1">Completed By (Author)</label>
                <input
                  type="text"
                  required
                  value={compCompletedBy}
                  onChange={(e) => setCompCompletedBy(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-black text-gray-450 uppercase tracking-wider mb-1 font-bold">Discussion Summary Details</label>
              <textarea
                required
                value={compDiscussion}
                onChange={(e) => setCompDiscussion(e.target.value)}
                rows={2}
                className="w-full text-xs font-medium p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                placeholder="Provide a comprehensive conversation summary..."
              />
            </div>
          </div>

          {/* Context Updates */}
          <div className="p-3 bg-gray-50 border rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-black text-gray-400 block border-b pb-1">Contextual Updates & Objections</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
              <div>
                <label className="block text-[10px] font-black text-gray-400 tracking-wider mb-1">Confirmed Budget (₹)</label>
                <input
                  type="text"
                  value={compBudget}
                  onChange={(e) => setCompBudget(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="Stated budget limit"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 tracking-wider mb-1">Property Preference Updates</label>
                <input
                  type="text"
                  value={compPreferences}
                  onChange={(e) => setCompPreferences(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="e.g. 3BHK flat, east facing"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-black text-[#A62626] tracking-wider mb-1">Objections Raised (Blockers)</label>
                <input
                  type="text"
                  value={compObjections}
                  onChange={(e) => setCompObjections(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-red-155 text-red-650 placeholder:text-red-300 rounded-lg focus:outline-none"
                  placeholder="Pricing concerns, layout objections, registration waivers..."
                />
              </div>
            </div>
          </div>

          {/* Specific audits */}
          <div className="p-3 bg-gray-50 border rounded-xl space-y-2">
            <span className="text-[9px] uppercase font-black text-gray-400 block border-b pb-1">Activity-Specific Auditing Notes</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
              <div>
                <label className="block text-[10px] font-black text-gray-405 tracking-wider mb-1">Documents Exchanged</label>
                <input
                  type="text"
                  value={compDocs}
                  onChange={(e) => setCompDocs(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="catalog.pdf, quote.pdf"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-455 tracking-wider mb-1">Site Visit Feedback</label>
                <input
                  type="text"
                  value={compSiteFeedback}
                  onChange={(e) => setCompSiteFeedback(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="Reactions, choices"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-455 tracking-wider mb-1">Negotiation Offer Details</label>
                <input
                  type="text"
                  value={compNegNotes}
                  onChange={(e) => setCompNegNotes(e.target.value)}
                  className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                  placeholder="Discounts proposed"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-black text-gray-400 tracking-wider mb-1">Internal RM private comments (Restricted)</label>
              <input
                type="text"
                value={compInternalNotes}
                onChange={(e) => setCompInternalNotes(e.target.value)}
                className="w-full text-xs font-medium p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
                placeholder="Private notes (Admin visible only)"
              />
            </div>
          </div>

          {/* Post Completion */}
          <div className="p-4 bg-[#F8F5EE] border border-[#E8E2D6] rounded-xl space-y-3">
            <span className="text-[10px] font-black uppercase text-primary block border-b pb-1.5 tracking-wider">
              Chained Post-Completion Actions (Optional)
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={compStageChangeEnabled}
                    onChange={(e) => setCompStageChangeEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>Advance Lead Stage:</span>
                </label>
                {compStageChangeEnabled && (
                  <select
                    value={compNextStage}
                    onChange={(e) => setCompNextStage(e.target.value as any)}
                    className="font-bold p-1 bg-white border border-[#E8E2D6] rounded focus:outline-none cursor-pointer text-xs"
                  >
                    {leadStages.map((stg) => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex items-center gap-2 font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={compRMChangeEnabled}
                    onChange={(e) => setCompRMChangeEnabled(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>Reassign to Another RM:</span>
                </label>
                {compRMChangeEnabled && (
                  <select
                    value={compNextRM}
                    onChange={(e) => setCompNextRM(e.target.value)}
                    className="font-bold p-1 bg-white border border-[#E8E2D6] rounded focus:outline-none cursor-pointer text-xs"
                  >
                    {relationshipManagers.map((rm) => (
                      <option key={rm} value={rm}>{rm}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="scheduleNextCheckModal"
                  checked={compScheduleNext}
                  onChange={(e) => setCompScheduleNext(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer accent-primary"
                />
                <label htmlFor="scheduleNextCheckModal" className="font-extrabold text-gray-700 cursor-pointer select-none">
                  Launch Scheduler to book the next follow-up task immediately after closing this one
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t text-xs shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-500 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#133C27] hover:bg-primary-dark text-white font-bold rounded-lg cursor-pointer"
            >
              Save Outcomes & Close Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
