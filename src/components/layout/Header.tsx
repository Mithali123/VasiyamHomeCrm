"use client";

import { 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Command,
  LogOut,
  Settings,
  UserCircle,
  HelpCircle,
  Star,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, title: "New Lead Assigned", desc: "John Doe from Website source", time: "5m ago", unread: true },
  { id: 2, title: "SLA Breach Alert", desc: "Lead #8234 response overdue", time: "1h ago", unread: true },
  { id: 3, title: "Meeting Scheduled", desc: "Site visit with Jane Smith", time: "2h ago", unread: false },
];

export default function Header() {
  const pathname = usePathname();
  const isLeadsPage = pathname === "/dashboard/leads";
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-gray-200 bg-white sticky top-0 z-30 px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-4 flex-1">
        {/* Dynamic Page Title & Subtitle based on Route */}
        {isLeadsPage ? (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-[#1F1F1F] tracking-tight">Lead Management</h1>
              <button className="text-gray-400 hover:text-amber-500 transition-colors">
                <Star size={14} className="stroke-[1.5]" />
              </button>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Manage, track and convert leads into happy customers.
            </p>
          </div>
        ) : (
          <div className="flex flex-col text-left">
            <h1 className="text-lg font-black text-[#1F1F1F] tracking-tight">Dashboard</h1>
            <p className="text-[10px] text-gray-500 font-medium">Overview of your business performance.</p>
          </div>
        )}
        
        {/* GLOBAL SEARCH INPUT (Centered or Left-align space) */}
        <div className="hidden lg:flex items-center bg-[#F8F5EE] px-3.5 py-2 rounded-xl border border-gray-200/60 focus-within:border-primary/45 focus-within:bg-white transition-all w-[380px] group ml-6">
          <Search size={14} className="text-gray-400 group-focus-within:text-primary transition-colors shrink-0" />
          <input 
            type="text" 
            placeholder="Search by name, phone, email, lead ID or project" 
            className="bg-transparent border-none focus:outline-none text-[11px] w-full ml-2.5 placeholder:text-gray-400 text-brand-text font-medium"
          />
          <div className="flex items-center gap-0.5 bg-gray-200/70 px-1 py-0.5 rounded text-[8px] text-gray-500 font-bold shrink-0">
            <Command size={8} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* NOTIFICATIONS BELL */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 text-gray-500 hover:bg-[#F8F5EE] rounded-full transition-colors relative",
              showNotifications && "bg-[#F8F5EE] text-primary"
            )}
          >
            <Bell size={18} className="stroke-[1.5]" />
            {/* Circular badge count - matches screenshot badge "8" */}
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border border-white text-[8px] font-black text-white flex items-center justify-center">
              8
            </span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-150 shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-xs text-brand-text">Notifications</h3>
                  <button className="text-[9px] font-black text-primary hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                          {n.id === 2 ? <Clock size={13} /> : <CheckCircle2 size={13} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-brand-text truncate leading-none">{n.title}</p>
                          <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{n.desc}</p>
                          <p className="text-[9px] text-gray-500 mt-1.5">{n.time}</p>
                        </div>
                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full p-3 text-center text-[9px] font-black text-gray-400 hover:text-primary transition-colors border-t border-gray-100 bg-gray-50/50">
                  View All Notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HELP ICON */}
        <button 
          className="p-2 text-gray-500 hover:bg-[#F8F5EE] rounded-full transition-colors"
          title="Help & Documentation"
        >
          <HelpCircle size={18} className="stroke-[1.5]" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* PROFILE DROP-DOWN */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={cn(
              "flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-[#F8F5EE] rounded-full transition-colors group",
              showProfile && "bg-[#F8F5EE]"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[#0D2E1D] flex items-center justify-center text-white font-black text-xs">
              SA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-brand-text leading-tight">Super Admin</p>
            </div>
            <ChevronDown size={14} className={cn("text-gray-400 group-hover:text-primary transition-all", showProfile && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-gray-150 shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-xs font-bold text-brand-text truncate">superadmin@vasiyam.com</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                    <UserCircle size={15} /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-all border-b border-gray-50 pb-3 mb-1">
                    <Settings size={15} /> Account Settings
                  </button>
                  <button 
                    onClick={() => {
                      alert("Logging out...");
                      window.location.reload();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
