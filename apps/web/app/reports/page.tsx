"use client";
import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Activity, BarChart3, Calendar, CheckCircle2, TrendingUp, Users } from "lucide-react";

// Simple inlined chart using canvas for zero-deps demo
function MiniBar({ data }: { data: number[] }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = (c.width = c.offsetWidth * devicePixelRatio);
    const h = (c.height = c.offsetHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.clearRect(0, 0, w, h);
    const max = Math.max(...data, 1);
    const bw = (c.offsetWidth - 16) / data.length;
    data.forEach((v, i) => {
      const x = 8 + i * bw;
      const barH = (v / max) * (c.offsetHeight - 16);
      ctx.fillStyle = "#6366f1"; // indigo-500
      ctx.beginPath();
      ctx.roundRect(x, c.offsetHeight - barH - 8, bw * 0.72, barH, 6);
      ctx.fill();
    });
  }, [data]);
  return <canvas ref={ref} className="h-24 w-full" />;
}

const metrics = [
  { label: "Total Candidates", value: 189, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Interviews Scheduled", value: 42, icon: Calendar, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Offers Extended", value: 9, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Hires", value: 6, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-100" },
];

export default function ReportsPage() {
  const pipeline = useMemo(() => ({
    applied: [28, 22, 35, 40, 31, 29, 33],
    screening: [16, 10, 18, 22, 17, 13, 14],
    interview: [10, 12, 9, 11, 12, 10, 8],
    offer: [2, 1, 3, 2, 2, 1, 3],
    hires: [1, 0, 1, 1, 2, 0, 1],
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl p-6">
        <header className="flex items-center gap-3 pb-6">
          <motion.div initial={{ rotate: -8, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <BarChart3 className="h-6 w-6" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
            <p className="text-sm text-slate-500">Pipeline analytics and week-over-week recruiting performance.</p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">{m.label}</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">{m.value}</div>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${m.bg} ${m.color}`}>
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 rounded-lg border border-slate-100 bg-white p-2">
                <MiniBar data={[6, 8, 7, 9, 11, 10, 12].map(v => Math.round(v * (0.8 + Math.random() * 0.4)))} />
              </div>
            </motion.div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 text-slate-700">
            <Activity className="h-4 w-4 text-indigo-600" /> Weekly pipeline breakdown
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {Object.entries(pipeline).map(([k, data]) => (
              <div key={k} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-slate-600">{k}</div>
                <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2">
                  <MiniBar data={data} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
