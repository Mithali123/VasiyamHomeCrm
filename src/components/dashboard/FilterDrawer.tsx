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
  RefreshCw,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Types
interface FilterState {
  dateRange: string;
  scope: string;
  comparison: string;
  customFilters: Record<string, string[]>;
  startDate?: Date;
  endDate?: Date;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

const datePresets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7" },
  { label: "Last 30 Days", value: "last30" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Quarter", value: "thisQuarter" },
  { label: "Custom Range", value: "custom" },
];

const scopes = [
  { id: "my", label: "My Data", desc: "Leads and activities assigned to you" },
  { id: "team", label: "Team Data", desc: "Leads and activities assigned to your team" },
  { id: "all", label: "All Teams Data", desc: "Leads across all teams and departments" },
];

// Mock filter options - would come from backend
const filterOptions: Record<string, string[]> = {
  project: ["Vasiyam Greens", "Vasiyam Hills", "Vasiyam Heights", "Vasiyam Lakeview"],
  rm: ["Arvind Kumar", "Priya Sharma", "Meera Rajan", "Rahul Verma"],
  team: ["Sales Team A", "Sales Team B", "Marketing Team"],
  source: ["Website", "Referral", "Instagram", "99acres", "Facebook", "Email"],
  campaign: ["Summer Sale", "Winter Drive", "Festival Offer", "Referral Program"],
  stage: ["New", "Contacted", "Qualified", "Site Visit", "Negotiation", "Won", "Lost"],
};

export default function FilterDrawer({ 
  isOpen, 
  onClose, 
  onApplyFilters,
  initialFilters 
}: FilterDrawerProps) {
  // State
  const [activeDate, setActiveDate] = useState(initialFilters?.dateRange || "last30");
  const [activeScope, setActiveScope] = useState(initialFilters?.scope || "all");
  const [comparison, setComparison] = useState(initialFilters?.comparison || "previous");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>(
    initialFilters?.customFilters || {}
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [savedViews, setSavedViews] = useState<string[]>([]);

  // Additional filters with their selected counts
  const additionalFilters = [
    { id: "project", label: "Project", icon: Building2, options: filterOptions.project },
    { id: "rm", label: "Relationship Manager", icon: Users, options: filterOptions.rm },
    { id: "team", label: "Team", icon: Users, options: filterOptions.team },
    { id: "source", label: "Lead Source", icon: Filter, options: filterOptions.source },
    { id: "campaign", label: "Campaign", icon: Megaphone, options: filterOptions.campaign },
    { id: "stage", label: "Lead Stage", icon: Target, options: filterOptions.stage },
  ];

  // Get filter count
  const getFilterCount = (filterId: string) => {
    return (filterSelections[filterId] || []).length;
  };

  // Handle filter selection
  const handleFilterSelect = (filterId: string, option: string) => {
    setFilterSelections(prev => {
      const current = prev[filterId] || [];
      const updated = current.includes(option)
        ? current.filter(item => item !== option)
        : [...current, option];
      return { ...prev, [filterId]: updated };
    });
  };

  // Handle custom date range
  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setCustomDateRange(prev => ({ ...prev, [type]: value }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    const filters: FilterState = {
      dateRange: activeDate,
      scope: activeScope,
      comparison: comparison,
      customFilters: filterSelections,
    };

    if (activeDate === "custom") {
      filters.startDate = customDateRange.start ? new Date(customDateRange.start) : undefined;
      filters.endDate = customDateRange.end ? new Date(customDateRange.end) : undefined;
    }

    onApplyFilters?.(filters);
    onClose();
  };

  // Reset filters
  const handleResetFilters = () => {
    setActiveDate("last30");
    setActiveScope("all");
    setComparison("previous");
    setFilterSelections({});
    setCustomDateRange({ start: "", end: "" });
    setActiveFilter(null);
  };

  // Save view
  const handleSaveView = () => {
    setIsSaving(true);
    setTimeout(() => {
      const viewName = `View ${savedViews.length + 1}`;
      setSavedViews([...savedViews, viewName]);
      setIsSaving(false);
    }, 600);
  };

  // Refresh data
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Export report
  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      console.log("Exporting dashboard report...");
    }, 1000);
  };

  // Load saved view
  const loadSavedView = (viewName: string) => {
    console.log(`Loading view: ${viewName}`);
    // Would fetch saved filters from backend
  };

