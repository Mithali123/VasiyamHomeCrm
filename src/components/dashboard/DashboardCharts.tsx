"use client";

import { useState } from "react";
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Award, CalendarDays, TrendingUp, Users } from "lucide-react";
import { funnelStages, leadSources, leadTrendData } from "@/mock/dashboard";
import { useRouter } from "next/navigation";

// Helper Components
const CardTitle = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) => (
  <div className="mb-3 flex items-start justify-between gap-3">
    <div>
      <h2 className="text-[12px] font-bold uppercase tracking-[-.01em] text-[#15191a]">
        {title}
      </h2>
      <p className="mt-0.5 text-[8px] text-[#788085]">{subtitle}</p>
    </div>
    {action}
  </div>
);

// Sales Funnel Widget
export function SalesFunnel() {
  const router = useRouter();
  const [funnelPeriod, setFunnelPeriod] = useState("This Month");

  const handleFunnelPeriodChange = () => {
    // Cycle through periods
    const periods = ["This Month", "Last Month", "This Quarter", "This Year"];
    const currentIndex = periods.indexOf(funnelPeriod);
    const nextIndex = (currentIndex + 1) % periods.length;
    setFunnelPeriod(periods[nextIndex]);
    console.log(`Funnel period changed to: ${periods[nextIndex]}`);
  };

  const handleConversionClick = () => {
    console.log("Opening conversion details...");
    router.push("/analytics/conversion");
  };

  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <CardTitle
        title="Sales Funnel"
        subtitle="Track performance across the sales pipeline"
        action={
          <button 
            onClick={handleFunnelPeriodChange}
            className="flex h-7 items-center gap-2 rounded-md border border-[#e6e8e9] px-3 text-[8px] font-medium hover:bg-gray-50 transition-colors"
          >
            <CalendarDays size={10} /> {funnelPeriod}
          </button>
        }
      />

      <div className="grid grid-cols-[170px_1fr] gap-4">
        {/* Funnel Visualization */}
        <div className="flex h-[195px] flex-col items-center justify-center gap-[2px]">
          {funnelStages.map((item) => (
            <div
              key={item.name}
              style={{ width: `${item.width}%`, backgroundColor: item.color }}
              className="h-[22px] rounded-[2px] cursor-pointer hover:opacity-80 transition-opacity"
              aria-label={`${item.name}: ${item.leads}`}
              onClick={() => {
                console.log(`Clicked on ${item.name} stage`);
                router.push(`/leads?stage=${item.name}`);
              }}
            />
          ))}
        </div>

        {/* Funnel Data Table */}
        <div>
          <div className="grid grid-cols-[1.35fr_.6fr_.7fr_.7fr_.55fr] border-b border-[#edf0f1] pb-2 text-[7px] uppercase text-[#858c91]">
            <span>Stage</span>
            <span className="text-right">Leads</span>
            <span className="text-right">Conv. %</span>
            <span className="text-right">Drop-off %</span>
            <span className="text-right">Stage %</span>
          </div>

          {funnelStages.map((item) => (
            <div
              key={item.name}
              className="grid h-[24px] grid-cols-[1.35fr_.6fr_.7fr_.7fr_.55fr] items-center border-b border-[#f0f1f2] text-[8px] last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                console.log(`Viewing details for ${item.name}`);
                router.push(`/leads?stage=${item.name}`);
              }}
            >
              <span className="flex items-center gap-2 font-medium">
                <i className="h-1.5 w-1.5 rounded-full" style={{ background: item.color }} />
                {item.name}
              </span>
              <span className="text-right font-semibold">{item.leads}</span>
              <span className="text-right">{item.conversion}</span>
              <span
                className={
                  item.dropOff !== "—"
                    ? "text-right text-red-500"
                    : "text-right text-[#8b9195]"
                }
              >
                {item.dropOff}
              </span>
              <span className="text-right">{item.stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Ratio Summary */}
      <div 
        className="mt-2 flex h-9 items-center rounded-lg border border-[#e8e8df] bg-[#f7f8f4] px-3 cursor-pointer hover:bg-[#f0f1ed] transition-colors"
        onClick={handleConversionClick}
      >
        <Award size={15} className="text-[#d39b17]" />
        <span className="ml-2 text-[8px] font-semibold">Overall Conversion Ratio</span>
        <span className="ml-auto text-[18px] font-bold text-[#168454]">9.8%</span>
        <span className="ml-8 text-[8px] text-emerald-600">
          <TrendingUp size={9} className="inline" /> 0.6%
        </span>
        <span className="ml-1 text-[7px] text-[#777e82]">vs last month</span>
      </div>
    </section>
  );
}

// Lead Trend Widget
const trendSummary = [
  { label: "Leads", value: "4,128", color: "#07543d", icon: Users },
  { label: "Conversions", value: "264", color: "#d89a11", icon: Award },
  { label: "Bookings", value: "47", color: "#087a67", icon: TrendingUp },
];

