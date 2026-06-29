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
import { Filter, Trophy } from "lucide-react";

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

type FunnelStage = {
  name: string;
  count: number;
  conversion: string;
  dropOff: string;
  stagePercent: string;
  color: string;
  topWidth: number;
  bottomWidth: number;
  isLast?: boolean;
};
type TrendData = { date: string; leads: number; conversions: number; bookings: number };
type SourceData = {
  name: string;
  totalLeads: number;
  qualifiedLeads: number;
  bookings: number;
  conversionRate: number;
};

// ─── Theme Colors (Brand Color System) ───────────────────────────────────────
const COLORS = {
  primaryGreen: "#133C27",
  darkGreen: "#0d2e1d",
  mutedGreen: "#215B38",
  royalGold: "#C9A82C",
  premiumGold: "#B8960F",
  warmCream: "#F8F5EE",
  pureWhite: "#FFFFFF",
  secondaryBg: "#F1E9D4",
  borderColor: "#E8E2D6",
  textPrimary: "#1A3C2A",
  textSecondary: "#6B7283",
  textMuted: "#9AA1A9",
  btnSecondaryBorder: "#D8CFB9",
  // Charts & Funnel
  chartLeadTrend: "#133C27",
  chartConversion: "#C9A82C",
  chartBookings: "#215B38",
  chartGrid: "#E8E2D6",
  funnelStart: "#133C27",
  funnelEnd: "#215B38",
  funnelLost: "#9AA1A9",
};

