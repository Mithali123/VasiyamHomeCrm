"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  LogOut,
  MoreVertical,
  User,
  Home // ← Keep Home icon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Leads", icon: Users, href: "/dashboard/leads", badge: 12 },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      className="
        h-screen 
        bg-gradient-to-b from-[#0B1411] to-[#0F1A14]
        text-white 
        border-r border-white/10
        flex flex-col
        shadow-2xl
        z-40
        shrink-0
      "
    >
      {/* TOP - with Home icon and "Vasiyam Home CRM" text */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/10">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 whitespace-nowrap overflow-hidden"
            >
              {/* Home Icon */}
              <Home size={18} className="text-primary shrink-0" />
              <h1 className="text-base font-bold tracking-tight text-white/90">
                Vasiyam <span className="text-primary">Home</span> CRM
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white shrink-0"
        >
          <Menu size={18} />
        </button>
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
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
                title={collapsed ? item.label : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="activeBar"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full"
                  />
                )}

                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    active && "text-primary"
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
                      className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Collapsed tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER — User + Logout */}
      <div className="p-2 border-t border-white/10 relative" ref={menuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={cn(
            "w-full flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/5 group",
            showUserMenu && "bg-white/10"
          )}
          title={collapsed ? "Account" : undefined}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-green-700 shadow-lg shrink-0 flex items-center justify-center border border-white/20 text-white">
            <User size={17} />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 text-left min-w-0 overflow-hidden"
              >
                <p className="text-xs font-bold truncate whitespace-nowrap">Admin User</p>
                <p className="text-[10px] text-white/40 truncate whitespace-nowrap">CRM Manager</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <MoreVertical size={14} className="text-white/20 group-hover:text-white/60 shrink-0" />
          )}
        </button>

        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute bottom-full mb-2 bg-[#14201A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden",
                collapsed ? "left-2 w-44" : "left-2 right-2"
              )}
            >
              <div className="p-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-left"
                >
                  <LogOut size={15} className="shrink-0" />
                  <span className="truncate">Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}