// src/components/leads/detail/ScheduleFollowupModal.tsx
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { scheduleFollowupAction } from "@/lib/leadsStore";

const relationshipManagers = ["Arun Kumar", "Meera Nair", "Divya Sharma", "Suresh Pillai", "Rajesh Khanna"];

interface ScheduleFollowupModalProps {
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
  defaultRM: string;
  onSuccess: () => void;
}

export function ScheduleFollowupModal({
  leadId,
  isOpen,
  onClose,
  defaultRM,
  onSuccess
}: ScheduleFollowupModalProps) {
  const [schedType, setSchedType] = useState<"Call" | "WhatsApp" | "Email" | "Meeting" | "Site Visit">("Call");
  const [schedPriority, setSchedPriority] = useState<"Low" | "Medium" | "High" | "Critical">("Medium");
  const [schedDate, setSchedDate] = useState("");
  const [schedRM, setSchedRM] = useState(defaultRM || relationshipManagers[0]);
  const [schedBy, setSchedBy] = useState("Super Admin");
  const [schedReminder, setSchedReminder] = useState("");
  const [schedReminderTime, setSchedReminderTime] = useState("15 minutes before");
  const [schedPurpose, setSchedPurpose] = useState("");
  const [schedNotes, setSchedNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedDate) {
      alert("Please specify a scheduled date and time.");
      return;
    }
    scheduleFollowupAction(leadId, {
      type: schedType,
      priority: schedPriority,
      scheduledDate: schedDate,
      conductedBy: schedRM,
      createdBy: schedBy,
      scheduledBy: schedBy,
      reminder: schedReminder || undefined,
      reminderTime: schedReminderTime || undefined,
      purpose: schedPurpose,
      notes: schedNotes || undefined
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="relative bg-white border border-[#E8E2D6] rounded-2xl shadow-xl w-full max-w-lg p-6 overflow-hidden z-10 text-left space-y-4">
        <h3 className="text-base font-black text-primary uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
          <Calendar size={16} className="text-[#C9A82C]" />
          <span>Schedule Next CRM Follow-up</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Follow-up Type</label>
              <select
                value={schedType}
                onChange={(e) => setSchedType(e.target.value as any)}
                className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="Call">Phone Call</option>
                <option value="WhatsApp">WhatsApp Chat</option>
                <option value="Email">Email Communication</option>
                <option value="Meeting">Office Meeting</option>
                <option value="Site Visit">Site Visit</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Priority Level</label>
              <select
                value={schedPriority}
                onChange={(e) => setSchedPriority(e.target.value as any)}
                className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                required
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 font-bold">Reminder Trigger Window</label>
              <select
                value={schedReminderTime}
                onChange={(e) => setSchedReminderTime(e.target.value)}
                className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="5 minutes before">5 mins before</option>
                <option value="15 minutes before">15 mins before</option>
                <option value="30 minutes before">30 mins before</option>
                <option value="1 hour before">1 hour before</option>
                <option value="2 hours before">2 hours before</option>
                <option value="1 day before">1 day before</option>
                <option value="No reminder">No reminder</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Relationship Manager</label>
              <select
                value={schedRM}
                onChange={(e) => setSchedRM(e.target.value)}
                className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none cursor-pointer"
              >
                {relationshipManagers.map((rm) => (
                  <option key={rm} value={rm}>{rm}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Created By</label>
              <input
                type="text"
                required
                value={schedBy}
                onChange={(e) => setSchedBy(e.target.value)}
                className="w-full font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 font-bold">Purpose of Contact</label>
            <input
              type="text"
              required
              value={schedPurpose}
              onChange={(e) => setSchedPurpose(e.target.value)}
              className="w-full text-xs font-bold p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
              placeholder="e.g. modular woodwork preferences, bank pre-approval checks..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Reminder Instructions / Driver notes</label>
            <input
              type="text"
              value={schedReminder}
              onChange={(e) => setSchedReminder(e.target.value)}
              className="w-full text-xs font-medium p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
              placeholder="e.g. Call to discuss site photos, pick-up at 10 AM"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">RM Preparation Notes</label>
            <textarea
              value={schedNotes}
              onChange={(e) => setSchedNotes(e.target.value)}
              rows={2}
              className="w-full text-xs font-medium p-2 bg-white border border-[#E8E2D6] rounded-lg focus:outline-none"
              placeholder="Private prep notes for task..."
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
              Book Follow-up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