  // Calculate total active filters
  const totalActiveFilters = Object.values(filterSelections).reduce(
    (acc, curr) => acc + curr.length, 0
  );

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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Filter size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#141718] leading-none">Filters</h2>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium tracking-wide uppercase">
                    {totalActiveFilters > 0 ? `${totalActiveFilters} filters active` : "Refine your data"}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                  <Calendar size={12} className="text-emerald-600" /> Date Range
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {datePresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setActiveDate(preset.value)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-xs rounded-xl border transition-all",
                        activeDate === preset.value 
                          ? "bg-emerald-600 border-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20" 
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <span>{preset.label}</span>
                      {activeDate === preset.value && <Check size={12} />}
                    </button>
                  ))}
                </div>

                {/* Custom Date Range */}
                {activeDate === "custom" && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Start</label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">End</label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* COMPARISON SECTION */}
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BarChart3 size={12} className="text-emerald-600" /> Comparison
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setComparison("previous")}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                      comparison === "previous" 
                        ? "bg-emerald-50 border-emerald-600 shadow-sm" 
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      comparison === "previous" ? "border-emerald-600" : "border-gray-300"
                    )}>
                      {comparison === "previous" && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                    <p className={cn("text-[10px] font-bold", comparison === "previous" ? "text-emerald-600" : "text-gray-600")}>
                      Previous Period
                    </p>
                    <p className="text-[7px] text-gray-400 text-center">Compare with preceding range</p>
                  </button>
                  <button 
                    onClick={() => setComparison("year")}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all",
                      comparison === "year" 
                        ? "bg-emerald-50 border-emerald-600 shadow-sm" 
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      comparison === "year" ? "border-emerald-600" : "border-gray-300"
                    )}>
                      {comparison === "year" && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </div>
                    <p className={cn("text-[10px] font-bold", comparison === "year" ? "text-emerald-600" : "text-gray-600")}>
                      Same Period Last Year
                    </p>
                    <p className="text-[7px] text-gray-400 text-center">Compare with last year</p>
                  </button>
                </div>
              </section>

              {/* SCOPE SECTION */}
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Users size={12} className="text-emerald-600" /> Data Scope
                </h3>
                <div className="space-y-2">
                  {scopes.map((scope) => (
                    <button
                      key={scope.id}
                      onClick={() => setActiveScope(scope.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-3 rounded-xl border transition-all",
                        activeScope === scope.id 
                          ? "bg-emerald-50 border-emerald-600 shadow-sm" 
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        activeScope === scope.id ? "border-emerald-600" : "border-gray-300"
                      )}>
                        {activeScope === scope.id && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </div>
                      <div className="text-left">
                        <p className={cn("text-xs font-bold", activeScope === scope.id ? "text-emerald-600" : "text-[#141718]")}>
                          {scope.label}
                        </p>
                        <p className="text-[9px] text-gray-400">{scope.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* ADDITIONAL FILTERS */}
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Filter size={12} className="text-emerald-600" /> Additional Filters
                </h3>
                <div className="space-y-1">
                  {additionalFilters.map((filter) => {
                    const count = getFilterCount(filter.id);
                    const isActive = activeFilter === filter.id;
                    
                    return (
                      <div key={filter.id} className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setActiveFilter(isActive ? null : filter.id)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <filter.icon size={16} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-600">{filter.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tight",
                              count > 0 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
                            )}>
                              {count > 0 ? `${count} Selected` : "All"}
                            </span>
                            <ChevronRight 
                              size={14} 
                              className={cn(
                                "text-gray-300 transition-transform",
                                isActive && "rotate-90"
                              )} 
                            />
                          </div>
                        </button>

                        {/* Filter options dropdown */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 space-y-1">
                                {filter.options.map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => handleFilterSelect(filter.id, option)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <div className={cn(
                                      "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                                      (filterSelections[filter.id] || []).includes(option)
                                        ? "bg-emerald-600 border-emerald-600"
                                        : "border-gray-300"
                                    )}>
                                      {(filterSelections[filter.id] || []).includes(option) && (
                                        <Check size={10} className="text-white" />
                                      )}
                                    </div>
                                    <span className="text-gray-700">{option}</span>
                                  </button>
                                ))}
                                
                                {/* Clear filter button */}
                                {count > 0 && (
                                  <button
                                    onClick={() => setFilterSelections(prev => ({ ...prev, [filter.id]: [] }))}
                                    className="w-full text-center py-2 text-[10px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    Clear all
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SAVED VIEWS */}
              {savedViews.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Save size={12} className="text-emerald-600" /> Saved Views
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {savedViews.map((view, index) => (
                      <button
                        key={index}
                        onClick={() => loadSavedView(view)}
                        className="px-3 py-1.5 text-[10px] font-bold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleResetFilters}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white hover:border-gray-300 transition-all shadow-sm"
                >
                  <RotateCcw size={14} /> Reset
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
                      <RefreshCw size={14} className="text-emerald-600" />
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
                    <RefreshCw size={14} className={cn(isRefreshing ? "text-emerald-600" : "text-gray-400")} />
                  </motion.div>
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
                <button 
                  onClick={handleApplyFilters}
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                >
                  Apply Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
                </button>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button 
                  onClick={handleExportReport}
                  disabled={isExporting}
                  className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-emerald-600 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <Download size={14} /> Export Report
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