export function LeadTrend() {
  const router = useRouter();
  const [period, setPeriod] = useState("Month");

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    console.log(`Period changed to: ${newPeriod}`);
    // You can add API call here to fetch data for the selected period
  };

  const handleLegendClick = (label: string) => {
    console.log(`Legend clicked: ${label}`);
    if (label === "Leads") {
      router.push("/leads");
    } else if (label === "Conversions") {
      router.push("/analytics/conversions");
    } else if (label === "Bookings") {
      router.push("/bookings");
    }
  };

  const handleSummaryClick = (label: string) => {
    console.log(`Summary clicked: ${label}`);
    if (label === "Leads") {
      router.push("/leads");
    } else if (label === "Conversions") {
      router.push("/analytics/conversions");
    } else if (label === "Bookings") {
      router.push("/bookings");
    }
  };

  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <CardTitle
        title="Lead Trend"
        subtitle="Growth of leads, conversions and bookings over time"
        action={
          <div className="flex overflow-hidden rounded-md border border-[#e4e6e7]">
            {["Week", "Month", "Quarter", "Year"].map((item) => (
              <button
                key={item}
                onClick={() => handlePeriodChange(item)}
                className={`h-7 px-4 text-[7.5px] transition-colors ${
                  period === item
                    ? "bg-[#073d2e] text-white"
                    : "bg-white text-[#42484b] hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />

      {/* Legend - Clickable */}
      <div className="mb-1 flex justify-center gap-6 text-[8px] text-[#2d3335]">
        <span 
          className="cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => handleLegendClick("Leads")}
        >
          <i className="mr-2 inline-block h-1.5 w-3 rounded bg-[#073d2e]" />
          Leads
        </span>
        <span 
          className="cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => handleLegendClick("Conversions")}
        >
          <i className="mr-2 inline-block h-1.5 w-3 rounded bg-[#df9e12]" />
          Conversions
        </span>
        <span 
          className="cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => handleLegendClick("Bookings")}
        >
          <i className="mr-2 inline-block h-1.5 w-3 rounded bg-[#087a67]" />
          Bookings
        </span>
      </div>

      {/* Chart */}
      <div className="h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={leadTrendData}
            margin={{ top: 8, right: 12, left: -22, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              axisLine={{ stroke: "#dfe3e4" }}
              tickLine={false}
              tick={{ fontSize: 8, fill: "#737a7e" }}
            />
            <YAxis
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8, fill: "#737a7e" }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#e5e7e8", fontSize: 10 }}
            />
            <Line
              type="linear"
              dataKey="leads"
              stroke="#073d2e"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "#073d2e" }}
            />
            <Line
              type="linear"
              dataKey="conversions"
              stroke="#df9e12"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "#df9e12" }}
            />
            <Line
              type="linear"
              dataKey="bookings"
              stroke="#087a67"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "#087a67" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats - Clickable */}
      <div className="grid grid-cols-3 border-t border-[#edf0f1] pt-3">
        {trendSummary.map(({ label, value, color, icon: Icon }) => (
          <div 
            key={label} 
            className="flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => handleSummaryClick(label)}
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f7f5]"
              style={{ color }}
            >
              <Icon size={14} />
            </span>
            <span>
              <small className="block text-[8px] text-[#7b8286]">{label}</small>
              <b className="text-[15px]" style={{ color }}>
                {value}
              </b>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Lead Sources Widget
export function LeadSources() {
  const router = useRouter();

  const handleViewAll = () => {
    console.log("View all lead sources clicked");
    router.push("/analytics/sources");
  };

  const handleSourceClick = (sourceName: string) => {
    console.log(`Source clicked: ${sourceName}`);
    router.push(`/leads?source=${sourceName}`);
  };

  const handleTotalLeadsClick = () => {
    console.log("Total leads clicked");
    router.push("/leads");
  };

  return (
    <section className="h-full rounded-xl border border-[#e5e7e8] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,.03)]">
      <CardTitle
        title="Lead Sources"
        subtitle="Where your leads are coming from"
        action={
          <button 
            onClick={handleViewAll}
            className="rounded-md border border-[#e6e8e9] px-3 py-1.5 text-[7.5px] hover:bg-gray-50 transition-colors"
          >
            View all
          </button>
        }
      />

      <div className="flex items-center gap-5">
        {/* Donut Chart */}
        <div className="relative h-[126px] w-[126px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leadSources}
                dataKey="value"
                innerRadius={39}
                outerRadius={61}
                paddingAngle={1}
                stroke="#fff"
                strokeWidth={1}
              >
                {leadSources.map((item) => (
                  <Cell 
                    key={item.name} 
                    fill={item.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleSourceClick(item.name)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text - Clickable */}
          <div 
            className="pointer-events-auto absolute inset-0 flex cursor-pointer flex-col items-center justify-center hover:bg-gray-50/50 rounded-full transition-colors"
            onClick={handleTotalLeadsClick}
          >
            <b className="text-[15px]">4,128</b>
            <span className="text-[7px] text-[#777e82]">Total Leads</span>
          </div>
        </div>

        {/* Source List - Clickable */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {leadSources.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-2 text-[8px] cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors"
              onClick={() => handleSourceClick(item.name)}
            >
              <span className="truncate">
                <i
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: item.color }}
                />
                {item.name}
              </span>
              <b>{item.value.toLocaleString()}</b>
              <span className="text-[#8a9094]">({item.percent})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}