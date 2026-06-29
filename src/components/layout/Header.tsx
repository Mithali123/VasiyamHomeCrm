"use client";

import { Bell, ChevronDown, CircleHelp, Command, Download, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header
      ref={root}
      className="sticky top-0 z-40 flex min-h-[80px] items-center border-b border-[#e8eaeb] bg-white px-5 xl:px-7"
    >
      <div className="min-w-0 shrink-0">
        <h1 className="truncate text-[19px] font-bold tracking-[-.02em] text-[#141718]">
          Good morning, Super Admin <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-[11px] text-[#727a7e]">
          Here&apos;s your business overview for today.
        </p>
      </div>

      <label className="mx-auto hidden h-9 w-[350px] items-center rounded-lg border border-[#e3e6e7] bg-white px-3 shadow-[0_1px_2px_rgba(15,23,42,.02)] lg:flex">
        <Search size={14} className="text-[#727a7e]" />
        <input
          className="min-w-0 flex-1 bg-transparent px-2 text-[11px] outline-none placeholder:text-[#7e8589]"
          placeholder="Search leads, projects, RMs, contacts..."
        />
        <span className="flex items-center text-[9px] text-[#777e82]">
          <Command size={9} /> K
        </span>
      </label>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f4f6f5]"
          >
            <Bell size={17} />
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-600 px-0.5 text-[7px] font-bold text-white">
              6
            </span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-11 w-72 rounded-xl border border-[#e5e7e8] bg-white p-3 text-[12px] shadow-xl">
              <b>Notifications</b>
              <p className="mt-2 rounded-lg bg-[#f4f7f5] p-3 text-[#62696d]">
                You have 6 unread notifications.
              </p>
            </div>
          )}
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f4f6f5]">
          <CircleHelp size={17} />
        </button>

        <div className="relative ml-2">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-[#f4f6f5]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#073d2e] text-[11px] font-bold text-white">
              SA
            </span>
            <span className="hidden text-[11px] font-semibold sm:block">
              Super Admin
            </span>
            <ChevronDown size={12} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-11 w-44 rounded-xl border border-[#e5e7e8] bg-white p-2 text-[12px] shadow-xl">
              <button className="block w-full rounded-lg px-3 py-2 text-left hover:bg-[#f4f7f5]">
                My Profile
              </button>
              <button className="block w-full rounded-lg px-3 py-2 text-left hover:bg-[#f4f7f5]">
                Account Settings
              </button>
              <button className="block w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50">
                Sign Out
              </button>
            </div>
          )}
        </div>

        <button className="ml-1 hidden h-9 items-center gap-2 rounded-lg bg-[#063a2c] px-4 text-[10px] font-semibold text-white shadow-sm xl:flex">
          <Download size={12} /> Export Report <ChevronDown size={11} />
        </button>
      </div>
    </header>
  );
}