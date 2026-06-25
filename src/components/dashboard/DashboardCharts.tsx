import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TooltipItem = {
  color?: string;
  fill?: string;
  name?: string;
  value?: string | number;
  unit?: string;
  payload?: { fill?: string; unit?: string };
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
};

type FunnelData = { name: string; value: number; fill: string };
type TrendData = { date: string; leads: number; conversions: number; bookings: number };
type SourceData = {
  name: string;
  totalLeads: number;
  qualifiedLeads: number;
  bookings: number;
  conversionRate: number;
};

// ─── Theme Colors ────────────────────────────────────────────────────────────
const COLORS = {
  deepOlive: "#4A5D23",
  softOlive: "#6B8A3A",
  darkForest: "#2E3B14",
  warmGold: "#C9A84C",
  softGold: "#E8D5A3",
  warmCream: "#FBF8F4",
  pureWhite: "#FFFFFF",
  softIvory: "#F5F0E8",
  warmBeige: "#EDE8DF",
  darkCharcoal: "#1E1E1E",
  warmGray: "#5A5A5A",
  softGray: "#8A8A8A",
  forestGreen: "#2D7D46",
  amber: "#E8A838",
  deepRed: "#B31B27",
  slateBlue: "#3A6B8C",
};

// ─── Shared Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2E3B14] border border-[#C9A84C]/20 p-2 rounded-xl shadow-lg">
      {label && (
        <p className="text-[#FBF8F4] text-[10px] font-bold mb-1 border-b border-[#C9A84C]/10 pb-1">
          {label}
        </p>
      )}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5 last:mb-0">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: item.color || item.fill || item.payload?.fill }}
          />
          <span className="text-[#D0C8BC] text-[9px] flex-1">{item.name}</span>
          <span className="text-[#FBF8F4] text-[9px] font-bold">
            {item.value}
            {item.unit || item.payload?.unit || ""}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const funnelData: FunnelData[] = [
  { name: "Visitors", value: 10000, fill: "#4A5D23" },
  { name: "Leads", value: 2500, fill: "#6B8A3A" },
  { name: "Opportunities", value: 800, fill: "#C9A84C" },
  { name: "Bookings", value: 200, fill: "#2D7D46" },
];

const leadTrendData: TrendData[] = [
  { date: "Jan", leads: 120, conversions: 30, bookings: 15 },
  { date: "Feb", leads: 150, conversions: 40, bookings: 22 },
  { date: "Mar", leads: 180, conversions: 55, bookings: 28 },
  { date: "Apr", leads: 220, conversions: 70, bookings: 35 },
  { date: "May", leads: 280, conversions: 85, bookings: 42 },
  { date: "Jun", leads: 310, conversions: 95, bookings: 50 },
];

// ─── Source Performance Data ────────────────────────────────────────────────
const sourceData: SourceData[] = [
  { name: "Website", totalLeads: 420, qualifiedLeads: 210, bookings: 85, conversionRate: 20.2 },
  { name: "Chatbot", totalLeads: 180, qualifiedLeads: 95, bookings: 42, conversionRate: 23.3 },
  { name: "Referral", totalLeads: 150, qualifiedLeads: 85, bookings: 38, conversionRate: 25.3 },
  { name: "Facebook Ads", totalLeads: 320, qualifiedLeads: 130, bookings: 45, conversionRate: 14.1 },
  { name: "Instagram Ads", totalLeads: 280, qualifiedLeads: 115, bookings: 38, conversionRate: 13.6 },
  { name: "99acres", totalLeads: 200, qualifiedLeads: 90, bookings: 32, conversionRate: 16.0 },
  { name: "MagicBricks", totalLeads: 185, qualifiedLeads: 82, bookings: 28, conversionRate: 15.1 },
  { name: "Housing.com", totalLeads: 160, qualifiedLeads: 70, bookings: 24, conversionRate: 15.0 },
  { name: "Walk-in", totalLeads: 95, qualifiedLeads: 55, bookings: 28, conversionRate: 29.5 },
  { name: "Phone Call", totalLeads: 130, qualifiedLeads: 72, bookings: 35, conversionRate: 26.9 },
  { name: "WhatsApp", totalLeads: 220, qualifiedLeads: 120, bookings: 48, conversionRate: 21.8 },
  { name: "Manual Entry", totalLeads: 75, qualifiedLeads: 42, bookings: 18, conversionRate: 24.0 },
];