// ─── Shared Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d2e1d] border border-[#C9A82C]/20 p-2 rounded-xl shadow-lg">
      {label && (
        <p className="text-[#F8F5EE] text-[10px] font-bold mb-1 border-b border-[#C9A82C]/10 pb-1">
          {label}
        </p>
      )}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5 last:mb-0">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: item.color || item.fill || item.payload?.fill }}
          />
          <span className="text-[#D8CFB9] text-[9px] flex-1">{item.name}</span>
          <span className="text-[#F8F5EE] text-[9px] font-bold">
            {item.value}
            {item.unit || item.payload?.unit || ""}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const funnelStages: FunnelStage[] = [
  { name: "New Leads", count: 1248, conversion: "100%", dropOff: "—", stagePercent: "100%", color: "#7D1F1D", topWidth: 46, bottomWidth: 36 },
  { name: "Contacted", count: 842, conversion: "67.4%", dropOff: "32.6%", stagePercent: "67.4%", color: "#A82E2B", topWidth: 36, bottomWidth: 28 },
  { name: "Qualified", count: 512, conversion: "40.9%", dropOff: "26.5%", stagePercent: "40.9%", color: "#D26929", topWidth: 28, bottomWidth: 22 },
  { name: "Site Visit", count: 256, conversion: "20.5%", dropOff: "20.4%", stagePercent: "20.5%", color: "#D99B26", topWidth: 22, bottomWidth: 17 },
  { name: "Negotiation", count: 189, conversion: "15.1%", dropOff: "5.4%", stagePercent: "15.1%", color: "#A18A32", topWidth: 17, bottomWidth: 13 },
  { name: "Won", count: 156, conversion: "12.5%", dropOff: "2.6%", stagePercent: "12.5%", color: "#6C8341", topWidth: 13, bottomWidth: 10 },
  { name: "Lost", count: 98, conversion: "—", dropOff: "—", stagePercent: "—", color: "#1D5C39", topWidth: 10, bottomWidth: 10, isLast: true },
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

const getTrapezoidPoints = (topWidth: number, bottomWidth: number, height: number = 32) => {
  const x_top_left = 25 - topWidth / 2;
  const x_top_right = 25 + topWidth / 2;
  const x_bottom_left = 25 - bottomWidth / 2;
  const x_bottom_right = 25 + bottomWidth / 2;
  return `${x_top_left},2 ${x_top_right},2 ${x_bottom_right},${height - 2} ${x_bottom_left},${height - 2}`;
};

// ─── 1. Sales Funnel (Enterprise CRM) ─────────────────────────────────────────
export const SalesFunnel = () => (
  <div className="bg-white rounded-[18px] border border-[#E8E2D6] shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 h-full">
    {/* Title */}
    <div className="flex items-center gap-2 mb-0.5">
      <Filter size={15} className="text-[#1A3C2A]" />
      <h3 className="text-[#1A3C2A] text-sm font-bold">Sales Funnel</h3>
    </div>
    <p className="text-[#6B7283] text-[10px] mb-4">Lead progression through the sales pipeline</p>

    {/* Column Headers */}
    <div className="grid grid-cols-[50px_1fr_40px_70px_70px_50px] gap-x-1 text-[8px] font-bold text-[#6B7283] uppercase tracking-wider mb-2 px-0.5">
      <span />
      <span>Stage</span>
      <span className="text-right">Count</span>
      <span className="text-right">Conversion %</span>
      <span className="text-right">Drop-off %</span>
      <span className="text-right">Stage %</span>
    </div>

    {/* Separator */}
    <div className="h-px bg-[#E8E2D6] mb-2" />

    {/* Funnel Stages */}
    <div className="space-y-1">
      {funnelStages.map((stage) => (
        <div key={stage.name} className="grid grid-cols-[50px_1fr_40px_70px_70px_50px] gap-x-1 items-center h-[32px]">
          {/* Funnel Segment SVG */}
          <div className="w-[50px] h-[32px] flex items-center justify-center">
            <svg width="50" height="32" viewBox="0 0 50 32">
              {stage.isLast ? (
                <path
                  d={`M ${25 - stage.topWidth / 2},2 L ${25 + stage.topWidth / 2},2 L ${25 + stage.bottomWidth / 2
                    },24 A ${stage.bottomWidth / 2},${stage.bottomWidth / 2} 0 0,1 ${25 - stage.bottomWidth / 2
                    },24 Z`}
                  fill={stage.color}
                />
              ) : (
                <polygon
                  points={getTrapezoidPoints(stage.topWidth, stage.bottomWidth)}
                  fill={stage.color}
                />
              )}
            </svg>
          </div>

          {/* Stage Name */}
          <div className="flex items-center gap-1.5 pl-1">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            <span className="text-[10px] font-semibold text-[#1A3C2A] truncate">
              {stage.name}
            </span>
          </div>

          {/* Count */}
          <span className="text-[11px] font-bold text-[#1A3C2A] text-right">
            {stage.count.toLocaleString()}
          </span>

          {/* Conversion */}
          <span className="text-[10px] text-[#1A3C2A] text-right">{stage.conversion}</span>

          {/* Drop-off */}
          <span
            className={`text-[10px] font-medium text-right ${stage.dropOff !== "—" ? "text-[#B91C1C]" : "text-[#9AA1A9]"
              }`}
          >
            {stage.dropOff}
          </span>

          {/* Stage % */}
          <span className="text-[10px] text-[#1A3C2A] text-right">{stage.stagePercent}</span>
        </div>
      ))}
    </div>

    {/* Separator */}
    <div className="h-px bg-[#E8E2D6] mt-3 mb-3" />

    {/* Overall Conversion Ratio */}
    <div className="flex items-center justify-between bg-[#F8F5EE] rounded-xl px-4 py-3 border border-[#E8E2D6]">
      <div className="flex items-center gap-2">
        <Trophy size={12} className="text-[#C59A2C]" />
        <span className="text-[10px] font-bold text-[#1A3C2A] uppercase tracking-wider">Overall Conversion Ratio</span>
      </div>
      <span className="text-xl font-bold text-[#C59A2C]">16.8%</span>
    </div>
  </div>
);

// ─── 2. Lead Trend ────────────────────────────────────────────────────────────
export const LeadTrend = () => (
  <div className="w-full h-full">
    <div className="mb-1.5">
      <h3 className="text-[#1A3C2A] text-sm font-bold">Lead Trend</h3>
      <p className="text-[#6B7283] text-[10px]">Monthly growth in leads, conversions & bookings</p>
    </div>
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={leadTrendData}
          margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderColor} />
          <XAxis dataKey="date" stroke={COLORS.textMuted} tick={{ fontSize: 10 }} />
          <YAxis stroke={COLORS.textMuted} tick={{ fontSize: 10 }} />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '10px', paddingTop: '3px' }}
            iconSize={8}
          />
          <Line
            type="monotone"
            dataKey="leads"
            stroke={COLORS.chartLeadTrend}
            strokeWidth={2}
            dot={{ fill: COLORS.chartLeadTrend, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="conversions"
            stroke={COLORS.chartConversion}
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ fill: COLORS.chartConversion, r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke={COLORS.chartBookings}
            strokeWidth={2}
            strokeDasharray="2 2"
            dot={{ fill: COLORS.chartBookings, r: 3 }}
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

export const SourcePerformance = () => {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("all");
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  // Sort data by the selected metric
  const sortedData = [...sourceData].sort((a, b) => {
    if (activeMetric === "all") return b.totalLeads - a.totalLeads;
    return (b[activeMetric] as number) - (a[activeMetric] as number);
  });

  // Bar colors for different metrics
  const barColors = {
    totalLeads: "#133C27",
    qualifiedLeads: "#215B38",
    bookings: "#C9A82C",
    conversionRate: "#B8960F",
  };

  const visibleBars = activeMetric === "all"
    ? [
        { key: "totalLeads", label: "Total Leads", color: barColors.totalLeads },
        { key: "qualifiedLeads", label: "Qualified Leads", color: barColors.qualifiedLeads },
        { key: "bookings", label: "Bookings", color: barColors.bookings },
      ]
    : [
        {
          key: activeMetric,
          label: METRIC_TABS.find(t => t.key === activeMetric)?.label || activeMetric,
          color: barColors[activeMetric as keyof typeof barColors] || "#133C27",
        },
      ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
        <div>
          <h3 className="text-[#1A3C2A] text-sm font-bold">Source Performance</h3>
          <p className="text-[#6B7283] text-[10px]">Lead quality & conversion by channel</p>
        </div>
        <div className="flex items-center gap-1">
          {/* View toggle */}
          <div className="flex bg-[#F1E9D4] rounded p-0.5">
            <button
              onClick={() => setViewMode("chart")}
              className={`px-2 py-0.5 text-[9px] rounded ${viewMode === "chart" ? "bg-white shadow" : "text-[#6B7283]"}`}
            >
              Chart
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2 py-0.5 text-[9px] rounded ${viewMode === "table" ? "bg-white shadow" : "text-[#6B7283]"}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex flex-wrap gap-1 mb-2">
        {METRIC_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveMetric(tab.key)}
            className={`px-2.5 py-0.5 text-[9px] rounded-full transition-colors ${activeMetric === tab.key
                ? "bg-[#133C27] text-white"
                : "bg-[#F1E9D4] text-[#6B7283] hover:bg-[#E8E2D6]"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {viewMode === "chart" ? (
        <div className="w-full h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.borderColor} />
              <XAxis
                dataKey="name"
                stroke={COLORS.textMuted}
                tick={{ fontSize: 9 }}
                angle={-45}
                textAnchor="end"
                height={30}
              />
              <YAxis stroke={COLORS.textMuted} tick={{ fontSize: 9 }} />
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
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded border border-[#E8E2D6]">
          <table className="w-full text-[10px]">
            <thead className="bg-[#F1E9D4]">
              <tr>
                <th className="text-left p-1.5 text-[#1A3C2A] font-semibold border-b border-[#E8E2D6]">
                  Source
                </th>
                <th className="text-right p-1.5 text-[#1A3C2A] font-semibold border-b border-[#E8E2D6]">
                  Total Leads
                </th>
                <th className="text-right p-1.5 text-[#1A3C2A] font-semibold border-b border-[#E8E2D6]">
                  Qualified Leads
                </th>
                <th className="text-right p-1.5 text-[#1A3C2A] font-semibold border-b border-[#E8E2D6]">
                  Bookings
                </th>
                <th className="text-right p-1.5 text-[#1A3C2A] font-semibold border-b border-[#E8E2D6]">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((source, index) => (
                <tr
                  key={source.name}
                  className={`${index % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F8F5EE]"
                    } hover:bg-[#F1E9D4] transition-colors`}
                >
                  <td className="p-1.5 text-[#1A3C2A] font-medium border-b border-[#E8E2D6]">
                    {source.name}
                  </td>
                  <td className="p-1.5 text-right text-[#1A3C2A] border-b border-[#E8E2D6]">
                    {source.totalLeads}
                  </td>
                  <td className="p-1.5 text-right text-[#1A3C2A] border-b border-[#E8E2D6]">
                    {source.qualifiedLeads}
                  </td>
                  <td className="p-1.5 text-right text-[#1A3C2A] border-b border-[#E8E2D6]">
                    {source.bookings}
                  </td>
                  <td className="p-1.5 text-right font-semibold border-b border-[#E8E2D6]">
                    <span
                      className={`px-1 py-0.5 rounded-full text-[9px] ${source.conversionRate >= 25
                          ? "bg-[#E8F5EC] text-[#1A5C27]"
                          : source.conversionRate >= 20
                            ? "bg-[#FDF5E1] text-[#B8960F]"
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
        <div className="bg-[#F1E9D4] rounded p-1.5 border border-[#E8E2D6]">
          <div className="text-[9px] text-[#6B7283] mb-0.5">Total Leads</div>
          <div className="text-sm font-bold text-[#1A3C2A]">
            {sourceData.reduce((sum, s) => sum + s.totalLeads, 0).toLocaleString()}
          </div>
          <div className="text-[8px] text-[#9AA1A9]">Across all sources</div>
        </div>
        <div className="bg-[#F1E9D4] rounded p-1.5 border border-[#E8E2D6]">
          <div className="text-[9px] text-[#6B7283] mb-0.5">Qualified Leads</div>
          <div className="text-sm font-bold text-[#3A8B4D]">
            {sourceData.reduce((sum, s) => sum + s.qualifiedLeads, 0).toLocaleString()}
          </div>
          <div className="text-[8px] text-[#9AA1A9]">
            {((sourceData.reduce((sum, s) => sum + s.qualifiedLeads, 0) /
              sourceData.reduce((sum, s) => sum + s.totalLeads, 0)) * 100).toFixed(1)}% qualified
          </div>
        </div>
        <div className="bg-[#F1E9D4] rounded p-1.5 border border-[#E8E2D6]">
          <div className="text-[9px] text-[#6B7283] mb-0.5">Total Bookings</div>
          <div className="text-sm font-bold text-[#C9A82C]">
            {sourceData.reduce((sum, s) => sum + s.bookings, 0).toLocaleString()}
          </div>
          <div className="text-[8px] text-[#9AA1A9]">Closed deals</div>
        </div>
        <div className="bg-[#F1E9D4] rounded p-1.5 border border-[#E8E2D6]">
          <div className="text-[9px] text-[#6B7283] mb-0.5">Avg Conversion</div>
          <div className="text-sm font-bold text-[#1A5C27]">
            {(sourceData.reduce((sum, s) => sum + s.conversionRate, 0) / sourceData.length).toFixed(1)}%
          </div>
          <div className="text-[8px] text-[#9AA1A9]">Overall average</div>
        </div>
      </div>
    </div>
  );
};

// ─── 4. Combined Dashboard ────────────────────────────────────────────────────
export const DashboardCharts = () => (
  <div className="space-y-2 p-2 bg-[#F8F5EE] rounded-xl">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6] shadow-[0_2px_8px_rgba(26,92,39,0.08)]">
        <SalesFunnel />
      </div>
      <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6] shadow-[0_2px_8px_rgba(26,92,39,0.08)]">
        <LeadTrend />
      </div>
    </div>
    <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2D6] shadow-[0_2px_8px_rgba(26,92,39,0.08)]">
      <SourcePerformance />
    </div>
  </div>
);

export default DashboardCharts;