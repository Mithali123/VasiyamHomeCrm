"use client";

import {
  Bell,
  ChevronDown,
  Command,
  Download,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number;
  name: string;
  type: "Lead" | "RM" | "Project";
  project?: string;
  status?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New lead assigned",
    message: "Rohit Kumar was assigned to Vasiyam Greens.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Site visit scheduled",
    message: "Anita Shankar booked a site visit for tomorrow at 10:30 AM.",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    title: "Payment received",
    message: "A payment of ₹50,000 was recorded for Vasiyam Hills.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    title: "Follow-up overdue",
    message: "Three lead follow-ups need your attention.",
    time: "3 hrs ago",
    read: false,
  },
  {
    id: 5,
    title: "Project updated",
    message: "Vasiyam Heights availability has been updated.",
    time: "Yesterday",
    read: false,
  },
  {
    id: 6,
    title: "Weekly report ready",
    message: "Your weekly sales report is ready to view.",
    time: "Yesterday",
    read: false,
  },
];

const mockData: SearchResult[] = [
  { id: 1, name: "Rohit Kumar", type: "Lead", project: "Vasiyam Greens" },
  { id: 2, name: "Anita Shankar", type: "Lead", project: "Vasiyam Hills" },
  { id: 3, name: "Meera Iyer", type: "Lead", project: "Vasiyam Heights" },
  { id: 4, name: "Arvind Kumar", type: "RM", project: "Vasiyam Greens" },
  { id: 5, name: "Priya Sharma", type: "RM", project: "Vasiyam Hills" },
  { id: 6, name: "Vasiyam Greens", type: "Project", status: "Active" },
  { id: 7, name: "Vasiyam Hills", type: "Project", status: "Active" },
  { id: 8, name: "Vasiyam Heights", type: "Project", status: "Active" },
];

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  // Close dropdowns on outside click and escape key
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setShowSearchResults(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length <= 1) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const normalizedQuery = query.toLowerCase();
    setSearchResults(
      mockData.filter(
        (item) =>
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.project?.toLowerCase().includes(normalizedQuery),
      ),
    );
    setShowSearchResults(true);
  };

  // Notification handlers
  const handleNotificationClick = () => {
    setNotificationsOpen((open) => !open);
    setProfileOpen(false);
    setShowSearchResults(false);
  };

  const handleMarkAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  };

  const handleNotificationItemClick = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  // Search result click handler
  const handleSearchResultClick = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery("");

    if (result.type === "Lead") router.push(`/leads/${result.id}`);
    if (result.type === "RM") router.push(`/rm/${result.id}`);
    if (result.type === "Project") router.push(`/projects/${result.id}`);
  };

  // Profile handlers
  const handleProfileToggle = () => {
    setProfileOpen((open) => !open);
    setNotificationsOpen(false);
    setShowSearchResults(false);
  };

  const handleProfileNavigation = (path: string) => {
    router.push(path);
    setProfileOpen(false);
  };

  // Export report handler
  const handleExportReport = () => {
    alert("Report export started. You'll be notified when it's ready.");
  };

  return (
    <header
      ref={root}
      className="sticky top-0 z-40 flex min-h-[80px] items-center border-b border-[#e8eaeb] bg-white px-5 xl:px-7"
    >
      {/* Greeting Section */}
      <div className="min-w-0 shrink-0">
        <h1 className="truncate text-[19px] font-bold tracking-[-.02em] text-[#141718]">
          Good morning, Super Admin <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-[11px] text-[#727a7e]">
          Here&apos;s your business overview for today.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mx-auto hidden h-9 w-[350px] items-center rounded-lg border border-[#e3e6e7] bg-white px-3 shadow-[0_1px_2px_rgba(15,23,42,.02)] lg:flex">
        <Search size={14} className="text-[#727a7e]" />
        <input
          id="search-input"
          className="min-w-0 flex-1 bg-transparent px-2 text-[11px] outline-none placeholder:text-[#7e8589]"
          placeholder="Search leads, projects, RMs, contacts..."
          value={searchQuery}
          onChange={(event) => handleSearch(event.target.value)}
          onFocus={() => searchQuery.length > 1 && setShowSearchResults(true)}
        />
        <span className="flex items-center text-[9px] text-[#777e82]">
          <Command size={9} /> K
        </span>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-[#e5e7e8] bg-white shadow-xl">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-[11px] hover:bg-[#f4f6f5]"
                >
                  <span>
                    <span className="font-medium">{result.name}</span>
                    <span className="ml-2 text-[9px] text-[#727a7e]">
                      {result.type}
                    </span>
                  </span>
                  <span className="text-[9px] text-[#727a7e]">
                    {result.project || result.status}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-[11px] text-[#727a7e]">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
            aria-controls="notification-panel"
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#f4f6f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#073d2e]"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-600 px-0.5 text-[8px] font-bold leading-none text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {notificationsOpen && (
            <div
              id="notification-panel"
              role="dialog"
              aria-label="Notifications"
              className="fixed left-3 right-3 top-[72px] z-50 overflow-hidden rounded-xl border border-[#e5e7e8] bg-white text-[12px] shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-[360px]"
            >
              <div className="flex items-center justify-between border-b border-[#eef0f1] px-4 py-3">
                <div>
                  <h2 className="text-sm font-bold text-[#141718]">
                    Notifications
                  </h2>
                  <p className="mt-0.5 text-[10px] text-[#727a7e]">
                    {unreadCount === 0
                      ? "You're all caught up"
                      : `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="rounded-md px-2 py-1 text-[10px] font-semibold text-[#073d2e] hover:bg-[#edf4f1]"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[min(420px,calc(100vh-160px))] overflow-y-auto">
                {notifications.map((notification) => (
                  <button
                    type="button"
                    key={notification.id}
                    onClick={() => handleNotificationItemClick(notification.id)}
                    className={`flex w-full gap-3 border-b border-[#f0f1f2] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[#f7f9f8] ${
                      notification.read ? "bg-white" : "bg-[#f1f7f4]"
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        notification.read ? "bg-transparent" : "bg-[#08745a]"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-[#202425]">
                        {notification.title}
                      </span>
                      <span className="mt-1 block text-[11px] leading-4 text-[#62696d]">
                        {notification.message}
                      </span>
                      <span className="mt-1.5 block text-[10px] text-[#8a9195]">
                        {notification.time}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  router.push("/notifications");
                }}
                className="w-full border-t border-[#e8eaeb] px-4 py-3 text-center text-[11px] font-semibold text-[#073d2e] hover:bg-[#f4f7f5]"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative ml-2">
          <button
            type="button"
            onClick={handleProfileToggle}
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-[#f4f6f5]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#073d2e] text-[11px] font-bold text-white">
              SA
            </span>
            <span className="hidden text-[11px] font-semibold sm:block">
              Super Admin
            </span>
            <ChevronDown
              size={12}
              className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 w-44 rounded-xl border border-[#e5e7e8] bg-white p-2 text-[12px] shadow-xl">
              <button
                onClick={() => handleProfileNavigation("/profile")}
                className="block w-full rounded-lg px-3 py-2 text-left hover:bg-[#f4f7f5]"
              >
                My Profile
              </button>
              <button
                onClick={() => handleProfileNavigation("/settings")}
                className="block w-full rounded-lg px-3 py-2 text-left hover:bg-[#f4f7f5]"
              >
                Account Settings
              </button>
              <button
                onClick={() => handleProfileNavigation("/login")}
                className="block w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Export Report Button */}
        <button
          type="button"
          onClick={handleExportReport}
          className="ml-1 hidden h-9 items-center gap-2 rounded-lg bg-[#063a2c] px-4 text-[10px] font-semibold text-white shadow-sm transition-all hover:bg-[#0a4d3a] active:scale-95 xl:flex"
        >
          <Download size={12} /> Export Report <ChevronDown size={11} />
        </button>
      </div>
    </header>
  );
}