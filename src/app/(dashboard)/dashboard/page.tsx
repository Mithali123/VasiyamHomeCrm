"use client";

import { motion } from "framer-motion";
import FilterBar from "@/components/dashboard/FilterBar";
import KPIGrid from "@/components/dashboard/KPIGrid";
import {
  LeadSources,
  LeadTrend,
  SalesFunnel,
} from "@/components/dashboard/DashboardCharts";
import {
  BusinessInsights,
  LiveLeadStatus,
  RecentActivities,
  RecentLeads,
  RMPerformance,
} from "@/components/dashboard/DashboardWidgets";

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-ui space-y-3 pb-6"
    >
      <FilterBar />
      <KPIGrid />

      {/* Row 1: Sales Funnel & Lead Trend */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1.08fr]">
        <SalesFunnel />
        <LeadTrend />
      </div>

      {/* Row 2: Live Lead Status, Lead Sources & RM Performance */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.02fr_1fr_1.12fr]">
        <LiveLeadStatus />
        <LeadSources />
        <RMPerformance />
      </div>

      {/* Row 3: Recent Leads, Business Insights & Recent Activities */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.18fr_.82fr_1.35fr]">
        <RecentLeads />
        <BusinessInsights />
        <RecentActivities />
      </div>
    </motion.div>
  );
}