"use client";

import FilterBar from "@/components/dashboard/FilterBar";
import KPIGrid from "@/components/dashboard/KPIGrid";
import {
  SalesFunnel,
  LeadTrend,
  SourcePerformance,
} from "@/components/dashboard/DashboardCharts";
import {
  AttentionQueue,
  RepresentativePerformance,
  LeadSummaryWidget,
  ActivityTimeline,
} from "@/components/dashboard/DashboardWidgets";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-10"
    >
      {/* Filters */}
      <FilterBar />

      {/* KPI Cards */}
      <KPIGrid />

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LeadTrend />
        <SalesFunnel />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SourcePerformance />
        <AttentionQueue />
        <RepresentativePerformance />
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <LeadSummaryWidget />
        </div>

        <div className="xl:col-span-2">
          <ActivityTimeline />
        </div>
      </div>
    </motion.div>
  );
}