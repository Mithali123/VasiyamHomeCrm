"use client";

import { 
  Search, 
  Bell, 
  RefreshCw, 
  User, 
  ChevronDown,
  Command,
  LogOut,
  Settings,
  UserCircle,
  Mail,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const notifications = [
  { id: 1, title: "New Lead Assigned", desc: "John Doe from Website source", time: "5m ago", unread: true },
  { id: 2, title: "SLA Breach Alert", desc: "Lead #8234 response overdue", time: "1h ago", unread: true },
  { id: 3, title: "Meeting Scheduled", desc: "Site visit with Jane Smith", time: "2h ago", unread: false },
];

export default function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary tracking-tight">Dashboard</h1>
        
        {/* GLOBAL SEARCH */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 focus-within:border-primary/40 focus-within:bg-white transition-all w-80 group">
          <Search size={16} className="text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search leads, customers, projects..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 placeholder:text-gray-400 text-brand-text"
          />
          <div className="flex items-center gap-1 bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-500 font-medium">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* REFRESH */}
        <button 
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
          title="Refresh Dashboard"
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw size={18} />
          </motion.div>
        </button>

        {/* NOTIFICATIONS */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative",
              showNotifications && "bg-gray-100 text-primary"
            )}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-brand-text">Notifications</h3>
                  <button className="text-[10px] font-bold text-primary hover:underline">Mark all as read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          n.id === 2 ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"
                        )}>
                          {n.id === 2 ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs font-bold leading-none", n.unread ? "text-brand-text" : "text-gray-500")}>{n.title}</p>
                          <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{n.desc}</p>
                          <p className="text-[9px] text-gray-500 mt-1.5">{n.time}</p>
                        </div>
                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full p-3 text-center text-[10px] font-bold text-gray-400 hover:text-primary transition-colors border-t border-gray-100 bg-gray-50/50">
                  View All Notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1" />

        {/* USER PROFILE */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={cn(
              "flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-gray-100 rounded-full transition-colors group",
              showProfile && "bg-gray-100"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
              <User size={18} />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-brand-text leading-tight">Admin User</p>
              <p className="text-[10px] text-gray-500">Super Admin</p>
            </div>
            <ChevronDown size={14} className={cn("text-gray-400 group-hover:text-primary transition-all", showProfile && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-brand-text truncate">admin@vasiyam.com</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                    <UserCircle size={16} /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-all border-b border-gray-50 pb-3 mb-1">
                    <Settings size={16} /> Account Settings
                  </button>
                  <button 
                    onClick={() => {
                      alert("Logging out...");
                      window.location.reload();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={16} /> Sign Out
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
