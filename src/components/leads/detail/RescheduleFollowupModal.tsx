// src/components/leads/detail/RescheduleFollowupModal.tsx
import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { rescheduleFollowupAction, getStoredLeadDetails } from "@/lib/leadsStore";

interface RescheduleFollowupModalProps {
  leadId: string;
  followupId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate: string;
  initialPriority: "Low" | "Medium" | "High" | "Critical";
  defaultRM: string;
}

export function RescheduleFollowupModal({
  leadId,
  followupId,
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  initialPriority,
  defaultRM
}: RescheduleFollowupModalProps) {
  const [reschedDate, setReschedDate] = useState("");
  const [reschedPriority, setReschedPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [reschedReason, setReschedReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReschedDate(initialDate ? initialDate.replace(" ", "T").substring(0, 16) : "");
      setReschedPriority(initialPriority || "Medium");
      setReschedReason("");
    }
  }, [isOpen, initialDate, initialPriority]);

  if (!isOpen || !followupId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedDate) return;

    const details = getStoredLeadDetails(leadId);
    const activeFollowupObj = details?.followupHistory?.find(f => f.id === followupId);
    if (!activeFollowupObj) {
      alert("Original task not found.");
      return;
    }

    rescheduleFollowupAction(leadId, followupId, {
      type: activeFollowupObj.type,
      priority: reschedPriority,
      scheduledDate: reschedDate,
      conductedBy: activeFollowupObj.conductedBy || defaultRM || "RM",
      createdBy: activeFollowupObj.createdBy || "System",
      scheduledBy: "Super Admin",
      reminder: activeFollowupObj.reminder,
      reminderTime: activeFollowupObj.reminderTime,
      purpose: activeFollowupObj.purpose,
      notes: activeFollowupObj.notes,
      reason: reschedReason,
      performedBy: "Super Admin"
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="relative bg-white border border-[#E8E2D6] rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden z-10 text-left space-y-4">
        <h3 className="text-base font-black text-primary uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <RefreshCw size={16} className="text-[#C9A82C]" />
          <span>Reschedule Current Follow-up</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">New Scheduled Date & Time</label>
            <input
              type="datetime-local"
              required
              value={reschedDate}
              onChange={(e) => setReschedDate(e.target.value)}
              className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Priority Level</label>
            <select
              value={reschedPriority}
              onChange={(e) => setReschedPriority(e.target.value as any)}
              className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Reschedule Reason / Objections</label>
            <textarea
              required
              value={reschedReason}
              onChange={(e) => setReschedReason(e.target.value)}
              rows={2}
              className="w-full font-medium p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
              placeholder="Provide reason (e.g. Customer out of town, requested call tomorrow...)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t text-xs">
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
              Reschedule Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