// ─── 1. Sales Funnel ──────────────────────────────────────────────────────────
export const SalesFunnel = () => (
  <div className="w-full h-full">
    <div className="mb-1.5">
      <h3 className="text-[#1E1E1E] text-sm font-bold">Sales Funnel</h3>
      <p className="text-[#5A5A5A] text-[10px]">How many visitors become buyers?</p>
    </div>
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={funnelData}
          layout="vertical"
          margin={{ top: 5, right: 15, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" horizontal={false} />
          <XAxis type="number" stroke="#8A8A8A" tick={{ fontSize: 10 }} />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#8A8A8A"
            tick={{ fontSize: 10 }}
            width={50}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
            {funnelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ─── 2. Lead Trend ────────────────────────────────────────────────────────────
export const LeadTrend = () => (
  <div className="w-full h-full">
    <div className="mb-1.5">
      <h3 className="text-[#1E1E1E] text-sm font-bold">Lead Trend</h3>
      <p className="text-[#5A5A5A] text-[10px]">Monthly growth in leads, conversions & bookings</p>
    </div>
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={leadTrendData}
          margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" />
          <XAxis dataKey="date" stroke="#8A8A8A" tick={{ fontSize: 10 }} />
          <YAxis stroke="#8A8A8A" tick={{ fontSize: 10 }} />
          <Tooltip content={<ChartTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '10px', paddingTop: '3px' }} 
            iconSize={8}
          />
          <Line
            type="monotone"
            dataKey="leads"
            stroke="#4A5D23"
            strokeWidth={2}
            dot={{ fill: "#4A5D23", r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="conversions"
            stroke="#C9A84C"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ fill: "#C9A84C", r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#2D7D46"
            strokeWidth={2}
            strokeDasharray="2 2"
            dot={{ fill: "#2D7D46", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ─── 3. Source Performance ────────────────────────────────────────────────────
type MetricKey = "all" | "totalLeads" | "qualifiedLeads" | "bookings" | "conversionRate";

const METRIC_TABS: { key: MetricKey; label: string }[] = [
  { key: "all", label: "All metrics" },
  { key: "totalLeads", label: "Total Leads" },
  { key: "qualifiedLeads", label: "Qualified Leads" },
  { key: "bookings", label: "Bookings" },
  { key: "conversionRate", label: "Conversion Rate" },
];

const BAR_CONFIG: {
  key: keyof SourceData;
  label: string;
  color: string;
  metricKey: MetricKey;
}[] = [
  { key: "totalLeads", label: "Total Leads", color: "#4A5D23", metricKey: "totalLeads" },
  { key: "qualifiedLeads", label: "Qualified Leads", color: "#6B8A3A", metricKey: "qualifiedLeads" },
  { key: "bookings", label: "Bookings", color: "#C9A84C", metricKey: "bookings" },
  { key: "conversionRate", label: "Conversion Rate %", color: "#2D7D46", metricKey: "conversionRate" },
];

export const SourcePerformance = () => {
  const [active, setActive] = useState<MetricKey>("all");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const visibleBars = BAR_CONFIG.filter(
    (b) => active === "all" || b.metricKey === active
  );

  const sortedData = [...sourceData].sort((a, b) => b.totalLeads - a.totalLeads);

  return (
    <div className="w-full h-full">
      <div className="mb-1.5">
        <h3 className="text-[#1E1E1E] text-sm font-bold">Source Performance</h3>
        <p className="text-[#5A5A5A] text-[10px]">Which channels bring the best leads?</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-1 mb-1.5">
        <button
          onClick={() => setViewMode("chart")}
          className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${
            viewMode === "chart"
              ? "bg-[#4A5D23] border-[#4A5D23] text-white font-medium"
              : "border-[#E5E0D8] text-[#5A5A5A] hover:text-[#1E1E1E] hover:bg-[#F5F0E8]"
          }`}
        >
          Chart View
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${
            viewMode === "table"
              ? "bg-[#4A5D23] border-[#4A5D23] text-white font-medium"
              : "border-[#E5E0D8] text-[#5A5A5A] hover:text-[#1E1E1E] hover:bg-[#F5F0E8]"
          }`}
        >
          Table View
        </button>
      </div>

      {viewMode === "chart" ? (
        <>
          {/* Metric Tabs */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {METRIC_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${
                  active === tab.key
                    ? "bg-[#4A5D23] border-[#4A5D23] text-white font-medium"
                    : "border-[#E5E0D8] text-[#5A5A5A] hover:text-[#1E1E1E] hover:bg-[#F5F0E8]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-1.5">
            {visibleBars.map((b) => (
              <span key={b.key} className="flex items-center gap-1 text-[9px] text-[#5A5A5A]">
                <span
                  className="w-1.5 h-1.5 rounded-sm shrink-0"
                  style={{ background: b.color }}
                />
                {b.label}
              </span>
            ))}
          </div>

          {/* Chart */}
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sourceData}
                margin={{ top: 5, right: 10, left: 0, bottom: 30 }}
                barCategoryGap="15%"
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#8A8A8A"
                  tick={{ fontSize: 9 }}
                  angle={-45}
                  textAnchor="end"
                  height={30}
                />
                <YAxis stroke="#8A8A8A" tick={{ fontSize: 9 }} />
                <Tooltip content={<ChartTooltip />} />
                {visibleBars.map((b) => (
                  <Bar
                    key={b.key}
                    dataKey={b.key}
                    name={b.label}
                    fill={b.color}
                    radius={[3, 3, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded border border-[#E5E0D8]">
          <table className="w-full text-[10px]">
            <thead className="bg-[#F5F0E8]">
              <tr>
                <th className="text-left p-1.5 text-[#1E1E1E] font-semibold border-b border-[#E5E0D8]">
                  Source
                </th>
                <th className="text-right p-1.5 text-[#1E1E1E] font-semibold border-b border-[#E5E0D8]">
                  Total Leads
                </th>
                <th className="text-right p-1.5 text-[#1E1E1E] font-semibold border-b border-[#E5E0D8]">
                  Qualified Leads
                </th>
                <th className="text-right p-1.5 text-[#1E1E1E] font-semibold border-b border-[#E5E0D8]">
                  Bookings
                </th>
                <th className="text-right p-1.5 text-[#1E1E1E] font-semibold border-b border-[#E5E0D8]">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((source, index) => (
                <tr
                  key={source.name}
                  className={`${
                    index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#FBF8F4]"
                  } hover:bg-[#EDE8DF] transition-colors`}
                >
                  <td className="p-1.5 text-[#1E1E1E] font-medium border-b border-[#E5E0D8]">
                    {source.name}
                  </td>
                  <td className="p-1.5 text-right text-[#1E1E1E] border-b border-[#E5E0D8]">
                    {source.totalLeads}
                  </td>
                  <td className="p-1.5 text-right text-[#1E1E1E] border-b border-[#E5E0D8]">
                    {source.qualifiedLeads}
                  </td>
                  <td className="p-1.5 text-right text-[#1E1E1E] border-b border-[#E5E0D8]">
                    {source.bookings}
                  </td>
                  <td className="p-1.5 text-right font-semibold border-b border-[#E5E0D8]">
                    <span
                      className={`px-1 py-0.5 rounded-full text-[9px] ${
                        source.conversionRate >= 25
                          ? "bg-[#E6F4E9] text-[#2D7D46]"
                          : source.conversionRate >= 20
                          ? "bg-[#FDF5E6] text-[#E8A838]"
                          : "bg-[#FDE8E8] text-[#B31B27]"
                      }`}
                    >
                      {source.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2">
        <div className="bg-[#F5F0E8] rounded p-1.5 border border-[#E5E0D8]">
          <div className="text-[9px] text-[#5A5A5A] mb-0.5">Total Leads</div>
          <div className="text-sm font-bold text-[#1E1E1E]">
            {sourceData.reduce((sum, s) => sum + s.totalLeads, 0).toLocaleString()}
          </div>
          <div className="text-[8px] text-[#8A8A8A]">Across all sources</div>
        </div>
        <div className="bg-[#F5F0E8] rounded p-1.5 border border-[#E5E0D8]">
          <div className="text-[9px] text-[#5A5A5A] mb-0.5">Qualified Leads</div>
          <div className="text-sm font-bold text-[#6B8A3A]">
            {sourceData.reduce((sum, s) => sum + s.qualifiedLeads, 0).toLocaleString()}
          </div>
          <div className="text-[8px] text-[#8A8A8A]">
            {((sourceData.reduce((sum, s) => sum + s.qualifiedLeads, 0) / 
              sourceData.reduce((sum, s) => sum + s.totalLeads, 0)) * 100).toFixed(1)}% qualified
          </div>
        </div>
        <div className="bg-[#F5F0E8] rounded p-1.5 border border-[#E5E0D8]">
          <div className="text-[9px] text-[#5A5A5A] mb-0.5">Total Bookings</div>
          <div className="text-sm font-bold text-[#C9A84C]">
            {sourceData.reduce((sum, s) => sum + s.bookings, 0).toLocaleString()}
          </div>
          <div className="text-[8px] text-[#8A8A8A]">Closed deals</div>
        </div>
        <div className="bg-[#F5F0E8] rounded p-1.5 border border-[#E5E0D8]">
          <div className="text-[9px] text-[#5A5A5A] mb-0.5">Avg Conversion</div>
          <div className="text-sm font-bold text-[#2D7D46]">
            {(sourceData.reduce((sum, s) => sum + s.conversionRate, 0) / sourceData.length).toFixed(1)}%
          </div>
          <div className="text-[8px] text-[#8A8A8A]">Overall average</div>
        </div>
      </div>
    </div>
  );
};

// ─── 4. Combined Dashboard ────────────────────────────────────────────────────
export const DashboardCharts = () => (
  <div className="space-y-2 p-2 bg-[#FBF8F4] rounded-xl">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E5E0D8] shadow-[0_2px_8px_rgba(74,93,35,0.08)]">
        <SalesFunnel />
      </div>
      <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E5E0D8] shadow-[0_2px_8px_rgba(74,93,35,0.08)]">
        <LeadTrend />
      </div>
    </div>
    <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E5E0D8] shadow-[0_2px_8px_rgba(74,93,35,0.08)]">
      <SourcePerformance />
    </div>
  </div>
);

export default DashboardCharts;