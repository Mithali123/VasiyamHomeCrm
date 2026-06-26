"use client";

import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  User,
  GitFork,
  Mail,
  CheckSquare,
  BarChart3,
  Building,
  Settings,
  Menu,
  Headset,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Geometric gold logo vector icon
const VasiyamLogoSVG = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M12 2L3 11L12 20L21 11L12 2Z"
      stroke="#C59A2C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V20"
      stroke="#C59A2C"
      strokeWidth="1.5"
    />
    <path
      d="M3 11H21"
      stroke="#C59A2C"
      strokeWidth="1.5"
    />
    <path
      d="M8 7L16 15"
      stroke="#C59A2C"
      strokeWidth="1"
    />
    <path
      d="M16 7L8 15"
      stroke="#C59A2C"
      strokeWidth="1"
    />
  </svg>
);

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Lead Management", icon: Users, href: "/dashboard/leads" },
  { label: "Site Visit Management", icon: CalendarCheck, href: "/dashboard/site-visits" },
  { label: "Bookings", icon: User, href: "/dashboard/bookings" },
  { label: "Sales Pipeline", icon: GitFork, href: "/dashboard/sales-pipeline" },
  { label: "Inbox", icon: Mail, href: "/dashboard/inbox", badge: 5 },
  { label: "Activities", icon: CheckSquare, href: "/dashboard/activities" },
  { label: "Reports & Analytics", icon: BarChart3, href: "/dashboard/reports" },
  { label: "Projects", icon: Building, href: "/dashboard/projects" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="
        h-screen 
        bg-[#0D2E1D]
        text-white 
        border-r border-white/10
        flex flex-col
        shadow-2xl
        z-40
        shrink-0
      "
    >
      {/* TOP - Logo & Branding */}
      <div className="flex items-center justify-between px-3.5 py-4 border-b border-white/10 shrink-0">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 whitespace-nowrap overflow-hidden"
            >
              <VasiyamLogoSVG />
              <div className="flex flex-col text-left leading-[1.1]">
                <span className="text-[12px] font-black text-[#C59A2C] tracking-wider uppercase">
                  VASIYAM HOMES
                </span>
                <span className="text-[7.5px] font-bold text-[#C59A2C]/80 tracking-widest uppercase">
                  PRIVATE LIMITED
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto cursor-pointer"
              onClick={() => setCollapsed(false)}
            >
              <VasiyamLogoSVG />
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white shrink-0"
          >
            <Menu size={16} />
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group",
                  active
                    ? "bg-[#184B31] text-white font-bold"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-white" : "text-white/60 group-hover:text-white"
                  )}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-bold flex-1 truncate overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {!collapsed && item.badge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full font-black min-w-4 text-center",
                        item.label === "Inbox"
                          ? "bg-[#F59E0B] text-white"
                          : active
                          ? "bg-white/10 text-white"
                          : "bg-[#C59A2C]/20 text-[#C59A2C]"
                      )}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0d2e1d] text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER — Help Support */}
      <div className="p-3 border-t border-white/10 shrink-0 space-y-2">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-2 p-3 bg-[#133C27]/40 border border-white/10 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-2">
                <Headset size={18} className="text-[#C59A2C] shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-bold text-white leading-tight">Need Help?</p>
                  <p className="text-[9px] text-white/50 leading-tight">We're here to support you</p>
                </div>
              </div>
              <button
                onClick={() => alert("Connecting to Vasiyam support...")}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#133C27] hover:bg-[#184B31] border border-[#C59A2C]/20 rounded-xl text-[10px] font-bold text-white transition-all select-none"
              >
                <span>Contact Support</span>
                <span className="text-[#C59A2C]">&rarr;</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all mx-auto"
              title="Contact Support"
              onClick={() => setCollapsed(false)}
            >
              <Headset size={18} className="text-[#C59A2C]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROFILE SECTION AT BOTTOM */}
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-2xl cursor-pointer transition-all group border-t border-white/5 pt-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-inner">
                SA
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-bold text-white leading-tight truncate">Super Admin</p>
                <p className="text-[9px] text-white/50 leading-tight mt-0.5 truncate">superadmin@vasiyam.com</p>
              </div>
              <ChevronRight size={14} className="text-white/40 group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-500 flex items-center justify-center text-xs font-black text-white cursor-pointer mx-auto border-t border-white/5 mt-2 pt-2"
              title="Super Admin (superadmin@vasiyam.com)"
              onClick={() => setCollapsed(false)}
            >
              SA
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}