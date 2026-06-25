"use client";

import Link from "next/link";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SidebarChild = {
  title: string;
  href: string;
};

type SidebarItemType = {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: SidebarChild[];
};

interface SidebarItemProps {
  item: SidebarItemType;
  pathname: string;
  collapsed: boolean;
  openMenu: string | null;
  setOpenMenu: (value: string | null) => void;
}

export default function SidebarItem({
  item,
  pathname,
  collapsed,
  openMenu,
  setOpenMenu,
}: SidebarItemProps) {
  const isOpen = openMenu === item.title;

  if (!item.children) {
    return (
      <Link
        href={item.href || "#"}
        className={cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-primary/10",
          pathname === item.href &&
            "bg-gold text-primary font-medium shadow-sm"
        )}
      >
        <item.icon size={20} />
        {!collapsed && <span>{item.title}</span>}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() =>
          setOpenMenu(isOpen ? null : item.title)
        }
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-primary/10"
      >
        <div className="flex items-center gap-3">
          <item.icon size={20} />
          {!collapsed && <span>{item.title}</span>}
        </div>

        {!collapsed && (
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="ml-10 mt-2 space-y-2">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm hover:bg-primary/10",
                    pathname === child.href &&
                      "bg-gold text-primary"
                  )}
                >
                  {child.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}