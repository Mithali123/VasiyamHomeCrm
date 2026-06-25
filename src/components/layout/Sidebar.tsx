"use client";

import {
  LayoutDashboard,
  Users,
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

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Leads Management", icon: Users, href: "/dashboard/leads", badge: 12 },
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
        bg-[#0d2e1d]
        text-white 
        border-r border-white/10
        flex flex-col
        shadow-2xl
        z-40
        shrink-0
      "
    >
      {/* TOP - Logo & Branding */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/10 shrink-0">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 whitespace-nowrap overflow-hidden"
            >
              {/* Cropped pyramid logo */}
              <div className="w-[34px] h-[26px] overflow-hidden relative shrink-0 rounded-sm">
                <img
                  src="/logo.png"
                  alt="Vasiyam Logo"
                  className="absolute top-0 left-0 w-full h-[155%] object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-left leading-[1.1]">
                <span className="text-[12px] font-bold text-[#C59A2C] tracking-wide uppercase">
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
              <div className="w-[28px] h-[22px] overflow-hidden relative shrink-0 rounded-sm">
                <img
                  src="/logo.png"
                  alt="Vasiyam Logo"
                  className="absolute top-0 left-0 w-full h-[155%] object-cover object-top"
                />
              </div>
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
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group",
                  active
                    ? "bg-[#F8F5EE] text-[#0d2e1d] font-semibold"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    active ? "text-[#0d2e1d]" : "text-white/60 group-hover:text-white"
                  )}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-bold flex-1 truncate overflow-hidden whitespace-nowrap"
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
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        active
                          ? "bg-[#0d2e1d]/10 text-[#0d2e1d]"
                          : "bg-[#C9A82C]/20 text-[#C9A82C]"
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
      <div className="p-3 border-t border-white/10 shrink-0">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group"
            >
              <Headset size={20} className="text-[#C59A2C] shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-xs font-bold text-white leading-tight">Need Help?</p>
                <p className="text-[10px] text-white/50 leading-tight mt-0.5">Contact Support</p>
              </div>
              <ChevronRight size={14} className="text-white/40 group-hover:translate-x-0.5 transition-transform" />
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
      </div>
    </motion.aside>
  );
}