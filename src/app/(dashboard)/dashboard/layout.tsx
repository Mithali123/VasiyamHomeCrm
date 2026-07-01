"use client";

import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8faf9] text-[#171b1c]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="mx-auto w-full max-w-[1680px] px-4 py-3 xl:px-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}