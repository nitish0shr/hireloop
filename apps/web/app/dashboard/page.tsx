"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Placeholder data
const jobHealth = [
  { title: "Senior Backend Engineer", status: "On Track", applicants: 124, interviews: 18, offers: 2, health: 82 },
  { title: "Product Designer", status: "At Risk", applicants: 86, interviews: 10, offers: 1, health: 56 },
  { title: "Data Scientist", status: "Blocked", applicants: 43, interviews: 6, offers: 0, health: 31 },
  { title: "Sales Lead", status: "On Track", applicants: 210, interviews: 25, offers: 3, health: 88 },
];

const heatmapWeeks = 12;

function HealthBadge({ value }: { value: number }) {
  const color = value > 75 ? "bg-emerald-500/15 text-emerald-400" : value > 50 ? "bg-amber-500/15 text-amber-400" : "bg-rose-500/15 text-rose-400";
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{value}%</span>;
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    "On Track": "bg-emerald-500/10 text-emerald-400",
    "At Risk": "bg-amber-500/10 text-amber-400",
    "Blocked": "bg-rose-500/10 text-rose-400",
  };
  return <span className={`px-2 py-1 rounded-full text-xs ${map[status] || "bg-slate-500/10 text-slate-400"}`}>{status}</span>;
}

function Heatmap() {
  // generate 7 x heatmapWeeks grid of intensity values
  const cells = useMemo(() => Array.from({ length: 7 * heatmapWeeks }, () => Math.floor(Math.random() * 4)), []);
  const shades = ["bg-slate-700/40", "bg-indigo-500/30", "bg-indigo-500/50", "bg-indigo-500/80"];
  return (
    <div className="grid grid-rows-7 grid-flow-col gap-1">
      {cells.map((v, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.01 * i, type: "spring", stiffness: 120, damping: 12 }}
          className={`h-3 w-3 rounded ${shades[v]}`}
          title={`Activity: ${v}`}
        />
      ))}
    </div>
  );
}

function MiniSpark({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-8 text-indigo-400">
      <polyline fill="none" stroke="currentColor" strokeWidth="3" points={points} />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-8 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm">Overview of hiring performance and pipeline health</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700">Export</button>
          <button className="px-3 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-900/30">Create Job</button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Jobs", value: 18, delta: "+2 this week" },
          { label: "New Applicants", value: 562, delta: "+14% vs last week" },
          { label: "Interviews", value: 74, delta: "+9 scheduled" },
          { label: "Time to Hire", value: "32d", delta: "-3 days" },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
          >
            <div className="text-slate-400 text-xs">{m.label}</div>
            <div className="flex items-end justify-between mt-2">
              <div className="text-2xl font-semibold">{m.value}</div>
              <div className="text-xs text-emerald-400">{m.delta}</div>
            </div>
            <div className="mt-2"><MiniSpark values={[12, 15, 20, 18, 22, 26, 24, 30]} /></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Health Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Job Health</h2>
            <button className="text-xs text-slate-400 hover:text-slate-200">View all</button>
          </div>
          {jobHealth.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              whileHover={{ scale: 1.01 }}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="text-sm text-slate-400">{job.title}</div>
                  <div className="flex items-center gap-2">
                    <StatusChip status={job.status} />
                    <HealthBadge value={job.health} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-sm text-slate-300">
                  <div>
                    <div className="text-slate-400 text-xs">Applicants</div>
                    <div className="font-medium">{job.applicants}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Interviews</div>
                    <div className="font-medium">{job.interviews}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Offers</div>
                    <div className="font-medium">{job.offers}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Candidate Overview with Heatmap */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Candidate Activity</h2>
            <button className="text-xs text-slate-400 hover:text-slate-200">Last 12 weeks</button>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <Heatmap />
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="text-slate-400 text-xs">Responses</div>
                <div className="text-lg font-semibold">68%</div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="text-slate-400 text-xs">Positive</div>
                <div className="text-lg font-semibold text-emerald-400">41%</div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="text-slate-400 text-xs">Declines</div>
                <div className="text-lg font-semibold text-rose-400">9%</div>
              </div>
            </div>
          </div>

          {/* Actionable Insights Panel */}
          <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-900 p-4">
            <h3 className="text-base font-medium mb-2">Actionable Insights</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Interviews for Backend Engineer trending up 24% WoW — add 2 more slots Friday.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                Designer pipeline thin — consider boosting outreach or relaxing Figma plugin experience.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                Data Scientist role blocked — missing hiring manager feedback on 4 candidates.
              </li>
            </ul>
            <div className="mt-3">
              <button className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700">View suggestions</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
