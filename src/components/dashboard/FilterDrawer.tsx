"use client";

import { 
  X, 
  Calendar, 
  Users, 
  Building2, 
  Filter, 
  RotateCcw, 
  Save, 
  Download,
  Check,
  ChevronRight,
  Target,
  Megaphone,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Properly typed filter state
interface FilterState {
  dateRange: string;
  scope: string;
  comparison: string;
  filters?: Record<string, string | string[] | number>;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

const datePresets = [
  "Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Quarter", "Custom Range"
];

const scopes = [
  { id: "my", label: "My Data", desc: "Leads and activities assigned to you" },
  { id: "team", label: "Team Data", desc: "Leads and activities assigned to your team" },
  { id: "all", label: "All Teams Data", desc: "Leads across all teams and departments" },
];

const additionalFilters = [
  { id: "project", label: "Project", icon: Building2 },
  { id: "rm", label: "Relationship Manager", icon: Users },
  { id: "team_sel", label: "Team", icon: Users },
  { id: "source", label: "Lead Source", icon: Filter },
  { id: "campaign", label: "Campaign", icon: Megaphone },
  { id: "stage", label: "Lead Stage", icon: Target },
];

export default function FilterDrawer({ isOpen, onClose, onApplyFilters }: FilterDrawerProps) {
  const [activeDate, setActiveDate] = useState("Last 30 Days");
  const [activeScope, setActiveScope] = useState("all");
  const [comparison, setComparison] = useState("previous");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [savedViews, setSavedViews] = useState<string[]>([]);
  const [filterCounts, setFilterCounts] = useState<Record<string, number>>({
    project: 3,
    rm: 2,
    team_sel: 1,
    source: 4,
    campaign: 0,
    stage: 3
  });
  const router = useRouter();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log("Data refreshed!");
    }, 800);
  };

  const handleApplyFilters = () => {
    const filters: FilterState = {
      dateRange: activeDate,
      scope: activeScope,
      comparison: comparison,
    };
    
    console.log("Applying filters:", filters);
    onApplyFilters?.(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setActiveDate("Last 30 Days");
    setActiveScope("all");
    setComparison("previous");
    console.log("Filters reset to default");
  };

  const handleSaveView = () => {
    setIsSaving(true);
    setTimeout(() => {
      const viewName = `View ${savedViews.length + 1}`;
      setSavedViews([...savedViews, viewName]);
      setIsSaving(false);
      console.log(`View "${viewName}" saved!`);
    }, 600);
  };

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      console.log("Exporting dashboard report...");
      const link = document.createElement('a');
      link.href = '#';
      link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }, 1000);
  };

  const handleFilterClick = (filterId: string) => {
    console.log(`Opening filter: ${filterId}`);
    router.push(`/filters/${filterId}`);
  };

  const handleComparisonSelect = (type: string) => {
    setComparison(type);
    console.log(`Comparison set to: ${type}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* DRAWER PANEL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Filter size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-text leading-none">Dashboard Filters</h2>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium tracking-wide uppercase">Refine your data view</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close drawer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* DATE RANGE SECTION */}
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Calendar size={12} className="text-primary" /> Date Range
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {datePresets.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setActiveDate(preset)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-xs rounded-xl border transition-all",
                        activeDate === preset 
                          ? "bg-primary border-primary text-white font-bold shadow-lg shadow-primary/20" 
                          : "bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <span>{preset}</span>
                      {activeDate === preset && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </section>

              {/* COMPARISON SECTION */}
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <RotateCcw size={12} className="text-primary" /> Comparison
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => handleComparisonSelect("previous")}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                      comparison === "previous" ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-gray-100 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", comparison === "previous" ? "border-primary" : "border-gray-300")}>
                        {comparison === "previous" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className={cn("text-xs font-bold", comparison === "previous" ? "text-primary" : "text-brand-text")}>Previous Period</p>
                        <p className="text-[9px] text-gray-500">Compare with the preceding time range</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleComparisonSelect("year")}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                      comparison === "year" ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-gray-100 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", comparison === "year" ? "border-primary" : "border-gray-300")}>
                        {comparison === "year" && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className={cn("text-xs font-bold", comparison === "year" ? "text-primary" : "text-brand-text")}>Same Period Last Year</p>
                        <p className="text-[9px] text-gray-500">Compare with the same dates from last year</p>
                      </div>
                    </div>
                  </button>
                </div>
              </section>

              {/* SCOPE SECTION */}
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Users size={12} className="text-primary" /> Data Scope
                </h3>
                <div className="space-y-2">
                  {scopes.map((scope) => (
                    <button
                      key={scope.id}
                      onClick={() => setActiveScope(scope.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl border transition-all",
                        activeScope === scope.id ? "bg-primary/5 border-primary shadow-sm" : "bg-white border-gray-100 hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                        activeScope === scope.id ? "border-primary" : "border-gray-300"
                      )}>
                        {activeScope === scope.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div className="text-left">
                        <p className={cn("text-xs font-bold", activeScope === scope.id ? "text-primary" : "text-brand-text")}>{scope.label}</p>
                        <p className="text-[9px] text-gray-400">{scope.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* ADDITIONAL FILTERS */}
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Filter size={12} className="text-primary" /> Additional Filters
                </h3>
                <div className="space-y-1">
                  {additionalFilters.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleFilterClick(f.id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <f.icon size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-bold text-gray-600 group-hover:text-brand-text">{f.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tight",
                          filterCounts[f.id] > 0 ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
                        )}>
                          {filterCounts[f.id] > 0 ? `${filterCounts[f.id]} Selected` : "All"}
                        </span>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleResetFilters}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white hover:border-gray-300 transition-all shadow-sm"
                >
                  <RotateCcw size={14} /> Reset Filters
                </button>
                <button 
                  onClick={handleSaveView}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw size={14} className="text-primary" />
                    </motion.div>
                  ) : (
                    <Save size={14} />
                  )}
                  {isSaving ? "Saving..." : "Save View"}
                </button>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-2 py-4 px-4 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm flex-1"
                >
                  <motion.div
                    animate={{ rotate: isRefreshing ? 360 : 0 }}
                    transition={{ duration: 0.5, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
                  >
                    <RefreshCw size={14} className={cn(isRefreshing ? "text-primary" : "text-gray-400")} />
                  </motion.div>
                  {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="flex-[2] py-4 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  Apply Filters
                </button>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button 
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw size={14} />
                      </motion.div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={14} /> Export Dashboard Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}