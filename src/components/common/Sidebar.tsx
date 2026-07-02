"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Lead Management", icon: Users, href: "/dashboard/leads" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isLeadDetail = pathname.includes("/dashboard/leads/") && pathname.split("/").filter(Boolean).length >= 3;
  const [collapsed, setCollapsed] = useState(isLeadDetail);

  useEffect(() => {
    setCollapsed(isLeadDetail);
  }, [pathname, isLeadDetail]);

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
              className="flex items-center gap-2.5 whitespace-nowrap overflow-hidden py-0.5"
            >
              <div className="w-8 h-[20px] overflow-hidden flex items-start justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="Vasiyam Logo"
                  className="w-full h-auto object-contain"
                />
              </div>
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
              className="mx-auto cursor-pointer w-8 h-[20px] overflow-hidden flex items-start justify-center"
              onClick={() => setCollapsed(false)}
            >
              <img
                src="/logo.png"
                alt="Vasiyam Homes"
                className="w-full h-auto object-contain"
              />
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

      {/* FOOTER — Profile Section */}
      <div className="p-3 border-t border-white/10 shrink-0">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-2xl cursor-pointer transition-all group"
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
              className="w-8 h-8 rounded-full bg-emerald-700 border border-emerald-500 flex items-center justify-center text-xs font-black text-white cursor-pointer mx-auto"
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
